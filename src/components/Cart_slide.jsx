import React, { useContext, useRef, useEffect } from 'react';
import { ContextoCarrito } from './../context/cartContext';
import { MdDelete } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import formatoMoneda from '../functions/formatoMoneda';
import { Link } from 'react-router-dom';


export const Cart_slide = ({showCart, setShowCart}) => {

  const { productosCarrito, vaciarCarrito, deleteProductoCart, productDeliting, importeCart } = useContext(ContextoCarrito);
  const cartRef = useRef(null);
  const imagenDefault = (e) => e.target.src =  'https://farmacias2web.com/imagenes/predeterminada.jpg';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    if (showCart) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCart]);

  return (
    <div className='wrap_cart_slide' onClick={() => setShowCart(false)}>
      <div ref={cartRef} className={`container_cart_slide animate__animated ${showCart === true ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`} onClick={(event) => event.stopPropagation()}>
        <div className='cart_header'>
          <button className='btn_close_cart_slide' onClick={() => setShowCart(!showCart)}><VscChromeClose /></button>
          <h3>Mi carrito</h3>
        </div>
        <div className='cart_body'>
            {
              productosCarrito.map((item) => {
                return(
                  <div className={`row_cart animate__animated ${productDeliting === item.codigo ? 'animate__bounceOutLeft' : ''}`} >
                    <div className='img_product_cart'>
                      <img loading="lazy" onError={imagenDefault} src={`https://farmacias2web.com/imagenes/${item.codigo}.jpg`}/>
                    </div>
                    <div className='description_product_cart'>
                      <span>{item.codigo}</span><br />
                      <span>{item.nombre}</span>
                      <div><span>{item.pedido} pzs X {formatoMoneda(item.precio)} Importe: {formatoMoneda(item.importe)}</span></div>
                    </div>
                    <button className='btn_delete_cart' onClick={() => deleteProductoCart(item.codigo)}><MdDelete /></button>
                  </div>
                )
              })

            }
        </div>
        <div className='cart_footer'>
          <button className='btn_vaciar_cart' onClick={() => vaciarCarrito()}>Vaciar carrito</button>
          <Link className='btn_finalizar_cart' to='/detalle_shop'>Finalizar {formatoMoneda(importeCart)}</Link>
        </div>
      </div>
    </div>

  )
}
