import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Menu_perfil = () => {
  const {usuario } = useAuth();

  return (
    <div className='menu_perfil'>
        <h2>Hola, {usuario.displayName}</h2>
        <ul>
            {/* <li><Link to='/'>Mi perfil</Link></li> */}
            <li><Link to='/pedidos_perfil'>Mi pedidos</Link></li>
            <li><Link to='/direcciones_perfil'>Mis Direcciones</Link></li>
            <li><Link to='/documentos'>Mis Documentos</Link></li>
        </ul>
    </div>
  )
}
