import React, { useContext, useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContextoCarrito } from './../context/cartContext';
import { Header_principal } from '../components/Header_principal';
import { FaCheck } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import formatoMoneda from '../functions/formatoMoneda';
import { CiCreditCard2 } from "react-icons/ci";
import { PiMoneyLight } from "react-icons/pi";
import { BsPhoneFlip } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { auth, db } from './../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import createPedido from '../firebase/createPedido';
import { useNavigate } from 'react-router-dom';

export const Detalle_shop = () => {
    const [stepShop, setStepShop] = useState(0);
    const [selectAddress, setSelectAddress] = useState('');
    const [formaPago, setFormaPago] = useState('');
    const { productosCarrito, firstciarCarrito, deleteProductoCart, productDeliting, importeCart, vaciarCarrito } = useContext(ContextoCarrito);
    const [direcciones, setDirecciones] = useState([]);
    const imagenDefault = (e) => e.target.src =  'https://farmacias2web.com/imagenes/predeterminada.jpg';

    const navigate = useNavigate();

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

    useEffect(() => {
        obtenerDirecciones();
    }, []);

    let addressFullSelected = direcciones.filter((item) => item.tipoDireccion === selectAddress)
    const shortId = uuidv4().replace(/-/g, "").slice(0, 15);

    const dataLayout = [{
        uidPedido: shortId,
        usuario: auth?.currentUser?.uid,
        emailUser: auth?.currentUser?.email,
        direccion: addressFullSelected,
        formaPago: formaPago,
        costoEnvio: 0,
        pedido: productosCarrito
    }]

    const sendPedido = async (e) => {
        e.preventDefault();

        try {
            await createPedido(dataLayout);
            setSelectAddress('');
            setFormaPago('');
            vaciarCarrito();
            navigate(`/order_send/${shortId}`)
            
        } catch (error) {
            console.log(error)
        }
    }



  return (
    <>
        <Header_principal />
        <main>
            <div className='content_detalle_shop'>
                <div className='content_tab_shop'>
                    <ul className='step_shop'>
                        <li className={`step ${stepShop >= 0 ? 'step_active' : ''}`}><FaCheck /> Detalle del cart</li>
                        <li className={`step ${stepShop >= 1 ? 'step_active' : ''}`}><FaCheck /> Dirección de entrega</li>
                        <li className={`step ${stepShop >= 2 ? 'step_active' : ''}`}><FaCheck /> Forma de pago</li>
                    </ul>
                </div>
                <div className='container_panel_shop'>
                    {
                        stepShop === 0 && (
                            <div className='detalle_shop'>
                                {
                                    productosCarrito.map((item) => (
                                        <div className='row_product_detalle_shop' key={item.codigo}>
                                            <img className='img_product_detalle' loading="lazy" onError={imagenDefault} src={`https://farmacias2web.com/imagenes/${item.codigo}.jpg`}/>
                                            <div className='detalle_data_product'>
                                                <span className='code_product_d'>{item.codigo}</span>
                                                <p className='name_product_d'>{item.nombre}</p>
                                                <p className='price_product_d'>{formatoMoneda(item.precio)} x {item.pedido} pzs = <b>{formatoMoneda(item.importe)}</b></p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        )
                    }
                    {
                        stepShop === 1 && (
                            <div className='detalle_shop'>
                                {
                                    auth?.currentUser ? (
                                    <div>
                                        <h3>Selecciona la dirección de entrega</h3>
                                        <div className='container_cards_address'>
                                            {
                                                direcciones?.map((dir, i) => (
                                                    <div key={i} className={`item_address ${selectAddress === 'casa' ? 'actived_address': ''}`}>
                                                        <input type='radio' name={dir.tipoDireccion} value='' checked={dir.tipoDireccion === selectAddress} onChange={() => setSelectAddress(dir.tipoDireccion)} id={dir.tipoDireccion}  />
                                                        <label htmlFor='casa' >{dir.tipoDireccion}</label>
                                                        <p><strong>Calle:</strong> {dir.calle} <strong>Num. Ext:</strong> {dir.numeroExt}, <strong>Num. Int:</strong> {dir.numeroInt}, <strong>Colonia o Alcaldia:</strong> {dir.colonia}</p>
                                                        <p><strong>Municipio o Localidad:</strong> {dir.municipio}, <strong>CP:</strong> {dir.cp}, <strong>Referencias:</strong> {dir.referencias}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    ) : (
                                        <div>
                                            <p>Para continuar es necesario iniciar seión</p>
                                            <button>Iniciar sesion</button>
                                        </div>
                                    )
                                }
                                
                                
                            </div>
                        )
                    }
                    {
                        stepShop === 2 && (
                            <div className='detalle_shop'>
                                <h3>Selecciona la dirección de entrega</h3>

                                <div className='container_cards_address'>
                                    <div className={`item_pago ${formaPago === 'tarjeta' ? 'actived_address': ''}`}>
                                        <input type='radio' name='tarjeta' value='' checked={'tarjeta' === formaPago} onChange={() => setFormaPago('tarjeta')} id='tarjeta'  />
                                        <label htmlFor='tarjeta' >Tarjeta (llevamos la terminal) <CiCreditCard2 /></label>
                                    </div>

                                    <div className={`item_pago ${formaPago === 'efectivo' ? 'actived_address': ''}`}>
                                        <input type='radio' name='efectivo' value='' checked={'efectivo' === formaPago} onChange={() => setFormaPago('efectivo')} id='efectivo'  />
                                        <label htmlFor='efectivo' >Efectivo <PiMoneyLight/> </label>
                                    </div>

                                    <div className={`item_pago ${formaPago === 'transferencia' ? 'actived_address': ''}`}>
                                        <input type='radio' name='casa' value='' checked={'transferencia' === formaPago} onChange={() => setFormaPago('transferencia')} id='transferencia'  />
                                        <label htmlFor='transferencia' >Transferencia <BsPhoneFlip/></label>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                    

                    <div>
                        <div className='content_importe_ticket'>
                            <div className='header_ticket'>
                                <h5>Resumen</h5>
                                <span>El importe de este detalle puede variaral capturar su pedido, debido a diferencias en el stock fisico en almacen.</span>
                            </div>
                            <div className='body_ticket'>
                                <p><span>Subtotal</span> <span>{formatoMoneda(importeCart)}</span></p>
                                <p><span>Costo de envio</span> <span>{formatoMoneda(50)}</span></p>
                            </div>
                            <div className='footer_ticket'>
                                <h3>{formatoMoneda(importeCart)}</h3>
                            </div>
                        </div>

                        {
                            stepShop === 0 && (
                                <button className='btn_next_step' onClick={() => setStepShop(1)}>
                                    Siguiente 
                                    <FaArrowRightLong />
                                </button>
                            )
                        }
                        {
                            stepShop === 1 && (
                                <div className='botonera_shop'>
                                    <button className='btn_back_step' onClick={() => setStepShop(0)}>
                                        <FaArrowLeftLong />
                                        Atras
                                    </button>

                                    <button className='btn_next_step' onClick={() => setStepShop(2)}>
                                        Siguiente 
                                        <FaArrowRightLong />
                                    </button>
                                </div>
                            )
                        }
                        {
                            stepShop === 2 && (
                                <div className='botonera_shop'>
                                    <button className='btn_back_step' onClick={() => setStepShop(1)}>
                                        <FaArrowLeftLong />
                                        Atras
                                    </button>

                                    <button className='btn_next_step' onClick={sendPedido}>
                                        Finalizar
                                        <FaArrowRightLong />
                                    </button>
                                </div>
                            )
                        }

                        {
                            <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
                                {JSON.stringify(dataLayout, null, 2)}
                            </pre>
                        }
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}
