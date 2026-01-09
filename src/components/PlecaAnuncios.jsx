import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from "react-icons/fa";

export const PlecaAnuncios = () => {
  return (
    <div className="container-rotator pleca">
        <div className="rotator">
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Consulta tus pedidos en <FaWhatsapp /> 56 3571 2250</div> 
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Servicio a domicilio consulta tu zona</div>
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Enterate primero de nustras ofertas</div>
        </div>
    </div>
  )
}