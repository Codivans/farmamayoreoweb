import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import createUser from '../firebase/creatUser';
import { auth } from './../firebase/firebaseConfig';

export const Form_Register = ({selectForm, setSelectForm}) => {
    const [dataRegistro, setDataRegistro] = useState({
        email: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        password: ''
    
      })

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataRegistro({ ...dataRegistro, [name]: value })
      };
    
    
    
      const actualizarNombre = async () => {
        await updateProfile(auth.currentUser, {
          displayName: dataRegistro.userName
        }).then(() => {
          console.log('Actualizado.')
        }).catch((error) => {
          console.log(error)
        })
      }
    
      const handleSubmitRegister = async(evt) => {
        evt.preventDefault()
        let email = dataRegistro.email
        let nombre = dataRegistro.nombre
        let apellidos = dataRegistro.apellidos
        let telefono = dataRegistro.telefono
        let password = dataRegistro.password
        
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          actualizarNombre()
          let uidUser = userCredential.user.uid;
          createUser({uidUser, email, nombre, apellidos, telefono})
          console.log('listo')
        })
        .catch((error) => {
          const errorMessage = error.message;
          if(errorMessage === 'Firebase: Error (auth/email-already-in-use).'){
            // toast.error(`El correo ${email} ya esta registrado.`);
          }
            console.log(errorMessage)
        })
      }
      console.log(dataRegistro)
  return (
    <div className={`container_form_style form_register animate__animated  ${selectForm ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`} >
        <form onSubmit={handleSubmitRegister}>
        <h3>Registrarme</h3>
        <input name='email' type='text' placeholder='Correo electrónico' onChange={handleChange}/>
        <input name='nombre' type='text' placeholder='Nombre' onChange={handleChange}/>
        <input name='apellidos' type='text' placeholder='Apellido' onChange={handleChange}/>
        <input name='telefono' type='text' placeholder='Numero Telefónico' onChange={handleChange}/>
        <input name='password' type='password' placeholder='Contraseña' onChange={handleChange}/>
        <button className='btn_blue'>
            Entrar
        </button>
        </form>
        <p className='txt_form_footer'>¿Ya tienes una cuenta? <span onClick={() => setSelectForm(false)}> Inicia sesión</span></p>
    </div>
  )
}
