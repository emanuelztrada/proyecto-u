import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const GET_USER = gql`
    query getUsers{
        getUsers{
            id
            firstname
            lastname
            email 
        }
    }
`; 

const Header = () => {
    const router = useRouter(); 
    //query de apollo
    const { data, loading, error, refetch} = useQuery(GET_USER); 
    // console.log(data); 
    // console.log(loading); 

    //Proteger que no accedamos a data antes de resultados
    if(loading){
        refetch(); 
        return 'Cargando...'
    }; 

    if(!data.getUsers) {
        router.push('/login');
        return <p>Cargando...</p>
    }

    const { firstname, lastname } = data.getUsers; 

    const cerrarSesion = () =>{
        localStorage.removeItem('token'); 
        router.push('/login');
    }


    return (
        <div className="flex justify-between mb-6">
            <p className="mr-2">Hola: {firstname} {lastname}</p>
            <button 
                onClick={() => cerrarSesion() }
                type="button"
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
            >
                Cerrar sesión
            </button>
        </div>
    ); 
}

export default Header; 