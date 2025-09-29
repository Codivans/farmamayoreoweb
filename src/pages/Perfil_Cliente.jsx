import React, { useState } from 'react';
import { Header_principal } from './../components/Header_principal';
import { Menu_perfil } from '../components/Menu_perfil';
import { TiUser } from "react-icons/ti";
import { FaStreetView } from "react-icons/fa6";
import { HiDocumentCheck } from "react-icons/hi2";
import { IoMdCart } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import direccionesDeEnvio from '../hooks/direccionesDeEnvio';
import { Footer } from '../components/Footer';

export const Perfil_Cliente = () => {

    const [showTab, setShowTab] = useState('direccion');
    const user = direccionesDeEnvio('xZtzTv9k1QSTkjcQklsqAvKeR1B3')

    console.log(user)

    const direcciones = user.length > 0 ? user : []
  return (
    <>
        <Header_principal />
        <div className='container_perfil'>
            {/* <Menu_perfil />
            <div className='container_data_panel'>
                <div className='data_perfil'>
                    <p><strong>Nombre: </strong> Iván Ayala Garnica</p>
                    <p><strong>Direccion:</strong> Calle 17 #8, Col. Las Aguilas, CP: 57900, Nezahualcóyotl</p>
                </div>
                <div className='container_direcciones'>
                    <div className='data_direccion'>
                        <h3>CEDIFA</h3>
                        <p><strong>Calle:</strong> Calle 17</p>
                        <p><strong>Numero Exterior:</strong> 8</p>
                        <p><strong>Numero Interior:</strong> 1er piso</p>
                        <p><strong>Colonia:</strong> Las Aguilas</p>
                        <p><strong>Municipio o Delegación:</strong> Nezahualcóyotl</p>
                        <p><strong>Codigo Postal:</strong> 57900</p>
                    </div>
                </div>
            </div> */}

            <div className='container_tab'>
                <div className='items_tab'>
                    <button onClick={() => setShowTab('perfil')}><TiUser /> Mi perfil</button>
                    <button onClick={() => setShowTab('direccion')}><FaStreetView /> Direcciones de envio</button>
                    <button onClick={() => setShowTab('fiscal')}><HiDocumentCheck /> Información fiscal</button>
                    <button onClick={() => setShowTab('pedidos')}><IoMdCart /> Mis pedidos</button>
                </div>
                <div className='data_item_tab'>
                    <div className={`data_item ${showTab === 'perfil' ? 'show_data_tab' : ''}`}>
                        <h2>Mi perfil</h2>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem excepturi explicabo illo minus ipsum aliquid fugit. Error, voluptatem consequuntur, eum, quaerat adipisci possimus voluptate eius architecto sint fugiat autem nobis.</p>
                    </div>

                    <div className={`data_item ${showTab === 'direccion' ? 'show_data_tab' : ''}`}>
                        <h2>Dirección de entrega</h2>

                        <div className='container_cards_direcciones'>
                            {
                                direcciones.map((dir) => dir.direcciones.map((d) => {
                                    return(
                                        <div className='card_direccion'>
                                            <h3>{d.direccion.toUpperCase()}</h3>
                                            <p>Calle {d.calle}, # {d.numero_exterior}, {d.numero_interior}, {d.colonia}, {d.municipio}, {d.estado}, cp:{d.codigo_postal}</p>
                                            <button className='btn_edit'><CiEdit /></button>
                                        </div>
                                    )
                                }))
                            }
                        </div>
                        
                    </div>

                    <div className={`data_item ${showTab === 'fiscal' ? 'show_data_tab' : ''}`}>
                        <h2>Fiscal</h2>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem excepturi explicabo illo minus ipsum aliquid fugit. Error, voluptatem consequuntur, eum, quaerat adipisci possimus voluptate eius architecto sint fugiat autem nobis.</p>
                    </div>

                    <div className={`data_item ${showTab === 'pedidos' ? 'show_data_tab' : ''}`}>
                        <h2>Mis pedidos</h2>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem excepturi explicabo illo minus ipsum aliquid fugit. Error, voluptatem consequuntur, eum, quaerat adipisci possimus voluptate eius architecto sint fugiat autem nobis.</p>
                    </div>
                </div>
            </div>



        </div>
        <Footer />
    </>
  )
}
