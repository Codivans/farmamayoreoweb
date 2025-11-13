import React,{ useRef, useEffect, useState } from 'react';
import { Header_principal } from '../components/Header_principal';
import { Footer } from '../components/Footer';
import imagen from './../assets/imagen.jpeg'
import { Form_login } from './../components/Form_login';
import { Form_Register } from './../components/Form_Register';
import { Menu_Bottom } from '../components/Menu_Bottom';

export const Formularios_session = () => {
  const [selectForm, setSelectForm] = useState(false);


  return (
    <>
        <Header_principal />
        <div className='container_form_session'>
            <div className='container_forms' onClick={(event) => event.stopPropagation()}>
              <div className='container_forms_column'>
                <Form_login selectForm={selectForm} setSelectForm={setSelectForm}/>
                <Form_Register selectForm={selectForm} setSelectForm={setSelectForm} />           
              </div>
            </div>
            
        </div>
        <Footer />
        <Menu_Bottom />
        
    </>
  )
}
