import React, { useContext } from 'react'
import { ContextoCarrito } from './../context/cartContext';
import formatoMoneda from './../functions/formatoMoneda';
import { VscAdd, VscChromeMinimize  } from "react-icons/vsc";
import { Link } from 'react-router-dom';

export const Card_product = ({widthCardAuto, item}) => {

    const imagenDefault = (e) =>{
      e.target.src =  'https://farmaprontoneza.com/image/predeterminada.jpg' 
    }

    const { addProductoCart, removeProductCart, productosCarrito } = useContext(ContextoCarrito);

    const productoAgregado = productosCarrito.find((i) => parseInt(i.codigo) === parseInt(item.codigo));

  return (
    <div className='card_product' style={{ width: `${widthCardAuto}px !important` }}>
        <div className='card_header'>
          <img loading="lazy" onError={imagenDefault} src={`https://farmaprontoneza.com/image/${item.codigo}.jpg`} />
        </div>
        <div className='card_body'>
          <Link to={`/search/laboratorio/${item.laboratorio}`} className='laboratorio_item'>{item.laboratorio}</Link>
          <p className='codigo_item'>{item.codigo}</p>
          <p className='txt_name_product'>{item.nombre}</p>
          <div className='container_price_product'>
            <p className='price_item'>{formatoMoneda(item.precio)}</p>
            <p className='existencia_item'>{item.existencia} pzs</p>
          </div>
          <h4 className='price_offer'>{item.oferta > 0 ? item.oferta : ''}</h4>
        </div>
        <div className='card_footer'>
          {
            productoAgregado 
            ? <div className='container_btn_controllers'>
                <button onClick={() => removeProductCart({codigo: parseInt(item.codigo), disminuir: 1, agregados: productoAgregado.pedido})}>-</button>
                <span className='count_add_cart'>{productoAgregado.pedido}</span>
                <button onClick={() => addProductoCart({codigo: parseInt(item.codigo), nombre: item.nombre, pedido: 1, precio: item.precio, existencia: item.existencia})}>+</button>
              </div>
            : <button onClick={() => addProductoCart({codigo: parseInt(item.codigo), nombre: item.nombre, pedido: 1, precio: item.precio, existencia: item.existencia})}>
                Agregar a carrito
              </button>
            
            }
          
        </div>
    </div>
  )
}
