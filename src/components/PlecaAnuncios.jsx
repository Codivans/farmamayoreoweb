import React from 'react'
import { Link } from 'react-router-dom'

export const PlecaAnuncios = () => {
  return (
    <div className="container-rotator pleca">
        <div className="rotator">
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>WhatsApp. <a href="#">55 1093 5095 </a> contactanos para pedido, informes, cobertura y mas..</div> 
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Servicio a Domicilio sin costo. Importe minimo de compra $5,000</div>
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Recibe nuestro catalogo y se el primero en enterarte de las ofertas que tenemos para ti, solo suscribete en nuestro newsletter</div>
        </div>
    </div>
  )
}