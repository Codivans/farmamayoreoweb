import { useState, useContext, useRef, useEffect } from 'react';
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
import { MenuFamilias } from './MenuFamilias';
import { signOut } from 'firebase/auth';
import { auth } from './../firebase/firebaseConfig';

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
      
    const logOut = async () => {
        await signOut(auth)
        toast.success('Cerraste sesión, hasta pronto!!');
        setEstatus(true)
        localStorage.removeItem('UserState')
        navigate('/')
        
    }

  return (
    <div id='header_page'>
        <Flag_Header />
        <div id="header_top">
            <div id='container_logo'>
                <Link to='/'>
                    <img src={logo} />
                </Link>
            </div>
            

            <div>
                <MenuFamilias />
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
                {
                    usuario ? (
                        <div className='container_user_buttons'>
                            <Link to='/direcciones_perfil' className='item_displayname_user'>
                                <TiUser />
                                {usuario?.displayName}
                            </Link>
                            <button onClick={logOut}>
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button className='container_icons_perfil btn_user' onClick={() => setShowForm(!showForm)}>
                            <TiUser />
                            <span>Iniciar sesión</span>
                        </button>
                    )
                }
                <button className='container_icons_perfil btn_cart' onClick={() => setShowCart(!showCart)}>
                   <IoMdCart /> 
                   {
                    countCart > 0 
                    ?(<span className='count_cart animate__animated animate__bounceIn'>{countCart > 99 ? '99+' : countCart}</span>) 
                    :('')
                   }
                   
                </button>
               
            </div>
        </div>

        {/* <div id='header_bottom'>
            <MenuFamilias />
        </div> */}
        {
            showCart && <Cart_slide showCart={showCart} setShowCart={setShowCart}/>
        }

        {
            showForm && <Formulario_session showForm={showForm} setShowForm={setShowForm} />
        }
        
        
    </div>
  )
}
