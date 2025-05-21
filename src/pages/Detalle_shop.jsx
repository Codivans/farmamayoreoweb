import React, { useContext, useRef, useEffect, useState } from 'react';
import { ContextoCarrito } from './../context/cartContext';
import { Header_principal } from '../components/Header_principal';
import { FaCheck } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import formatoMoneda from '../functions/formatoMoneda';
import { CiCreditCard2 } from "react-icons/ci";
import { PiMoneyLight } from "react-icons/pi";
import { BsPhoneFlip } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import useGetDataUser from "./../hooks/useGetDataUser";

export const Detalle_shop = () => {
    const [stepShop, setStepShop] = useState(0);
    const [selectAddress, setSelectAddress] = useState('');
    const { productosCarrito, firstciarCarrito, deleteProductoCart, productDeliting, importeCart } = useContext(ContextoCarrito);
    const imagenDefault = (e) => e.target.src =  'https://farmacias2web.com/imagenes/predeterminada.jpg';

    const userData = useGetDataUser({});



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
                                <h3>Selecciona la dirección de entrega</h3>
                                <div className='container_cards_address'>
                                    {
                                        userData?.direcciones?.map((add) => (
                                            <div className={`item_address ${selectAddress === 'casa' ? 'actived_address': ''}`}>
                                                <input type='radio' name='casa' value='' checked={'casa' === selectAddress} onChange={() => setSelectAddress('casa')} id='casa'  />
                                                <label htmlFor='casa' >Casa</label>
                                                <p>Calle: Xochimilco # 259, evolucion, nezahualcoyotl, mexico, CP.57700</p>
                                            </div>
                                        ))
                                    }
                                    

                                     {/* <div className={`item_address ${selectAddress === 'casa' ? 'actived_address': ''}`}>
                                        <input type='radio' name='casa' value='' checked={'casa' === selectAddress} onChange={() => setSelectAddress('casa')} id='casa'  />
                                        <label htmlFor='casa' >Casa</label>
                                        <p>Calle: Xochimilco # 259, evolucion, nezahualcoyotl, mexico, CP.57700</p>
                                    </div> */}

                                </div>
                            </div>
                        )
                    }
                    {
                        stepShop === 2 && (
                            <div className='detalle_shop'>
                                <h3>Selecciona la dirección de entrega</h3>

                                <div className='container_cards_address'>
                                    <div className={`item_pago ${selectAddress === 'tarjeta' ? 'actived_address': ''}`}>
                                        <input type='radio' name='tarjeta' value='' checked={'tarjeta' === selectAddress} onChange={() => setSelectAddress('tarjeta')} id='tarjeta'  />
                                        <label htmlFor='tarjeta' >Tarjeta (llevamos la terminal) <CiCreditCard2 /></label>
                                    </div>

                                    <div className={`item_pago ${selectAddress === 'efectivo' ? 'actived_address': ''}`}>
                                        <input type='radio' name='efectivo' value='' checked={'efectivo' === selectAddress} onChange={() => setSelectAddress('efectivo')} id='efectivo'  />
                                        <label htmlFor='efectivo' >Efectivo <PiMoneyLight/> </label>
                                    </div>

                                    <div className={`item_pago ${selectAddress === 'transferencia' ? 'actived_address': ''}`}>
                                        <input type='radio' name='casa' value='' checked={'transferencia' === selectAddress} onChange={() => setSelectAddress('transferencia')} id='transferencia'  />
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

                                    <button className='btn_next_step' onClick={() => setStepShop(3)}>
                                        Finalizar
                                        <FaArrowRightLong />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}
