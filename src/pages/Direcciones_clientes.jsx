import React, { useState } from 'react'
import { Header_principal } from '../components/Header_principal'
import { Menu_perfil } from '../components/Menu_perfil';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import actualizarDireccion from '../firebase/agregarDireccion';

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

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({ ...dataForm, [name]: value })
    };

    const handleSubmit = async(evt) => {
        evt.preventDefault();
        await actualizarDireccion({userId: 'xZtzTv9k1QSTkjcQklsqAvKeR1B3', newAddress: dataForm}).then(() => {
            console.log('Actualizado !!!')
            setShowForm(!showForm)
        }).catch((error) => {
            console.log('Error: ', error)
        })
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
                                <button className='btn_add_data' onClick={() => setShowForm(true)}>+ Nueva dirección</button>
                            </div>

                            <div className='container_cards_address'>
                                <div className='row_direccion'>
                                    <h3>CEDIFA</h3>
                                    <p><strong>Calle:</strong> AV LAGO DE XOCHIMILCO <strong>Num. Ext:</strong> 212, <strong>Num. Int:</strong> 1ER PISO, <strong>Colonia o Alcaldia:</strong> EVOLUCION 24 SUPER</p>
                                    <p><strong>Municipio o Localidad:</strong> NEZAHUALCOYOTL, <strong>CP:</strong> 57699, <strong>Referencias:</strong> ENTRE AVENIDA PANTITLAN Y FLAMINGOS</p>
                                </div>
                                <div className='row_direccion'>
                                    <h3>CEDIFA</h3>
                                    <p><strong>Calle:</strong> AV LAGO DE XOCHIMILCO <strong>Num. Ext:</strong> 212, <strong>Num. Int:</strong> 1ER PISO, <strong>Colonia o Alcaldia:</strong> EVOLUCION 24 SUPER</p>
                                    <p><strong>Municipio o Localidad:</strong> NEZAHUALCOYOTL, <strong>CP:</strong> 57699, <strong>Referencias:</strong> ENTRE AVENIDA PANTITLAN Y FLAMINGOS</p>
                                </div>
                                <div className='row_direccion'>
                                    <h3>CEDIFA</h3>
                                    <p><strong>Calle:</strong> AV LAGO DE XOCHIMILCO <strong>Num. Ext:</strong> 212, <strong>Num. Int:</strong> 1ER PISO, <strong>Colonia o Alcaldia:</strong> EVOLUCION 24 SUPER</p>
                                    <p><strong>Municipio o Localidad:</strong> NEZAHUALCOYOTL, <strong>CP:</strong> 57699, <strong>Referencias:</strong> ENTRE AVENIDA PANTITLAN Y FLAMINGOS</p>
                                </div>
                                <div className='row_direccion'>
                                    
                                    <h3>CEDIFA</h3>
                                    <p><strong>Calle:</strong> AV LAGO DE XOCHIMILCO <strong>Num. Ext:</strong> 212, <strong>Num. Int:</strong> 1ER PISO, <strong>Colonia o Alcaldia:</strong> EVOLUCION 24 SUPER</p>
                                    <p><strong>Municipio o Localidad:</strong> NEZAHUALCOYOTL, <strong>CP:</strong> 57699, <strong>Referencias:</strong> ENTRE AVENIDA PANTITLAN Y FLAMINGOS</p>
                                </div>
                                <div className='row_direccion'>
                                    <h3>CEDIFA</h3>
                                    <p><strong>Calle:</strong> AV LAGO DE XOCHIMILCO <strong>Num. Ext:</strong> 212, <strong>Num. Int:</strong> 1ER PISO, <strong>Colonia o Alcaldia:</strong> EVOLUCION 24 SUPER</p>
                                    <p><strong>Municipio o Localidad:</strong> NEZAHUALCOYOTL, <strong>CP:</strong> 57699, <strong>Referencias:</strong> ENTRE AVENIDA PANTITLAN Y FLAMINGOS</p>
                                </div>
                            </div>
                            
                        </div>
                        ) : (
                            <div className={`container_form_add_direccion animate__animated  ${showForm ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`}>
                                <div className='title_form'>
                                    <button onClick={() => setShowForm(false)}><IoArrowBackCircleSharp /> Regresar</button>
                                    <p>Agregar dirección de entrega</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className='box_input_label'>
                                        <label>Nombre de dirección</label>
                                        <input type='text' name='direccion' placeholder='Ej. Bodega' onChange={handleChange} />
                                    </div>

                                    <div className='box_input_label'>
                                        <label>Calle</label>
                                        <input type='text' name='calle' placeholder='Ej. Lago Atitlan    ' onChange={handleChange} />
                                    </div>

                                    <div className='column_box_input'>
                                        <div className='box_input_label sm_box'>
                                            <label>Numero Exterior</label>
                                            <input type='text' name='numero_exterior' placeholder='Ej. 201' onChange={handleChange} />
                                        </div>

                                        <div className='box_input_label sm_box'>
                                            <label>Numero Interior</label>
                                            <input type='text' name='numero_interior' placeholder='Ej. 1ER PISO' onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='box_input_label'>
                                        <label>Colonia o Localidad</label>
                                        <input type='text' name='colonia' placeholder='Ej. AGUA AZUL' onChange={handleChange} />
                                    </div>

                                    <div className='box_input_label'>
                                        <label>Municipio o Ciudad</label>
                                        <input type='text' name='municipio' placeholder='Ej. NEZAHUALCOYOTL' onChange={handleChange} />
                                    </div>

                                    <div className='column_box_input'>
                                        <div className='box_input_label sm_box'>
                                            <label>Código postal</label>
                                            <input type='text' name='codigo_postal' placeholder='Ej. 57500' onChange={handleChange} />
                                        </div>

                                        <div className='box_input_label sm_box'>
                                            <label>Estado</label>
                                            <input type='text' name='estado' placeholder='Ej. ESTADO DE MEXICO' onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='box_input_label'>
                                        <label>Referencias</label>
                                        <input type='text' name='referencia' placeholder='Ej. ESQUINA AV. CHIMALHUACAN' onChange={handleChange} />
                                    </div>

                                    <div className='box_input_label'>
                                        <button>Guardar</button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>

  )
}
