import { useState } from 'react'
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword,  signOut } from "firebase/auth";
import searchUser from '../hooks/searchUser';
import { useAuth } from './../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { VscEye , VscEyeClosed} from "react-icons/vsc";


export const Form_login = ({selectForm, setSelectForm, setShowForm, showForm}) => {
    const [dataLogin, setDataLogin] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);

    const { setEstatus } = useAuth();

    const navigate = useNavigate();

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
              navigate('/')
              // setShowForm(!showForm)
              // setShowForm(false)
            } catch (error) {
               console.log(error)

                  // Capturar errores específicos
                  switch (error.code) {
                    case "auth/invalid-email":
                    setError("El correo electrónico no es válido.");
                    break;
                    case "auth/user-not-found":
                    setError("No se encontró un usuario con este correo.");
                    break;
                    case "auth/wrong-password":
                    setError("La contraseña es incorrecta.");
                    break;
                    case "auth/email-already-in-use":
                    setError("Este correo ya está registrado.");
                    break;
                    case "auth/weak-password":
                    setError("La contraseña debe tener al menos 6 caracteres.");
                    break;
                    case "auth/invalid-credential":
                    setError("Tus datos son erroneos, intenta de nuevo");
                    break
                    default:
                    setError("Ocurrió un error. Intenta de nuevo.");
                }
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

      const handleShowPass = () => {
        setShowPass(!showPass)
      }

  return (
    <div className={`container_form_style animate__animated  ${selectForm ? 'animate__bounceOutLeft' : 'animate__bounceInLeft'}`} >
        <form onSubmit={handleSubmitLogin}>
        <h3>Iniciar sesión</h3>
        <input name='email' type='email' placeholder='Email' onChange={handleChangeLogin} className='inp_email'/>
        <div className='input_pass'>
          <input name='password' type={showPass ? 'text' : 'password'} placeholder='password' onChange={handleChangeLogin} className='inp_pass'/>
          <span onClick={handleShowPass}> {showPass ? <VscEyeClosed /> : <VscEye />}</span>
        </div>
        
        <button className='btn_blue' onClick={handleSubmitLogin}>Entrar</button>

        </form>
        <Link to="/recuperar" className='btn_forgot'>Recuperar contraseña</Link>
        <p className='txt_form_footer'>¿No tienes una cuenta? <span onClick={() => setSelectForm(true)}> Registrarme</span></p>
        
        {
            error === null ? ("") : (<span className='msg_error'>{error}</span>)
        }

    </div>
  )
}
