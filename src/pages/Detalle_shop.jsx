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
    const [toggleEntrega, setToggleEntrega] = useState(true);
    const [selectAddress, setSelectAddress] = useState('');
    const [selectEntrega, setSelectEntrega] = useState('');
    const [formaPago, setFormaPago] = useState('transferencia');
    const { productosCarrito, firstciarCarrito, deleteProductoCart, productDeliting, addProductoCart, importeCart, vaciarCarrito } = useContext(ContextoCarrito);
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
        tipoEntrega: toggleEntrega,
        pickupEntrega: selectEntrega,
        direccion: addressFullSelected,
        formaPago: formaPago,
        importePedido: importeCart.toFixed(2),
        costoEnvio: 0,
        pedido: productosCarrito,
        estatus: 'En espera'
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

    const handleChange = (event) => {
      if(event.target.name === 'select-paquetes'){
          console.log(event.target.dataset.pedido);
          if(event.target.value === 0){
              alert('Debes seleccionar un valor')
              
          }else{
              addProductoCart(
                  {
                      codigo: parseInt(event.target.dataset.codigo), 
                      nombre: event.target.dataset.nombre, 
                      pedido: productoAgregado ? parseInt(event.target.value) - productoAgregado.pedido : parseInt(event.target.value) ,
                      precio: event.target.dataset.precio, 
                      existencia: event.target.dataset.existencia
                  }
              )
          }
          
      }
    }

    const handleKey = (e) => {
      if(e.keyCode === 13){
          addProductoCart(
              {
                  codigo: parseInt(e.target.dataset.codigo), 
                  nombre:e.target.dataset.nombre, 
                  pedido: e.target.value - e.target.placeholder, 
                  precio: e.target.dataset.precio, 
                  existencia: e.target.dataset.existencia
              }
          )
          e.target.value= ''
      }
    }

    const handleChangeToggle = (evt) => {
        if(evt.target.name === 'tienda'){
            setSelectEntrega('tienda')
            setSelectAddress('')
        }else if(evt.target.name === 'anden'){
            setSelectEntrega('anden');
            setSelectAddress('')
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
                                                <div>
                                                    <span className='code_product_d'>{item.codigo}</span>
                                                    <p className='name_product_d'>{item.nombre}</p>
                                                </div>
                                                <div>
                                                    <p className='price_product_d'>{formatoMoneda(item.precio)} x {item.pedido} pzs = <b>{formatoMoneda(item.importe)}</b></p>
                                                </div>
                                                <div className='container_controller_detalle_shop'>
                                                    <div className='container_btn_controllers'>
                                                        <button onClick={() => removeProductCart({codigo: parseInt(item.codigo), disminuir: 1, agregados: productoAgregado.pedido})}>-</button>
                                                        <input
                                                        type='text'
                                                        data-codigo={item.codigo}
                                                        data-nombre={item.nombre}
                                                        data-precio={item.precio}
                                                        data-existencia={item.existencia}
                                                        placeholder={item.pedido}
                                                        className='count_add_cart' 
                                                        onChange={handleChange} 
                                                        onKeyDown={handleKey}
                                                        />
                                                        <button onClick={() => addProductoCart({codigo: parseInt(item.codigo), nombre: item.nombre, pedido: 1, precio: item.oferta > 0 ? item.oferta : item.precio, existencia: item.existencia})}>+</button>
                                                    </div>
                                                </div>
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
                                    <div className='container_tipo_entrega'>
                                        <h3>Selecciona la dirección de entrega</h3>
                                        <div className='container_toggle_entrega'>
                                            <button className={`btn_toggle ${toggleEntrega ? 'active_toggle' : ''}`} onClick={() => setToggleEntrega(!toggleEntrega)}>PickUp</button>
                                            <button className={`btn_toggle ${!toggleEntrega ? 'active_toggle' : ''}`} onClick={() => setToggleEntrega(!toggleEntrega)}>Envio</button>
                                        </div>

                                        {
                                            toggleEntrega ? (
                                                <>
                                                    <div className='container_cards_pickup'>
                                                        <div className={`item_address ${selectEntrega === 'tienda' ? 'actived_address': ''}`}>
                                                            <input type='radio' name='tienda' checked={'tienda' === selectEntrega} onChange={handleChangeToggle} id='tienda'/>
                                                            <label htmlFor='tienda'>Tienda</label>
                                                            <p>Rio churubusco s/n Central de Abastos, Pasillo E-F Local 30B, Iztapalapa, 09040, CDMX.</p>
                                                        </div>

                                                        <div className={`item_address ${selectEntrega === 'anden' ? 'actived_address': ''}`}>
                                                            <input type='radio' name='anden' checked={'anden' === selectEntrega} onChange={handleChangeToggle} id='anden'/>
                                                            <label htmlFor='anden'>Anden</label>
                                                            <p>Rio churubusco s/n Central de Abastos, Anden estacionamiento 30B, Iztapalapa, 09040, CDMX.</p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className='container_cards_address'>
                                                    {
                                                        direcciones?.map((dir, i) => (
                                                            <div key={i} className={`item_address ${selectAddress === dir.tipoDireccion ? 'actived_address': ''}`}>
                                                                <input type='radio' name={dir.tipoDireccion} value='' checked={dir.tipoDireccion === selectAddress} onChange={() => setSelectAddress(dir.tipoDireccion)} id={dir.tipoDireccion}  />
                                                                <label htmlFor={dir.tipoDireccion} >{dir.tipoDireccion}</label>
                                                                <p>Calle:{dir.calle} Num. Ext:{dir.numeroExt}, Num. Int:{dir.numeroInt}, Colonia o Alcaldia:{dir.colonia}</p>
                                                                <p>Municipio o Localidad:{dir.municipio}, CP:{dir.cp}, Referencias:{dir.referencias}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
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
                                <div className='container_cards_pago'>
                                    <h3>Selecciona tu forma de pago</h3>

                                    <div className={`item_pago ${formaPago === 'transferencia' ? 'actived_address': ''}`}>
                                        <input type='radio' name='casa' value='' checked={'transferencia' === formaPago} onChange={() => setFormaPago('transferencia')} id='transferencia'  />
                                        <label htmlFor='transferencia' >Transferencia <BsPhoneFlip/></label>
                                    </div>

                                    <div className={`item_pago ${formaPago === 'efectivo' ? 'actived_address': ''}`}>
                                        <input type='radio' name='efectivo' value='' checked={'efectivo' === formaPago} onChange={() => setFormaPago('efectivo')} id='efectivo'  />
                                        <label htmlFor='efectivo' >Efectivo <PiMoneyLight/> </label>
                                    </div>

                                    <div className={`item_pago ${formaPago === 'tarjeta' ? 'actived_address': ''}`}>
                                        <input type='radio' name='tarjeta' value='' checked={'tarjeta' === formaPago} onChange={() => setFormaPago('tarjeta')} id='tarjeta'  />
                                        <label htmlFor='tarjeta' >Terminal <CiCreditCard2 /></label>
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

                        {/* {
                            <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
                                {JSON.stringify(dataLayout, null, 2)}
                            </pre>
                        } */}
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}
