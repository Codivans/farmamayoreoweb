import { useState } from 'react'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "./../firebase/firebaseConfig"; // asegúrate de tener estas referencias
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


export const Form_Register = ({selectForm, setSelectForm}) => {
      const [form, setForm] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        email: "",
        password: "",
        documento: null,
      });

      const navigate = useNavigate();

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: files ? files[0] : value,
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          // 1. Crear usuario
          const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
          const user = userCredential.user;
          console.log("Usuario creado con UID:", user.uid);

          // 4. Guardar información en Firestore
          await setDoc(doc(db, "usuarios", user.uid), {
            nombre: form.nombre,
            apellidoPaterno: form.apellidoPaterno,
            apellidoMaterno: form.apellidoMaterno,
            telefono: form.telefono,
            uid: user.uid,
            roll: 'cliente',
            status: false,
          });

          console.log("Datos guardados en Firestore");

          // 5. Actualizar displayName
          await updateProfile(user, {
            displayName: `${form.nombre} ${form.apellidoPaterno}`,
          });

          console.log("displayName actualizado");
          navigate("/");

        } catch (error) {
          console.error("Error en el registro:", error);
          alert("Ocurrió un error durante el registro");
        }
      };

      
  return (
    <div className={`container_form_style form_register animate__animated  ${selectForm ? 'animate__bounceInRight' : 'animate__bounceOutRight'}`} >
        <form onSubmit={handleSubmit}>
        <h3>Registrarme</h3>
        <input name='email' type='text' placeholder='Correo electrónico' onChange={handleChange}/>
        <input name='nombre' type='text' placeholder='Nombre' onChange={handleChange}/>
        <input name='apellidoPaterno' type='text' placeholder='Apellido Paterno' onChange={handleChange}/>
        <input name='apellidoMaterno' type='text' placeholder='Apellido Materno' onChange={handleChange}/>
        <input name='telefono' type='text' placeholder='Numero Telefónico' onChange={handleChange}/>

        {/* <input
          type="file"
          // accept="application/pdf"
          onChange={(e) => setForm({ ...form, documento: e.target.files[0] })}
          required
        /> */}

        

        <input name='password' type='password' placeholder='Contraseña' onChange={handleChange}/>
        <button className='btn_blue'  type="submit">
            Entrar
        </button>
        </form>
        <p className='txt_form_footer'>¿Ya tienes una cuenta? <span onClick={() => setSelectForm(false)}> Inicia sesión</span></p>
    </div>
  )
}
