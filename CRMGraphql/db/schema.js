const { gql } = require('apollo-server'); 

//Schema para que devuelva uno solo coloca Curso en obtenerCursos
const typeDefs = gql`
    type Curso {
       titulo: String
    }

    type Tecnologia {
       titulo: String
       tecnologia: String 
    }

    input CursoInput {
        tecnologia: String
    }

    input TecnologiaInput {
        tecnologia: String 
    }

    type Query {
        obtenerCursos(input: CursoInput!) : [Curso]
        obtenerTecnologia(input: TecnologiaInput!): [Tecnologia]
    }
`;  

//Para llamar con query variables
/*query obtenerCursos($input: CursoInput!) {
    obtenerCursos(input: $input) {
      titulo
    }
}

{
  "input": {
    "tecnologia" : "Node.js" 
  }
}*/
module.exports = typeDefs; 