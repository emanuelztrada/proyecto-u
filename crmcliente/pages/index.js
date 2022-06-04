import React from "react";
import Cliente from '../components/Cliente'; 
import Head from 'next/head';
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from "next/router";
import Link from "next/link";

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

const Index = () => {
  const router = useRouter();

  //Consulta de apollo
  const { data, loading, error, refetch } = useQuery(GET_CLIENTE_SELLER);
  // console.log('Index ----->', data);

  setTimeout(() => {
    refetch();
  }, 3000); 

  if(loading){
    refetch(); 
    return 'Cargando...'
  }; 

  if(!data.getClientSeller){
    router.push('/login');
  }

  return (
    <div>
      {
        <Layout>
          <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>

          <Link href="/nuevocliente">
            <a 
              className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
              Nuevo cliente
            </a>
          </Link>

          <table className='table-auto shandow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Nombre</th>
                <th className='w-1/5 py-2'>Empresa</th>
                <th className='w-1/5 py-2'>Email</th>
                <th className='w-1/5 py-2'>Empresa</th>
                <th className='w-1/5 py-2'>Eliminar</th>
                <th className='w-1/5 py-2'>Editar</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              { (data && data.getClientSeller || []).map(e  => (
                  <Cliente 
                    key={e.id}
                    cliente={e}
                  />
                )
              )}
            </tbody>
          </table>
        </Layout>
      }
    </div>  
  );
}

export default Index; 