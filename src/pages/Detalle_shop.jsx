import React, { useContext, useRef, useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { ContextoCarrito } from './../context/cartContext';
import { Header_principal } from '../components/Header_principal';
import { FaCheck } from "react-icons/fa6";
import formatoMoneda from '../functions/formatoMoneda';
import { CiCreditCard2 } from "react-icons/ci";
import { PiMoneyLight } from "react-icons/pi";
import { BsPhoneFlip } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { auth, db } from './../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import createPedido from '../firebase/createPedido';
import { Link, useNavigate } from 'react-router-dom';
import { FormularioDirecciones } from '../components/FormularioDirecciones';
import { getUnixTime } from 'date-fns';
import { Menu_Bottom } from '../components/Menu_Bottom';
import toast from 'react-hot-toast';
import { Footer } from '../components/Footer';
import imgTerminal from '../assets/iconos/terminal.png';
import imgTransferencia from '../assets/iconos/transferencia.png';
import imgEfectivo from '../assets/iconos/efectivo.png';

export const Detalle_shop = () => {
    const [stepShop, setStepShop] = useState(0);
    const [toggleEntrega, setToggleEntrega] = useState('pickUp');
    const [selectAddress, setSelectAddress] = useState('');
    const [selectEntrega, setSelectEntrega] = useState('');
    const [formaPago, setFormaPago] = useState('transferencia');
    const [showForm, setShowForm] = useState(false);
    const [stepEnvio, setStepEnvio] = useState(true);
    const { productosCarrito, removeProductCart, deleteProductoCart, productDeliting, addProductoCart, importeCart, vaciarCarrito } = useContext(ContextoCarrito);
    const [direcciones, setDirecciones] = useState([]);
    const [direccionEditando, setDireccionEditando] = useState(null);
    const [userData, setUserData] = useState([])

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

    const obtenerEstatus = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, 'usuarios', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
        const data = snap.data();
        setUserData(data || []);
        }
    };

    useEffect(() => {
        obtenerDirecciones();
        obtenerEstatus();
    }, []);

    let addressFullSelected = direcciones.filter((item) => item.tipoDireccion === selectAddress)
    // const shortId = uuidv4().replace(/-/g, "").slice(0, 15);

    const dataLayout = [{
        uidPedido: getUnixTime(new Date()),
        usuario: auth?.currentUser?.uid,
        emailUser: auth?.currentUser?.email,
        tipoEntrega: toggleEntrega,
        pickupEntrega: selectEntrega,
        direccion: addressFullSelected,
        formaPago: formaPago,
        importePedido: importeCart.toFixed(2),
        costoEnvio: 0,
        pedido: productosCarrito,
        estatus: 'nuevo'
    }]

    const sendPedido = async (e) => {
        e.preventDefault();

        // if(userData?.status){
            try {
                await createPedido(dataLayout);
                setSelectAddress('');
                setFormaPago('');
                vaciarCarrito();
                navigate(`/order_send/${dataLayout?.uidPedido}`)
                
            } catch (error) {
                console.log(error)
            }
        // }else{
        //     toast.error('Tu cuenta debe estar activa.')
        // }

        
    }

    const handleChange = (event) => {
      if(event.target.name === 'select-paquetes'){
          console.log(event.target.dataset.pedido);
          if(event.target.value === 0){
              alert('Debes seleccionar un valor')
              
          }else{
            addProductoCart({
                codigo: parseInt(event.target.dataset.codigo),
                nombre: event.target.dataset.nombre,
                pedido: productoAgregado ? parseInt(event.target.value) - productoAgregado.pedido : parseInt(event.target.value),
                precio: parseFloat(event.target.dataset.precio),
                existencia: parseInt(event.target.dataset.existencia) // ✅ conversión numérica
            });

          }
          
      }
    }

    const handleKey = (e) => {
      if(e.keyCode === 13){
        addProductoCart({
            codigo: parseInt(e.target.dataset.codigo),
            nombre: e.target.dataset.nombre,
            pedido: parseInt(e.target.value) - parseInt(e.target.placeholder),
            precio: parseFloat(e.target.dataset.precio),
            existencia: parseInt(e.target.dataset.existencia) // ✅ conversión numérica
        });

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

    const handleChangeToggleTipoEntrega = (evt) => {
        if(evt.target.name === 'pickUp'){
            setToggleEntrega('pickUp');
            addressFullSelected=[];
        }else if(evt.target.name === 'envio'){
            setToggleEntrega('envio');
        }
    }

    

    useEffect(() => {
        if(toggleEntrega === 'pickUp' && selectEntrega !=''){
            setStepEnvio(false);
        }else if(toggleEntrega === 'envio' && addressFullSelected.length > 0){
            setStepEnvio(false);
        }else{
            setStepEnvio(true);
        }
    }, [toggleEntrega, selectEntrega, selectAddress])


     const handleClick = () => {
        setShowForm(!showForm)
        finalizarGuardado();
    }

    const finalizarGuardado = () => {
        setDireccionEditando(null);
        obtenerDirecciones();
    };

  return (
    <>
        <Header_principal />
        <main>
            <div className='content_detalle_shop'>
                <div className='content_tab_shop'>
                    <ul className='step_shop'>
                        <li className={`step ${stepShop >= 0 ? 'step_active' : ''}`}><FaCheck /> <span>Detalle productos</span></li>
                        <li className={`step ${stepShop >= 1 ? 'step_active' : ''}`}><FaCheck /> Dirección de entrega</li>
                        <li className={`step ${stepShop >= 2 ? 'step_active' : ''}`}><FaCheck /> Forma de pago</li>
                    </ul>
                </div>

                <div className='container_panel_shop'>
                    <div className='container_steps_details'>
                        {
                            stepShop === 0 && (
                                <div className='detalle_shop content_row_shop'>
                                    {
                                        productosCarrito.map((item) => (
                                            <div className='row_product_detalle_shop' key={item.codigo}>
                                                <img className='img_product_detalle' loading="lazy" onError={imagenDefault} src={`https://farmacias2web.com/imagenes/${item.codigo}.jpg`}/>
                                                <div className='detalle_data_product'>
                                                    <div className='column_detalle_cart column_name'>
                                                        <div className='container_name_cart'>
                                                            <span className='code_product_d'>{item.codigo}</span>
                                                            <p className='name_product_d'>{item.nombre}</p>
                                                        </div>
                                                        <div className='container_price_cart'>
                                                            <span>Precio</span>
                                                            <p className='price_product_d'>{formatoMoneda(item.precio)}</p>
                                                        </div>
                                                    </div>

                                                    <div  className='column_detalle_cart column_prices'>
                                                        <div className='container_controller_detalle_shop'>
                                                            <div className='container_btn_controllers'>
                                                                <button onClick={() => removeProductCart({codigo: parseInt(item.codigo), disminuir: 1, agregados: item.pedido})}>-</button>
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
                                                                <button
                                                                    onClick={() =>
                                                                        addProductoCart({
                                                                        codigo: parseInt(item.codigo),
                                                                        nombre: item.nombre,
                                                                        pedido: 1,
                                                                        precio: item.oferta > 0 ? item.oferta : item.precio,
                                                                        existencia: parseInt(item.existencia) // ✅ conversión numérica
                                                                        })
                                                                    }
                                                                >
                                                                    +
                                                                </button>

                                                            </div>
                                                        </div>
                                                        <p className='importe_product_d'>{formatoMoneda(item.importe)}</p>
                                                        <button className='btn_delete_cart_d' onClick={() => deleteProductoCart(item.codigo)}><MdDelete /></button>
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
                                        // auth?.currentUser ? (
                                        <div className='container_tipo_entrega'>
                                            <h3>Selecciona la forma de entrega de tu pedido</h3>
                                            <div className='container_toggle_entrega'>
                                                <button className={`btn_toggle ${toggleEntrega === 'pickUp' ? 'active_toggle' : ''}`} name='pickUp' onClick={handleChangeToggleTipoEntrega}>Asistir a tienda</button>
                                                <span>ó</span>
                                                <button className={`btn_toggle ${toggleEntrega === 'envio' ? 'active_toggle' : ''}`} name='envio' onClick={handleChangeToggleTipoEntrega}>Envio a domicilio</button>
                                            </div>

                                            {
                                                toggleEntrega === 'pickUp' ? (
                                                    <>
                                                        <p style={{textAlign: 'center', marginTop: '50px'}}>Quieres recojer tu pedido en nuestra tienda, da click en "Recojer en tienda" para seguir adelante.</p>
                                                        <div className='container_cards_pickup'>

                                                            <div className={`item_address ${selectEntrega === 'cerezos' ? 'actived_address': ''}`}>
                                                                <input type='radio' name='tienda' checked={'tienda' === selectEntrega} onChange={handleChangeToggle} id='tienda'/>
                                                                <label htmlFor='tienda'>Recojer e tienda</label>
                                                                <p>Av. Pantitlán 617, La Perla, 57820 Cdad. Nezahualcóyotl, Méx.</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className='container_cards_address'>
                                                      
                                                        {
                                                            direcciones?.length > 0 ?
                                                            (
                                                                <>
                                                                {
                                                                    direcciones?.map((dir, i) => (
                                                                        <div key={i} className={`item_address ${selectAddress === dir.tipoDireccion ? 'actived_address': ''}`}>
                                                                            <input 
                                                                                type='radio' 
                                                                                name={dir.tipoDireccion} 
                                                                                checked={dir.tipoDireccion === selectAddress} 
                                                                                onChange={() => setSelectAddress(dir.tipoDireccion)} 
                                                                                id={dir.tipoDireccion}  
                                                                            />

                                                                            <label htmlFor={dir.tipoDireccion} style={{textTransform: 'Capitalize'}}>{dir.tipoDireccion}</label>

                                                                            <p>Calle:{dir.calle} Num. Ext:{dir.numeroExt}, Num. Int:{dir.numeroInt}, Colonia o Alcaldia:{dir.colonia}</p>
                                                                            <p>Municipio o Localidad:{dir.municipio}, CP:{dir.cp}, Referencias:{dir.referencias}</p>
                                                                        </div>
                                                                    ))
                                                                }
                                                                </>
                                                            )
                                                            :(
                                                                <>
                                                                {
                                                                    showForm === false ? (
                                                                        <div className='botonera_perfil btn_perfil_tipo'>
                                                                            <button className='btn_add_data' onClick={() => handleClick()}>+ Agregar dirección</button>
                                                                        </div>
                                                                    ): ('')
                                                                }
                                                                
                                                                <FormularioDirecciones showForm={showForm} setShowForm={setShowForm} direccionEditar={direccionEditando} onGuardado={finalizarGuardado}/>
                                                                </>

                                                            )
                                                        }
                                                        
                                                    </div>
                                                )
                                            }
                                        </div>
                                        // ) : (
                                        //     <div>
                                        //         <p>Para continuar es necesario iniciar seión</p>
                                        //         <button>Iniciar sesion</button>
                                        //     </div>
                                        // )
                                    }
                                </div>
                            )
                        }
                        {
                            stepShop === 2 && (
                                <div className='detalle_shop'>
                                    <div className='container_cards_pago'>
                                        <h3>Selecciona tu forma de pago</h3>

                                        <div className='container_flex_pago'>
                                            <div className='cards_pago'>
                                                <div className={`item_pago ${formaPago === 'transferencia' ? 'actived_address': ''}`}>
                                                    <input type='radio' name='casa' value='' checked={'transferencia' === formaPago} onChange={() => setFormaPago('transferencia')} id='transferencia'  />
                                                    <label htmlFor='transferencia' >Transferencia</label>
                                                </div>

                                                {
                                                    toggleEntrega === 'pickUp' && (
                                                        <div className={`item_pago ${formaPago === 'efectivo' ? 'actived_address': ''}`}>
                                                            <input type='radio' name='efectivo' value='' checked={'efectivo' === formaPago} onChange={() => setFormaPago('efectivo')} id='efectivo'  />
                                                            <label htmlFor='efectivo' >Efectivo </label>
                                                        </div>
                                                    )
                                                }

                                                <div className={`item_pago ${formaPago === 'tarjeta' ? 'actived_address': ''}`}>
                                                    <input type='radio' name='tarjeta' value='' checked={'tarjeta' === formaPago} onChange={() => setFormaPago('tarjeta')} id='tarjeta'  />
                                                    <label htmlFor='tarjeta' >Terminal</label>
                                                </div>
                                            </div>
                                            <div className='info_pago'>
                                                {
                                                    formaPago === 'transferencia' ? (
                                                        <div className='content_forma_pago'>
                                                            <img src={imgTransferencia} />
                                                            <div>
                                                                <p>Para realizar el pago de esta manera, nos pondremos en contacto con tigo para confirmarte el monto.</p>
                                                                <h4>Banco Afirme</h4>
                                                                <p><strong>Cuenta:</strong> 3494938943249842389</p>
                                                                <p><strong>CLABE:</strong> 3492390493284944321</p>
                                                            </div>
                                                            
                                                        </div>
                                                    ):('')
                                                }
                                                {
                                                    formaPago === 'efectivo' ? (
                                                        <div className='content_forma_pago'>
                                                            <img src={imgEfectivo} />
                                                            <div>
                                                                <p>Al llegar a la sucursal, tu pedido estara listo y podras pasar al area de caja para poder pagar tu pedido.</p>
                                                            </div>
                                                        </div>
                                                    ) : ('')
                                                }
                                                {
                                                    formaPago === 'tarjeta' ? (
                                                        <div className='content_forma_pago'>
                                                            <img src={imgTerminal} />
                                                            <div>
                                                                <p>Nuestro repartidor llevara la terminal para realizar el cobro en tu negocio.</p>
                                                                <p>para mayor seguridad y comodidad.</p>
                                                            </div>
                                                            
                                                        </div>
                                                    ) : ('')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                    
                    

                    <div className='container_column_importes'>
                        <div>
                            {/* {userData?.status ? ( */}
                                <>
                                    <div className='content_importe_ticket'>
                                        
                                        <div className='header_ticket'>
                                            <h5>Resumen</h5>
                                            <span>El importe de este detalle puede variar al capturar su pedido, debido a diferencias en el stock fisico en almacen.</span>
                                        </div>
                                    
                                        <div className='body_ticket'>
                                            <p><span>Subtotal</span> <span>{formatoMoneda(importeCart)}</span></p>
                                            <p><span>Costo de envio</span> <span>{formatoMoneda(0)}</span></p>
                                        </div>
                                        <div className='footer_ticket'>
                                            <h3>{formatoMoneda(importeCart)}</h3>
                                        </div>
                                    </div>
                                    {
                                        stepShop === 0 && (
                                            <button className='btn_next_step' onClick={() => setStepShop(1)}>Seguir</button>
                                        )
                                    }
                                    {
                                        stepShop === 1 && (
                                            <div className='botonera_shop'>
                                                <button className='btn_back_step' onClick={() => setStepShop(0)}>Atras</button>
                                                <button className='btn_next_step' onClick={() => setStepShop(2)} disabled={stepEnvio}>Seguir</button>
                                            </div>
                                        )
                                    }
                                    {
                                        stepShop === 2 && (
                                            <div className='botonera_shop'>
                                                <button className='btn_back_step' onClick={() => setStepShop(1)}>Atras</button>
                                                <button className='btn_next_step' onClick={sendPedido} disabled={formaPago=== '' ? true : false}>Finalizar</button>
                                            </div>
                                        )
                                    }
                                
                                </>
                            {/* ) :(
                                
                                <div> */}
                                    {/* {
                                        userData?.constancia?.url && userData?.aviso?.url ? (
                                            <div className='pendiente_box'>
                                                <p>Estamos validando tu información, en cuanto terminemos te notificaremos el estatus de tu cuenta.</p>
                                                <p>llamar solo en caso de tener más de 24 hrs de espera</p>
                                                <p>admin: 55 1023 2343</p>
                                            </div>
                                        ) : (
                                            <div className='alert_box'>
                                                <p>Para continuar con tu compra es necesario que tu cuenta este verificada, 
                                                    sube tu Constancia de situación fiscal y tu Aviso de funcionamiento, 
                                                    para activar tu cuenta</p>
                                                <Link to="/documentos">Subir mis documentos</Link>
                                            </div>
                                        )
                                    } */}
                                    
                                {/* </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
        <Menu_Bottom />
    </>
  )
}
