import React, { useContext } from 'react'
import { ContextoCarrito } from './../context/cartContext';
import formatoMoneda from './../functions/formatoMoneda';
import { VscAdd, VscChromeMinimize  } from "react-icons/vsc";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

export const Card_product = ({widthCardAuto, item}) => {

    const imagenDefault = (e) =>{
      e.target.src =  'https://farmacias2web.com/imagenes/predeterminada.jpg' 
    }

    const disponibilidad = (existencia) => {
      if(existencia >= 50){
        return <span className='txt_disponible txt_color_green'>Disponibilidad Alta</span>
      }else if(existencia >=30 & existencia <= 49){
        return <span className='txt_disponible txt_color_yellow'>Disponibilidad Media</span>
      }else if(existencia >=1 & existencia <= 29){
        return <span className='txt_disponible txt_color_orange'>Disponibilidad Baja</span>
      }else if(existencia <= 0){
        return <span className='txt_disponible txt_color_red'>Sin Disponibilidad</span>
      }
    }

    const { addProductoCart, removeProductCart, productosCarrito } = useContext(ContextoCarrito);

    const productoAgregado = productosCarrito.find((i) => parseInt(i.codigo) === parseInt(item.codigo));

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
      

  return (
    <div className='card_product' style={{ width: `${widthCardAuto}px !important` }}>
        <p className='item_grupo'>
          {
            item.grupo === 'GRUPO IV (ANTIBIOTICO)' && <span><IoDocumentTextOutline /> Producto Antibiótico</span>
          }  
        </p>
        <div className='card_header'>
          <img loading="lazy" onError={imagenDefault} src={`https://farmacias2web.com/imagenes/${item.codigo}.jpg`} />
        </div>
        <div className='card_body'>
          <Link to={`/search/laboratorio/${item.laboratorio}`} className='laboratorio_item'>{item.laboratorio}</Link>
          <p className='codigo_item'>{item.codigo}</p>
          <p className='txt_name_product'>{item.nombre}</p>
          <p className='existencia_item'>{disponibilidad(item.existencia)}</p>
          <div className='container_price_product'>
            <p className='price_item'>
              <span className={item.oferta > 0 ? 'price_tachado' : ''}>{formatoMoneda(item.precio)}</span>
              <span className='price_oferta'>{item.oferta > 0 ? formatoMoneda(item.oferta) : ''}</span>
            </p>
          </div>
        </div>
        <div className='card_footer'>
          {
            productoAgregado 
            ? <div className='container_btn_controllers'>
                <button onClick={() => removeProductCart({codigo: parseInt(item.codigo), disminuir: 1, agregados: productoAgregado.pedido})}>-</button>
                <input
                  type='text'
                  data-codigo={item.codigo}
                  data-nombre={item.nombre}
                  data-precio={item.precio}
                  data-existencia={item.existencia}
                  placeholder={productoAgregado.pedido}
                  className='count_add_cart' 
                  onChange={handleChange} 
                  onKeyDown={handleKey}
                />
                <button onClick={() => addProductoCart({codigo: parseInt(item.codigo), nombre: item.nombre, pedido: 1, precio: item.oferta > 0 ? item.oferta : item.precio, existencia: item.existencia})}>+</button>
              </div>
            : <button onClick={() => addProductoCart({codigo: parseInt(item.codigo), nombre: item.nombre, pedido: 1, precio: item.oferta > 0 ? item.oferta : item.precio, existencia: item.existencia})}>
                Agregar a carrito
              </button>
            
            }
          
        </div>
    </div>
  )
}
