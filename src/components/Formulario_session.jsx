import React,{ useRef, useEffect, useState } from 'react';

// import { auth } from '../firebase/firebaseConfig';
import imagen from './../assets/imagen.jpeg'
import { Form_login } from './Form_login';
import { Form_Register } from './Form_Register';

export const Formulario_session = ({showForm, setShowForm}) => {
  const [selectForm, setSelectForm] = useState(false);

  const cartRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForm]);

  const divStyle = {
    width: '400px',  /* Ajusta el tamaño según tus necesidades */
    height: '490px', /* Ajusta el tamaño según tus necesidades */
    position: 'relative',
    overflow: 'hidden', // Esto es importante para mantener el efecto dentro del div
    zIndex: 1,
  };

  const imageStyle = {
    width: '130%',
    height: '100%',
    backgroundImage: `url(${imagen})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // backgroundColor: 'rgba(9, 139, 145, 0.8)',
    backgroundColor: 'rgba(43, 55, 90, 0.8)',
    zIndex: 2,
  };


  return (
    <div className='container_form_session' onClick={() => setShowForm(false)}>
        <div className='container_forms' ref={cartRef} onClick={(event) => event.stopPropagation()}>
          <div className='image_session' style={divStyle}>
            <div style={imageStyle}></div>
            <div style={overlayStyle}>
              <h3>Regístrate o inicia sesión para acceder a nuestro catálogo completo, precios exclusivos y ofertas especiales.</h3>
            </div>
          </div>

          <div className='container_forms_column'>
            <Form_login selectForm={selectForm} setSelectForm={setSelectForm} setShowForm={setShowForm} showForm={showForm}/>
            <Form_Register selectForm={selectForm} setSelectForm={setSelectForm} />           
          </div>
        </div>
    </div>
  )
}
