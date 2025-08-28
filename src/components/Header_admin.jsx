import React from 'react'
import logo from './../assets/farmamayoreo.svg';
import { Link } from "react-router-dom";

export const Header_admin = () => {
  return (
    <div className="menu_admin">
        <div className="margin_menu_admin">
            <img src={logo} className="logo_admin" />
            <ul>
            <li><Link to='/admin/pedidos'>Pedidos</Link></li>
            <li><Link to='/admin/clientes'>Clientes</Link></li>
            <li><Link to='/admin/pedidos'>Configuraciones</Link></li>
            </ul>
        </div>
    </div>
  )
}
