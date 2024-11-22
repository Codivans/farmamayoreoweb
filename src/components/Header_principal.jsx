import React, { useState, useContext } from 'react';
import { ContextoCarrito } from './../context/cartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Cart_slide } from './Cart_slide';
import logo from './../assets/farmamayoreo.svg';
import { IoSearch } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { TiUser } from "react-icons/ti";
import { Flag_Header } from './Flag_Header';
import { Formulario_session } from './Formulario_session';
import { useAuth } from '../context/AuthContext';

export const Header_principal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [showForm, setShowForm] = useState(false);    
    const navigate = useNavigate();
    const { countCart } = useContext(ContextoCarrito);
    const {usuario, userName } = useAuth();

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (searchTerm.trim()) {
            navigate(`/search/search_input/${searchTerm}`);
          }
        }
      };
      console.log(usuario)

  return (
    <div id='header_page'>
        <Flag_Header />
        <div id="header_top">
            <div id='container_logo'>
                <Link to='/'>
                    <img src={logo} />
                </Link>
            </div>

            <div id='container_search'>
                <IoSearch />
                <input 
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='¿Que producto estas buscando?'/>
            </div>

            <div id='container_perfil'>
                <button className='container_icons_perfil' onClick={() => setShowCart(!showCart)}>
                   <IoMdCart /> 
                   <span>Mi carrito</span>
                   {
                    countCart > 0 
                    ?(<span className='count_cart animate__animated animate__bounceIn'>{countCart > 99 ? '99+' : countCart}</span>) 
                    :('')
                   }
                   
                </button>
                <button className='container_icons_perfil' onClick={() => setShowForm(!showForm)}>
                    <TiUser />
                   <span> {userName  ?  `${userName[0].nombre} ${userName[0].apellidos}` : 'Iniciar sesión'}</span>
                </button>
            </div>
        </div>

        <div id='header_bottom'>
            <nav id='nav_header'>
                <ul>
                    <li><Link to='/search/familia/medicamento'>Medicamento</Link> </li>
                    <li><Link to='/search/familia/bebes'>Bebes</Link> </li>
                    <li><Link to='/search/familia/perfumeria'>Perfumeria</Link> </li>
                    <li><Link to='/search/familia/curacion'>Curación</Link> </li>
                    <li><Link to='/search/familia/sueros'>Sueros orales</Link> </li>
                    <li><Link to='/search/familia/suplementos'>Suplementos</Link> </li>
                    <li><Link to='/search/familia/sexualidad'>Sexualidad</Link> </li>
                </ul>
            </nav>
        </div>
        {
            showCart && <Cart_slide showCart={showCart} setShowCart={setShowCart}/>
        }

        {
            showForm && <Formulario_session showForm={showForm} setShowForm={setShowForm} />
        }
        
        
    </div>
  )
}
