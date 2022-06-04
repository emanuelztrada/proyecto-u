const { userSchema, productSchema, clientSchema, orderSchema} = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env'}); 

const createToken = (user, secret, expiresIn) =>{
    console.log(user); 
    const {id, email, firstname, lastname } = user; 
    //Dentro de este en Paylod nosotros pasamos la informacion que queremos ver
    return jwt.sign( {id, email, firstname, lastname}, secret, {expiresIn} )
}

//Resolvers 
const resolvers = {
    Query : {
        getUser: async (_, {token}) =>{ 
            const userId = await jwt.verify(token, process.env.SECRET ); 
            return userId; 
        },
        getUsers: async(_, {}, ctx) =>{
            return ctx.user; 
        },
        getProduct: async () =>{
            try {
                const products = await productSchema.find({}); 
                return products; 
            } catch (error) {
                console.log(error);
            }
        },
        getProductId: async(_, { id }) =>{
            //Revisamos que el producto exista
            const product = await productSchema.findById(id); 
            if(!product){
                throw new Error('Product not exist'); 
            }

            return product; 
        },
        getClient: async () =>{ 
            try {
                const client = await clientSchema.find({}); 
                return client; 
            } catch (error) {
                console.log(error); 
            }
        },
        getClientSeller: async(_, {}, ctx) => {
            try {
                const client = await clientSchema.find({ seller: ctx.user.id.toString() }); 
                return client; 
            } catch (error) {
                console.log(error); 
            }
        },
        getClientId: async(_, {id}, ctx) =>{ 
            //Revisar si el cliente existe o no
            const client = await clientSchema.findById(id); 
            if(!client){
                throw new Error('Cliente no encontrado'); 
            }

            //Quien lo creo puedo verlo
            if(client.seller.toString() !== ctx.user.id){
                throw new Error('No tienes las credenciales'); 
            }

            return client; 
        },
        getOrders: async () =>{
            try {
                const order = await orderSchema.find({}); 
                return order; 
            } catch (error) {
                console.log(error);
            }
        },
        getOrdersSeller: async(_, {}, ctx) =>{
            try {
                const order = await orderSchema.find({seller: ctx.user.id}); 
                return order;
            } catch (error) {
                console.log(error); 
            }
        },
        getOrderId: async(_, {id}, ctx) =>{
            //Validamos que exista el pedido
            const order = await orderSchema.findById(id); 
            if(!order){
                throw new Error('No existe el pedido'); 
            }
            //Solo el que lo creo 
            if(order.seller.toString() !== ctx.user.id){
                throw new Error('Acciion no permitida'); 
            }
            //Retornamos result
            return order;
        },
        getOrderStatus: async(_, {estado}, ctx) => {
            const order = await orderSchema.find({ seller: ctx.user.id, estado }); 
            return order; 
        },
        mejoresClientes: async() =>{
            const client = await orderSchema.aggregate([
                //match sirve para filtrar desde la base de datos
                { $match : {estado : "COMPLETADO"}},
                { $group: {
                    _id: "$client",
                    total: {$sum : '$total'}
                }}, 
                {
                    $lookup: {
                        from : 'clientes',
                        localField: '_id',
                        foreignField: "_id", 
                        as: 'client'
                    }
                }, 
                //con $sort ordenamos de mayor a menor 
                {
                    $sort: {total: -1}
                }
            ]); 
            return client;
        },
        mejoresVendedores: async() =>{
            const seller = await orderSchema.aggregate([
                {$match: {estado : "COMPLETADO"}}, 
                {$group: {
                    _id: "$seller", 
                    total: {$sum : '$total'}
                }},
                {
                    $lookup: {
                        from: 'users', 
                        localField: '_id', 
                        foreignField: '_id', 
                        as: 'vendedor'
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort: { total : -1}
                }
            ]); 
            return seller; 
        },
        buscarProducto: async(_, {texto}) =>{
            const products = await productSchema.find({$text : { $search: texto }}).limit(10); 
            return products;
        }
    },

    Mutation : {
        newUser : async (_, { input }) => {
            const {email, password } = input; 
            console.log(input);
            //Revisamos si el usuario ya existe
            const existUser = await userSchema.findOne({email}); 
            if(existUser){
                throw new Error('The user is register');
            }

            //Hasear su password
            const salt = await bcrypt.genSaltSync(10); 
            input.password = await bcrypt.hashSync(password, salt); 
                
            try {
                //Guardar en la base de  datos
                const user = new userSchema(input); 
                user.save(); //guardarlo en la base de datos
                return user; 
            } catch (error) {
                console.log(error); 
            }
        },
        authenticationUser: async (_, {input} ) => {
            const {email, password} = input; 

            //Si existe el usuario
            const existUser = await userSchema.findOne({email}); 
            if(!existUser){
                throw new Error('the user is not registered');
            }

            //Revisar si el password es correcto 
            const passwordCorrect = await bcrypt.compare(password, existUser.password); 
            if(!passwordCorrect){
                throw new Error('The password is incorrect');
            }

            return{
                token : createToken(existUser, process.env.SECRET, '24h')
            }

        },
        newProduct: async(_, {input}) =>{
            try {
                const product = new productSchema(input); 
                const result = await product.save(); 
                return result;
            } catch (error) {
                console.log(error); 
            }
        },
        updateProduct: async(_, {id, input}) =>{
            let product = await productSchema.findById(id); 
            if(!product){
                throw new Error('Product not exist'); 
            }

            product = await productSchema.findOneAndUpdate({_id : id}, input, {new: true}); 
            return product; 

        },
        deleteProduct: async(_, {id}) => {
            let product = await productSchema.findById(id); 
            if(!product){
                throw new Error('Product not exist'); 
            }

            await productSchema.findByIdAndDelete({_id: id}); 
            return "Producto eliminado"; 
        },
        newClient: async(_, {input}, ctx) =>{
            console.log(ctx); 
            const { email } = input; 
            //Verificamos si existe el usuario
            const client = await clientSchema.findOne({email}); 
            if(client){
                throw new Error('El cliente ya existe'); 
            }

            const clientNew = new clientSchema(input); 

            //Asignamos el vendedor 
            clientNew.seller =  ctx.user.id;

            //Guardamos en la base de datos
            try {
                const result = await clientNew.save(); 
                return result; 
            } catch (error) {
                console.log(Error); 
            }
        },
        updateClient: async(_, {id, input}, ctx) =>{
            //Si existe
            let client = await clientSchema.findById(id); 
            if(!client){
                throw new Error('Ese cliente no existe'); 
            }
            //Verificar si el vendedor es quien edita
            if(client.seller.toString() !== ctx.user.id){
                throw new Error('No tienes las credenciales'); 
            }
            //Guardar el client
            client = await clientSchema.findOneAndUpdate({_id:  id}, input, {new: true}); 
            return client; 
        }, 
        deleteClient: async(_, {id}, ctx) =>{
            //Si existe
            let client = await clientSchema.findById(id); 
            if(!client){
                throw new Error('Ese cliente no existe'); 
            }
            //Verificar si el vendedor es quien edita
            if(client.seller.toString() !== ctx.user.id){
                throw new Error('No tienes las credenciales'); 
            }

            //Eliminamos el cliente
            await clientSchema.findOneAndDelete({_id: id});
            return "Cliente eliminado"; 
        }, 
        newPedido: async(_, {input}, ctx) =>{
            const { client } = input; 
            //Verificar si existe el cliente
            let existClient = await clientSchema.findById(client); 
            if(!existClient){
                throw new Error('Ese cliente no existe'); 
            }

            //Verficiar el cliente es del vendedor
            if(existClient.seller.toString() !== ctx.user.id){
                throw new Error('No tienes las credenciales'); 
            }
            //Revisar el stok disponible  
            //#Creamos un for asyncrono
            for await (const articulo of input.pedido){
                const { id } = articulo; 
                console.log(input);     
                const product = await productSchema.findById(id); 
                if(articulo.quantity > product.existence){
                    throw new Error(`El articulo: ${product.name} excede la cantidad existente`);
                }else{ 
                    //Restamos la cantidad de disponible con lo solicitado
                    product.existence = product.existence - articulo.quantity; 
                    await product.save();
                }
            }

            //Crear un nuevo pedido 
            const newPedido = new orderSchema(input); 
            //asignarle un vendedor
            newPedido.seller = ctx.user.id; 
            //guardar en la base de datos
            const result = await newPedido.save(); 
            return result; 
        }, 
        updateOrderId: async(_, {id, input}, ctx) => {
            const {client} = input; 
            //validamos que existe
            const existOrder = await orderSchema.findById(id); 
            if(!existOrder){
                throw new Error('El pedido no existe'); 
            }
            //validamos que el cliente existe
            const existClient = await clientSchema.findById(client); 
            if(!existClient){
                throw new Error('El cliente no existe'); 
            }
            //validamos que sea del vendedor
            if(existClient.seller.toString() !== ctx.user.id){
                throw new Error('No tienes las credenciales'); 
            }
            //revisamos el stock 
            for await (const articulo of input.pedido){
                const { id } = articulo; 
                // console.log(input);     
                const product = await productSchema.findById(id); 
                if(articulo.quantity > product.existence){
                    throw new Error(`El articulo: ${product.name} excede la cantidad existente`);
                }else{ 
                    //Restamos la cantidad de disponible con lo solicitado
                    product.existence = product.existence - articulo.quantity; 
                    await product.save();
                }
            }
            //guardamos el pedido
            const result = await orderSchema.findOneAndUpdate({_id : id }, input, {new: true}); 
            return result; 
        },
        deleteOrderId: async(_, {id}, ctx) => {
            //validamos que exista
            const order = await orderSchema.findById(id); 
            if(!order){
                throw new Error('El pedido no existe'); 
            }
            //validamos que el vendidor es quien lo borrara
            if(order.seller.toString() !== ctx.user.id){ 
                throw new Error('No puedes eliminarlo'); 
            }            

            //eliminamos de la base de datos
            await orderSchema.findOneAndDelete({_id: id}); 
            return 'Pedido eliminado';
        }
    }
}

module.exports = resolvers; 