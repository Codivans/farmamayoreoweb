import { useState, useEffect } from 'react'
import { Header_principal } from '../components/Header_principal'
import { Menu_perfil } from '../components/Menu_perfil';
import { FormularioDirecciones } from '../components/FormularioDirecciones';
import { auth, db } from './../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';

export const Direcciones_clientes = () => {
    const [showForm, setShowForm] = useState(false);
    const [dataForm, setDataForm] = useState({
        direccion: '',
        calle: '',
        numero_exterior: '',
        numero_interior: '',
        colonia: '',
        municipio: '',
        codigo_postal: '',
        estado: '',
        referencias: ''
    });

    const [direcciones, setDirecciones] = useState([]);
    const [direccionEditando, setDireccionEditando] = useState(null);

    const obtenerDirecciones = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, 'usuarios', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
        const data = snap.data();
        setDirecciones(data.direcciones || []);
        }
    };

    const eliminarDireccion = async (direccion) => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, 'usuarios', user.uid);
        await updateDoc(ref, {
        direcciones: arrayRemove(direccion),
        });

        obtenerDirecciones();
    };

    const iniciarEdicion = (direccion) => {
        setDireccionEditando(direccion);
        setShowForm(!showForm)
    };

    const finalizarGuardado = () => {
        setDireccionEditando(null);
        obtenerDirecciones();
    };

    useEffect(() => {
        obtenerDirecciones();
    }, []);

    const handleClick = () => {
        setShowForm(!showForm)
        finalizarGuardado();
    }

  return (
    <>
        <Header_principal />

        <div className='container_perfil'>
            <Menu_perfil />
            <div className='container_data_panel'>
                <div className='container_formularios_direcciones'>
                    {
                        showForm != true ? (
                        <div className={`container_rows_direcciones animate__animated  ${showForm ? 'animate__bounceOutLeft' : 'animate__bounceInLeft'}`}>
                            <div className='botonera_perfil'>
                                <button className='btn_add_data' onClick={() => handleClick()}>+ Nueva dirección</button>
                            </div>

                            <div className='container_cards_address'>

                                {
                                    direcciones.map((dir, i) => (
                                        <div className='row_direccion' key={i}>
                                            <h3>{dir.tipoDireccion}</h3>
                                            <p><strong>Calle:</strong> {dir.calle} <strong>Num. Ext:</strong> {dir.numeroExt}, <strong>Num. Int:</strong> {dir.numeroInt}, <strong>Colonia o Alcaldia:</strong> {dir.colonia}</p>
                                            <p><strong>Municipio o Localidad:</strong> {dir.municipio}, <strong>CP:</strong> {dir.cp}, <strong>Referencias:</strong> {dir.referencias}</p>

                                            <button onClick={() => iniciarEdicion(dir)}>✏️ Editar</button>
                                            <button onClick={() => eliminarDireccion(dir)}>🗑️ Eliminar</button>
                                            
                                        </div>
                                    ))
                                }
                            </div>
                            
                        </div>
                        ) : (
                            <FormularioDirecciones showForm={showForm} setShowForm={setShowForm} direccionEditar={direccionEditando} onGuardado={finalizarGuardado}/>
                        )
                    }
                </div>
            </div>
        </div>
    </>

  )
}
