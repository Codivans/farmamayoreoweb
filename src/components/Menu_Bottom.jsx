import React, { useContext, useState } from 'react';
import { ContextoCarrito } from './../context/cartContext';
import { HiOutlineHome } from "react-icons/hi2";
import { IoMenu } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import { Formulario_session } from './Formulario_session';

export const Menu_Bottom = () => {
    const [isActive, setIsActive] = useState(1);
    const navigate = useNavigate();
    const { countCart } = useContext(ContextoCarrito);
    const clickHome = () => {
        setIsActive(1)
        navigate('/')
    }


  return (
    <>
    
        <nav className='bottom_navigation'>
            <ul>
                <li>
                    <Link to='/' className='btn_bottom_navigation'>
                        <HiOutlineHome />
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to='/login' className='btn_bottom_navigation'>
                        <HiOutlineUser />
                        <span>Cuenta</span>
                    </Link>
                </li>            
            </ul>
        </nav>
    </>
  )
}
