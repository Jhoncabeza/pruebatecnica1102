import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useFormik } from 'formik';
import { url } from '../apis/apis'
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';


export default function Buscador() {
    const [informacion, setInformacion] = useState(null)
    const [listarCarrito, setListarCarrito] = useState()

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
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getFirebase = async () => {
        const querySnapshot = await getDocs(collection(db, "lista"));
        const licores = [];
        querySnapshot.forEach((doc) => {
            licores.push({
                ...doc.data(),
            });
        });
        setListarCarrito(licores);
    };


    useEffect(() => {
        getFirebase()
    }, [])



    return (
        <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
                <h1 className="text-center text-[#2D4263] text-xl ">Lista de cocteles</h1>
                <div className="w-1/2 flex justify-center text-center">
                    <input
                        className="rounded-sm"
                        type="text"
                        name="search"
                        id="search"
                        placeholder="search"
                        onChange={formik.handleChange}
                    />
                    <button className="p-2 ml-2 bg-[#DA7F8F] rounded-sm" type="submit">Buscar</button>
                </div>

                {
                    informacion && informacion.map(e => (
                        <div key={e.idDrink} className="w-1/2 bg-[#DA7F8F] m-2 rounded-lg p-2">
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
                    ))}

                {
                    listarCarrito && listarCarrito.map(e => (
                        <div key={e.idDrink}>
                            <h1>{e.strDrink}</h1>
                            <button className="p-2 bg-red-200 rounded-lg" type="button">Eliminar</button>
                        </div>
                    ))
                }
            </form>
        </div>
    )

}