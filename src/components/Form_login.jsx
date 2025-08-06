import { useState } from 'react'
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword,  signOut } from "firebase/auth";
import searchUser from '../hooks/searchUser';
import { useAuth } from './../context/AuthContext';

export const Form_login = ({selectForm, setSelectForm, setShowForm, showForm}) => {
    const [dataLogin, setDataLogin] = useState({
        email: '',
        password: ''
    });
    const { setEstatus } = useAuth();

    let emailSearch = dataLogin.email

    const dataUser = searchUser(emailSearch)

    const handleChangeLogin = (evt) => {
        const { name, value } = evt.target
        setDataLogin({ ...dataLogin, [name]: value })
    };

    const handleSubmitLogin = async(evt) => {
        evt.preventDefault();
        let email = dataLogin.email
        let password = dataLogin.password

        if(dataLogin.email === '' || dataLogin.password === ''){
          console.log('No escribiste nada')
        }else{
            try {
              await signInWithEmailAndPassword(auth, email, password);
              localStorage.setItem('UserState', JSON.stringify(dataUser));
              setShowForm(!showForm)
              // setShowForm(false)
            } catch (error) {
              console.log('Hubo un error, upsss!', error)
            }
          
        }
      }



      const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('UserState');
        setEstatus(false)
        // navigate('/')
        console.log('logout')
      }

  return (
    <div className={`container_form_style animate__animated  ${selectForm ? 'animate__bounceOutLeft' : 'animate__bounceInLeft'}`} >
        <form onSubmit={handleSubmitLogin}>
        <h3>Iniciar sesión</h3>
        <input name='email' type='text' placeholder='Email' onChange={handleChangeLogin}/>
        <input name='password' type='text' placeholder='password' onChange={handleChangeLogin}/>
        <button className='btn_blue' onClick={handleSubmitLogin}>Entrar</button>

        </form>
        <button className='btn_forgot'>Recuperar contraseña</button>
        <p className='txt_form_footer'>¿No tienes una cuenta? <span onClick={() => setSelectForm(true)}> Registrarme</span></p>

    </div>
  )
}
