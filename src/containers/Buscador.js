import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useFormik } from 'formik';
import { url } from '../apis/apis'
import { db } from '../firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';


export default function Buscador() {
    const [informacion, setInformacion] = useState(null)
    const [listarCarrito, setListarCarrito] = useState()
    const [cambiar, setCambiar] = useState(false)

    const formik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: e => {
            axios.get(`${url}?s=${e.search}`)
                .then((e) => {
                    setInformacion(e.data.drinks)
                })
        },
    });

    const sendFirebase = (e) => {
        const addLicor = {
            idDrink: e.idDrink,
            strCategory: e.strCategory,
            strDrink: e.strDrink,
            strGlass: e.strGlass,
            strInstructions: e.strInstructions,
            strTags: e.strTags
        };


        addDoc(collection(db, "lista"), addLicor)
            .then((resp) => {
                console.log(resp)
                setCambiar(true)
            })
            .catch((error) => {
                console.log(error);
            });
        setCambiar(false)
    };
    console.log(cambiar)
    const getFirebase = async () => {
        const querySnapshot = await getDocs(collection(db, "lista"));
        const licores = [];
        querySnapshot.forEach((doc) => {
            licores.push({
                id: doc.id,
                ...doc.data()
            });
        });
        setListarCarrito(licores);
    };

    const deleteFirebase = async (e) => {
        if (cambiar === true) {
            await deleteDoc(doc(db, "lista", e.id))
            setCambiar(true)
        }else{
            setCambiar(false)
        }
        
        
    }

    useEffect(() => {
        getFirebase()
    }, [cambiar,listarCarrito])



    return (
        <div className="w-full items-center justify-center">
            <form onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4 text-[#2D4263] text-xl ">Lista de Cocteles</h1>
                <div className="w-full flex items-center justify-center text-center">
                    <input
                        className="p-2 text-center rounded-sm"
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Ingresa el nombre"
                        onChange={formik.handleChange}
                    />
                    <button className="p-2 ml-2 bg-[#DA7F8F] rounded-sm" type="submit">Buscar</button>
                </div>
            </form>
            <div className="w-full flex flex-row justify-center ">
                <div className="w-1/4 flex flex-col ">
                    {
                        informacion && informacion.map(e => (
                            <div key={e.idDrink} className=" flex flex-col bg-[#DA7F8F] m-2 rounded-lg p-2">
                                <p className="text-[#2D4263]">Nombre: </p>
                                {e.strDrink}
                                <p className="text-[#2D4263]">Tags:</p>
                                {e.strTags === null ? "No tiene" : e.strTags}
                                <p className="text-[#2D4263]">Instrucciones:</p>
                                {e.strInstructions}
                                <p className="text-[#2D4263]">Vaso / Copa:</p>
                                {e.strGlass}
                                <p className="text-[#2D4263]">Categoria:</p>
                                {e.strCategory}
                                <button onClick={() => sendFirebase(e)} className="p-2 bg-green-200 rounded-lg" type="button">Adiccionar pedido</button>
                            </div>
                        ))
                    }
                </div>
                <div className="flex flex-col w-1/4">
                    <p className="text-[#2D4263] text-xl text-center mb-4">Pedido</p>
                    {

                        listarCarrito && listarCarrito.map(e => (
                            <div className="flex flex-col mb-4" key={e.id}>
                                <h1 className="text-center">{e.strDrink}</h1>
                                <button onClick={() => { deleteFirebase(e) }} className="p-2 bg-red-200 rounded-lg" type="button">Eliminar</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )

}