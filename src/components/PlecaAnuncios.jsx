import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from "react-icons/fa";

export const PlecaAnuncios = () => {
  return (
    <div className="container-rotator pleca">
        <div className="rotator">
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Consulta tus pedidos en <FaWhatsapp /> 55 3551 0668</div> 
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Servicio a domicilio consulta tu zona</div>
            <div className="rotator-item" style={{backgroundColor: '#0066ff'}}>Enterate primero de nustras ofertas</div>
        </div>
    </div>
  )
}