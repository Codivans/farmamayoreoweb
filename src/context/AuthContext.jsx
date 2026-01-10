import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

//Creamos el contexto
const AuthContext = React.createContext();

//Hook para acceder al contexto
const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [usuario, setUsuario] = useState([]);
    const [cargando, setCargando] = useState(true);
	const [userName, setUserName] = useState([])
	const [estatus, setEstatus] = useState(false)

	useEffect(() => {
		const cancelarSuscripcion = onAuthStateChanged(auth, async (usuarioAuth) => {
			setUsuario(usuarioAuth);

			if (usuarioAuth) {
			const ref = doc(db, "usuarios", usuarioAuth.uid);
			const snap = await getDoc(ref);

			if (snap.exists()) {
				const data = snap.data();
				setEstatus(data.status); // 👈 aquí
			} else {
				setEstatus(false);
			}
			} else {
			setEstatus(false);
			}

			setCargando(false);
			setUserName(JSON.parse(localStorage.getItem("UserState")));
		});

		return cancelarSuscripcion;
	}, []);



    return (
		<AuthContext.Provider value={{usuario: usuario, userName, setUserName, estatus, setEstatus}}>
			{/* Solamente retornamos los elementos hijos cuando no este cargando. 
			De esta forma nos aseguramos de no cargar el resto de la app hasta que el usuario haya sido establecido.
			
			Si no hacemos esto al refrescar la pagina el componente children intenta cargar inmediatamente, 
			antes de haber comprobado que existe un usuario. */}
			{!cargando && children}
		</AuthContext.Provider>
	);


}


export {AuthProvider, AuthContext, useAuth};