import React,{ useRef, useEffect, useState } from 'react';
import { Header_principal } from '../components/Header_principal';
import imagen from './../assets/imagen.jpeg'
import { Form_login } from './../components/Form_login';
import { Form_Register } from './../components/Form_Register';
import { Menu_Bottom } from '../components/Menu_Bottom';

export const Formularios_session = () => {
  const [selectForm, setSelectForm] = useState(false);

  const cartRef = useRef(null);
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
    backgroundColor: 'rgba(43, 55, 90, 0.8)',
    zIndex: 2,
  };

  return (
    <>
        <Header_principal />
        <div className='container_form_session'>

            <div className='container_forms' ref={cartRef} onClick={(event) => event.stopPropagation()}>
              <div className='image_session' style={divStyle}>
                <div style={imageStyle}></div>
                <div style={overlayStyle}>
                  <h3>Regístrate o inicia sesión para acceder a nuestro catálogo completo, precios exclusivos y ofertas especiales.</h3>
                </div>
              </div>

              <div className='container_forms_column'>
                <Form_login selectForm={selectForm} setSelectForm={setSelectForm}/>
                <Form_Register selectForm={selectForm} setSelectForm={setSelectForm} />           
              </div>
            </div>
            
        </div>
        <Menu_Bottom />
        
    </>
  )
}
