import React, { useContext, useRef, useEffect } from 'react';
import { ContextoCarrito } from './../context/cartContext';
import { MdDelete } from "react-icons/md";
import formatoMoneda from '../functions/formatoMoneda';
import { Link } from 'react-router-dom';
import img_cart_notfound from './../assets/cart_not_found.png'


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
      {/* <div ref={cartRef} className={`container_cart_slide animate__animated ${showCart === true ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`} onClick={(event) => event.stopPropagation()}> */}
      <div ref={cartRef} className={`container_cart_slide ${showCart === true ? 'up_slideup_active' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className='cart_header'>
          <span>Mi carrito</span>
        </div>
        <div className='cart_body'>
            {
              productosCarrito.length > 0 ? (
                productosCarrito.map((item, i) => {
                  return(
                    <div className={`row_cart animate__animated ${productDeliting === item.codigo ? 'animate__bounceOutLeft' : ''}`} key={i}>
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
              ) : (
                <div className='content_img_notfound'>
                  <img src={img_cart_notfound} />
                </div>
              )
            }
        </div>
        {
          productosCarrito.length > 0 &&(
            <div className='cart_footer'>
              <div className='column_footer_cart'>
                <p>Total: </p>
                <p><b>{formatoMoneda(importeCart)}</b></p>
              </div>
              <div className='column_footer_cart'>
                <button className='btn_vaciar_cart' onClick={() => setShowCart(false)}>Seguir comprando</button>
                <Link className='btn_finalizar_cart' to='/detalle_shop'>Finalizar</Link>
              </div>
              
              
            </div>
          )
        }
       
      </div>
    </div>

  )
}
