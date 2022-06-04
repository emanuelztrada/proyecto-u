const { ApolloServer } = require('apollo-server'); 
const typeDefs = require('./db/schema'); 
const resolvers = require('./db/resolvers'); 

//servidor 
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const myContext = "HOla"; 

        return {
            myContext
        }
    }
}); 

//arrancar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);    
})