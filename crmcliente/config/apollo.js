import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
// import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
    fetch
}); 

const authLink = setContext((_, {headers}) => {
    //Leer el storage almacenado
    const token = localStorage.getItem('token'); 

    return {
        headers : {
            ...headers, 
            authorization: token ? `Bearer ${token}` : ''
        }
    }
}); 


const client = new ApolloClient({
    cache: new InMemoryCache(), 
    link: authLink.concat( httpLink )
}); 

//Se puede usar solo este y comentar lo demas 
// const client = new ApolloClient({
//     cache: new InMemoryCache(), 
//     link: new HttpLink({
//         uri: "http://localhost:4000/",
//         fetch
//     })
// }); 
    
export default client; 