import { useState, useEffect } from 'react';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import codigosPostales from './../jsons/codigos_postales.json';

import { auth, db } from './../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const FormularioDirecciones = ({ direccionEditar, onGuardado, showForm, setShowForm }) => {
    const [form, setForm] = useState({
        cp: '',
        colonia: '',
        municipio: '',
        estado: '',
        tipoDireccion: '',
        calle: '',
        numeroExt: '',
        numeroInt: '',
        referencias: ''
    });

    const [colonias, setColonias] = useState([]);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (direccionEditar) {
        setForm(direccionEditar);
        const resultado = codigosPostales.find((item) => item.cp.toString() === direccionEditar.cp);
        if (resultado) setColonias(resultado.colonias);
        }
    }, [direccionEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (!name) {
            console.warn("⚠️ Campo sin nombre detectado:", e.target);
            return; // evita asignar al objeto form con clave vacía
        }

        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'cp') {
            const resultado = codigosPostales.find((item) => item.cp.toString() === value);
            if (resultado) {
                setColonias(resultado.colonias);
                setForm((prev) => ({
                    ...prev,
                    municipio: resultado.municipio,
                    estado: resultado.estado,
                    colonia: resultado.colonias.length === 1 ? resultado.colonias[0] : ''
                }));
            } else {
                setColonias([]);
                setForm((prev) => ({ ...prev, municipio: '', estado: '', colonia: '' }));
            }
        }
    };

    const validar = () => {
        const nuevosErrores = {};
        ['cp', 'colonia', 'municipio', 'estado', 'tipoDireccion', 'calle', 'numeroExt'].forEach((campo) => {
        if (!form[campo]) nuevosErrores[campo] = 'Requerido';
        });
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const limpiarDireccion = (dir) => {
        const nueva = {};
        for (let clave in dir) {
            if (
                clave.trim() !== '' &&
                dir[clave] !== undefined &&
                dir[clave] !== null &&
                !(typeof dir[clave] === 'string' && dir[clave].trim() === '')
            ) {
                nueva[clave] = dir[clave];
            }
        }
        return nueva;
    };

    const guardar = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, 'usuarios', user.uid);

        if (direccionEditar) {
        // Editando: eliminar vieja y agregar nueva
        await updateDoc(ref, {
            direcciones: arrayRemove(direccionEditar)
        });
        }

        const nuevaDireccion = limpiarDireccion({ ...form, fechaActualizada: new Date().toISOString() });
        // console.log('🧪 Dirección lista para guardar:', nuevaDireccion);

        await updateDoc(ref, {
        direcciones: arrayUnion(nuevaDireccion)
        });

        if (onGuardado) onGuardado();
        setForm({
            cp: '',
            colonia: '',
            municipio: '',
            estado: '',
            tipoDireccion: '',
            calle: '',
            numeroExt: '',
            numeroInt: '',
            referencias: ''
        });
        setColonias([]);
        setErrores({});
    };

  return (
    <div className={`container_form_add_direccion animate__animated  ${showForm ? 'animate__fadeIn' : 'animate__fadeIn'}`}>
        <div className='title_form'>
            <button 
                onClick={() => setShowForm(false)}
                className='btn_return'
            >
                <IoArrowBackCircleSharp /> Regresar
            </button>
            <p>{direccionEditar ? 'Editar Dirección' : 'Nueva Dirección'}</p>
        </div>
        <form onSubmit={guardar}>
            <div className='box_input_label'>
                <label>Nombre de dirección</label>
                <input type='text' name='tipoDireccion' value={form.tipoDireccion} onChange={handleChange} />
                {errores.tipoDireccion && <p style={{ color: 'red' }}>{errores.tipoDireccion}</p>}
            </div>

            <div className='box_input_label'>
                <label>Calle</label>
                <input type='text' name='calle'  value={form.calle} onChange={handleChange} />
            </div>

            <div className='column_box_input'>
                <div className='box_input_label sm_box'>
                    <label>Numero Exterior</label>
                    <input type='text' name='numeroExt' value={form.numeroExt} onChange={handleChange} />
                </div>

                <div className='box_input_label sm_box'>
                    <label>Numero Interior</label>
                    <input type='text' name='numeroInt' value={form.numeroInt} onChange={handleChange} />
                </div>
            </div>
            <div className='column_box_input'>
                <div className='box_input_label sm_box'>
                    <label>Código postal</label>
                    <input
                        type="text"
                        name="cp"
                        value={form.cp}
                        onChange={handleChange}
                        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
                    />
                </div>

                <div className='box_input_label sm_box'>
                    <label>Estado</label>
                    <input name='estado' type="text" value={form.estado} readOnly />
                </div>
            </div>

            <div className='box_input_label'>
                <label>Colonia o Localidad</label>
                <select
                    name="colonia"
                    value={form.colonia}
                    onChange={handleChange}
                    disabled={colonias.length === 1}
                >
                    <option value="">Selecciona una colonia</option>
                        {colonias.map((c, i) => (
                        <option key={i} value={c}>
                            {c}
                    </option>
                    ))}
                </select>
            </div>

            <div className='box_input_label'>
                <label>Municipio o Ciudad</label>
                <input type='text' name='municipio' value={form.municipio} readOnly />
            </div>

            <div className='box_input_label'>
                <label>Referencias</label>
                <input type='text' name='referencias' value={form.referencias} onChange={handleChange} />
            </div>

            <div className='box_input_label'>
                <button>{direccionEditar ? 'Actualizar' : 'Guardar'}</button>
            </div>
        </form>
    </div>
  )
}
