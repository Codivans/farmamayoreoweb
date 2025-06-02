import React from 'react';
import { Link } from 'react-router-dom';

export const Menu_perfil = () => {
  return (
    <div className='menu_perfil'>
        <h2>Hola, Iván Ayala</h2>
        <ul>
            <li><Link to='/mi_perfil'>Mi perfil</Link></li>
            <li><Link to='/pedidos_perfil'>Mi pedidos</Link></li>
            <li><Link to='/direcciones_perfil'>Mis Direcciones</Link></li>
            <li><Link to='/'>Mis Datos Fiscales</Link></li>
        </ul>
    </div>
  )
}
