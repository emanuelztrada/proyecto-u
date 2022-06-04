const { ApolloServer } = require('apollo-server'); 
const { resolvers, typeDefs } = require("./db");
const { connection } = require("./config"); 
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env'}); 

//Conectar a la base de datos 
connection(); 

//servidor 
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
      // console.log(req.headers); 
      const token = req.headers['authorization'] || ''; 
      if(token){
        try {
          const user = jwt.verify(token.replace('Bearer ' , ''), process.env.SECRET);
          console.log(user);
          return {
            user
          }
        } catch (error) {
          console.log(`Hubo un error`. error); 
        }
      }
    }
}); 

//arrancar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);    
})