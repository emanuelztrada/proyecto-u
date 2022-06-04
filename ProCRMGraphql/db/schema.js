const { gql } = require('apollo-server'); 

//Schema 
const typeDefs = gql`
    type NewUser {
        id: ID
        firstname: String
        lastname : String 
        email : String
        create: String
    }

    type Product {
        id: ID
        name: String
        existence: String
        price: String
        create: String
    }

    type Client {
        id: ID
        firstname: String
        lastname: String
        business: String
        email: String
        phone: String
        seller: ID
    }

    type Order{
        id: ID
        pedido: [orderGroup]
        total: Float
        client: ID
        seller: ID
        estado: EstadoPedido
    }

    type orderGroup {
        id: ID
        quantity: Int
    }

    type TopClient{
        total: Float
        client: [Client]
    }

    type TopVendedor{
        total: Float
        vendedor: [NewUser]
    }

    type Token {
        token : String!
    }
    
    input UserInput {
        firstname: String!
        lastname : String!
        email : String!
        password: String!
    }

    input AuthenticationUser{
        email: String!
        password: String! 
    }

    input ProductInput {
        name: String!
        existence: Int!
        price: Float!
    }

    input ClientInput{
        firstname: String!
        lastname: String!
        business: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input OrderInput{
        pedido: [OrderProductInput]
        total: Float
        client: ID
        estado: EstadoPedido
    }

    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    type Query {
        #obtener usuario con token
        getUser(token: String!) : NewUser
        getUsers: NewUser

        #obtener productos
        getProduct: [Product]

        #obtener solo un producto
        getProductId(id: ID!): Product

        #Obtener clientes
        getClient: [Client]
        #Obtener clientes vendedor
        getClientSeller: [Client]
        #Obtener cliente con id
        getClientId(id: ID!) : Client

        #pedidos 
        getOrders: [Order]
        getOrdersSeller: [Order]
        getOrderId(id: ID!) : Order
        getOrderStatus(estado: String!) : [Order]

        #Busquedas avanzadas
        mejoresClientes: [TopClient]
        mejoresVendedores: [TopVendedor]
        buscarProducto(texto: String!) : [Product]
    }

    type Mutation {
        #User
        newUser(input: UserInput) : NewUser
        authenticationUser(input: AuthenticationUser) : Token
        
        #Product
        newProduct(input: ProductInput) : Product 
        updateProduct(id: ID!, input: ProductInput) : Product
        deleteProduct(id: ID!) : String

        #Clientes
        newClient(input: ClientInput) : Client
        updateClient(id: ID!, input: ClientInput) : Client
        deleteClient(id: ID!) : String

        #Ordenes o pedidos 
        newPedido(input: OrderInput) : Order
        updateOrderId(id: ID!, input: OrderInput) : Order
        deleteOrderId(id: ID!) : String
    }

`;  

module.exports = typeDefs; 