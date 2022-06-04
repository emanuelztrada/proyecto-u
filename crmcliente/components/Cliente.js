import React from 'react'; 
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMIAR_CLIENTE = gql`
    mutation deleteClient($id: ID!){
        deleteClient(id: $id)
    }
`;

const GET_CLIENTE_SELLER = gql`
    query getClientSeller{
      getClientSeller {
        id
        firstname
        lastname
        email
        business
      }
    }
`;


const Cliente = ({cliente}) => {
    //mutation
    const [deleteClient] = useMutation(ELIMIAR_CLIENTE, {
        update(cache) {
            //Obtener una copia del objeto de cache
            const { getClientSeller } = cache.readQuery({ query : GET_CLIENTE_SELLER}); 
            //Reescribir el cache
            cache.writeQuery({
                query: GET_CLIENTE_SELLER, 
                data: {
                    getClientSeller: getClientSeller.filter(clientActual => clientActual.id !== id)
                }
            })
        }
    }); 
    
    const {firstname, lastname, email, business, id} = cliente; 

    const confirmarEliminarCliente = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este cliente?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar'
          }).then( async(result) => {
            if (result.isConfirmed) {
                console.log(id)
                try {
                    //eliminar por id
                    const {data} = await deleteClient({
                        variables: {
                            id
                        }
                    }); 
                    console.log(data);

                    //mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.deleteClient,
                        'success'
                    )
                } catch (error) {
                    console.log(error); 
                }
            }
          })
    }

    const editarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]", 
            query: { id }
        })
    }

    return(
        <tr>
            <td className="border px-4 py-2">{firstname}</td>
            <td className="border px-4 py-2">{lastname}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">{business}</td>
            <td className="border px-4 py-2">
                <button 
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => confirmarEliminarCliente() }
                >
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button 
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => editarCliente() }
                >
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </td>
        </tr>
    )
}

export default Cliente; 