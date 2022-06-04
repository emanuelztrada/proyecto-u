import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup'; 
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation newClient($input: ClientInput){
        newClient(input: $input) {
            id
            firstname
            lastname
            email
            business
            phone
        }
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


const nuevoCliente = () => {
    const router = useRouter(); 
    //mensaje de error
    const [mensaje, guardarMensaje] = useState(null); 

    //mutation
    const [ newClient ] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { newClient } }) {
            //obtenemos el objeto de cache que queremos actualizar
            const { getClientSeller } = cache.readQuery({ query: GET_CLIENTE_SELLER}); 
            //Reescribimos el cache (el cache nunca se debe de modificar)
            cache.writeQuery({
                query: GET_CLIENTE_SELLER,
                data: {
                    getClientSeller: [...getClientSeller, newClient]
                }
            })
        }
    });


    const formik = useFormik({
        initialValues: {
            nombre: '', 
            apellido: '', 
            empresa: '', 
            email: '', 
            telefono: ''
        }, 
        validationSchema: Yup.object({
            nombre: Yup.string()
                            .required('El nombre es obligatorio'),
            apellido: Yup.string()
                            .required('El apellido es obligatorio'),
            empresa: Yup.string()
                            .required('El campo empresa es obligatorio'),
            email: Yup.string()
                            .required('El campo email es obligatorio')
                            .email('El email no es valido')
        }), 
        onSubmit: async valores => {
            // console.log(valores)
            const {nombre, apellido, empresa, email, telefono} = valores; 
            try {
                const { data } = await newClient({
                    variables: {
                        input: {
                            firstname: nombre, 
                            lastname: apellido, 
                            business: empresa, 
                            email: email, 
                            phone: telefono
                        }
                    }
                });

                router.push('/'); 
                console.log(data.newClient); 
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    guardarMensaje(null)
                }, 2000)
                // console.log(error); 
            }
        }
    }); 

    const mostrarMensaje = () =>{
        return(
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-red-600'>
                <p>{mensaje}</p>
            </div>
        ); 
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form 
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="nombre"
                                type="text"
                                placeholder='nombre cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                        </div>

                        { formik.touched.nombre && formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null }


                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                                Apellido
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="apellido"
                                type="text"
                                placeholder='apellido cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellido}
                            />
                        </div>

                        { formik.touched.apellido && formik.errors.apellido ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="email"
                                type="email"
                                placeholder='email cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </div>

                        { formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                                Empresa
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="empresa"
                                type="text"
                                placeholder='empresa cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.empresa}
                            />
                        </div>

                        { formik.touched.empresa && formik.errors.empresa ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.empresa}</p>
                            </div>
                        ) : null }

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                                Telefono
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id="telefono"
                                type="tel"
                                placeholder='telefono cliente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                            />
                        </div>

                        { formik.touched.telefono && formik.errors.telefono ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.telefono}</p>
                            </div>
                        ) : null }

                        <input 
                            type="submit"
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                            value="Registrar cliente"
                        />
                    </form>
                </div> 
            </div>
        </Layout>
    ); 
}

export default nuevoCliente;