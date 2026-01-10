import React from 'react'
import { Header_principal } from '../components/Header_principal';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import imgRecibirPedido from '../assets/iconos/recibir_pedido.png'
import imgSurtir from '../assets/iconos/surtir.png'
import imgEscaner from '../assets/iconos/escaner.png'
import imgpPedidoListo from '../assets/iconos/pedido_listo.png'

export const Order_send = () => {
  return (
    <>
        <Header_principal />
        <div className='data_succes_order'>

            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>

            <h3>Pedido generado correctamente</h3>
            <p>Se envio correctamente tu pedido a nuestro servidor</p>
            <p>En breve atenderemos tu pedido y cualquier situación nos pondremos en contacto contigo</p>
            <p>Gracias por tu preferencia!</p>
            <p>Tambien puedes seguir el estatus de tu pedido en tu perfil <Link to='/pedidos_perfil'>ver mi pedido</Link>  </p>

            <div className="loading-images">
                <img src={imgRecibirPedido} alt="" />
                <img src={imgSurtir} alt="" />
                <img src={imgEscaner} alt="" />
                <img src={imgpPedidoListo} alt="" />
            </div>
        </div>
        <Footer />

    </>
  )
}
