import { useState, useEffect } from 'react'
import { Header_principal } from '../components/Header_principal'
import { Menu_perfil } from '../components/Menu_perfil';

import actualizarDireccion from '../firebase/agregarDireccion';
import useGetDataUser from './../hooks/useGetDataUser';
import ExcelToJson from '../components/ExcelToJson';

import { FormularioDirecciones } from '../components/FormularioDirecciones';
import { auth, db } from './../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

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

    // const [cp, setCp] = useState('');
    // const [colonias, setColonias] = useState([]);
    // const [coloniaSeleccionada, setColoniaSeleccionada] = useState('');
    // const [municipio, setMunicipio] = useState('');
    // const [estado, setEstado] = useState('');

    const userData = useGetDataUser({});



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
                                            <Link to='/upload'>Upload</Link>
                                        </div>
                                    ))
                                }
                            </div>
                            
                        </div>
                        ) : (
                            <FormularioDirecciones showForm={showForm} setShowForm={setShowForm} direccionEditar={direccionEditando} onGuardado={finalizarGuardado}/>
                            // <div className={`container_form_add_direccion animate__animated  ${showForm ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`}>
                            //     <div className='title_form'>
                            //         <button onClick={() => setShowForm(false)}><IoArrowBackCircleSharp /> Regresar</button>
                            //         <p>Agregar dirección de entrega</p>
                            //     </div>
                            //     <form onSubmit={handleSubmit}>
                            //         <div className='box_input_label'>
                            //             <label>Nombre de dirección</label>
                            //             <input type='text' name='direccion' placeholder='Ej. Bodega' onChange={handleChange} />
                            //         </div>

                            //         <div className='box_input_label'>
                            //             <label>Calle</label>
                            //             <input type='text' name='calle'  onChange={handleChange} />
                            //         </div>

                            //         <div className='column_box_input'>
                            //             <div className='box_input_label sm_box'>
                            //                 <label>Numero Exterior</label>
                            //                 <input type='text' name='numero_exterior' onChange={handleChange} />
                            //             </div>

                            //             <div className='box_input_label sm_box'>
                            //                 <label>Numero Interior</label>
                            //                 <input type='text' name='numero_interior' onChange={handleChange} />
                            //             </div>
                            //         </div>
                            //         <div className='column_box_input'>
                            //             <div className='box_input_label sm_box'>
                            //                 <label>Código postal</label>
                            //                 <input
                            //                     type="text"
                            //                     value={cp}
                            //                     onChange={handleChangeCP}
                            //                     style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
                            //                 />
                            //             </div>

                            //             <div className='box_input_label sm_box'>
                            //                 <label>Estado</label>
                            //                 <input name='estado' type="text" value={estado} readOnly />
                            //             </div>
                            //         </div>

                            //         <div className='box_input_label'>
                            //             <label>Colonia o Localidad</label>
                            //             <select
                            //                 value={coloniaSeleccionada}
                            //                 onChange={handleSelectColonia}
                            //                 disabled={colonias.length === 1}
                            //                 style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
                            //             >
                            //                 <option value="">-- Selecciona una colonia --</option>
                            //                 {colonias.map((colonia, index) => (
                            //                     <option key={index} value={colonia}>
                            //                     {colonia}
                            //                     </option>
                            //                 ))}
                            //             </select>
                            //         </div>

                            //         <div className='box_input_label'>
                            //             <label>Municipio o Ciudad</label>
                            //             <input type='text' name='municipio' value={municipio} readOnly />
                            //         </div>

                            //         <div className='box_input_label'>
                            //             <label>Referencias</label>
                            //             <input type='text' name='referencia' onChange={handleChange} />
                            //         </div>

                            //         <div className='box_input_label'>
                            //             <button>Guardar</button>
                            //         </div>
                            //     </form>
                            // </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>

  )
}
