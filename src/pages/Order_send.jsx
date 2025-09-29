import React from 'react'
import { Header_principal } from '../components/Header_principal'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'

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
            <p>Se envio un correo electrónico con el detalle de tu pedido</p>
            <p>En breve se pondra en contacto uno de nuestros colaboradores para detallar temas acerca de tu pedido y la entrega del mismo.</p>
            <p>Tambien puedes seguir el estatus de tu pedido en <Link to='/'>pedidosuser</Link>  </p>
        </div>
        <Footer />

    </>
  )
}
