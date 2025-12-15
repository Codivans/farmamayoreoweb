import { useState } from 'react'
import { Header_principal } from '../components/Header_principal'
import { Footer } from '../components/Footer'
import { Menu_Bottom } from '../components/Menu_Bottom'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "./../firebase/firebaseConfig"; // asegúrate de tener estas referencias
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

export const Formularios_registro = () => {

    const [form, setForm] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        email: "",
        password: "",
        documento: null,
    });
    const [error, setError] = useState(null);

    function capitalizar(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

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
                nombre: capitalizar(form.nombre),
                apellidoPaterno: capitalizar(form.apellidoPaterno),
                apellidoMaterno: capitalizar(form.apellidoMaterno),
                fechaRegistro: new Date(),
                telefono: form.telefono,
                uid: user.uid,
                roll: 'cliente',
                status: true,
            });

            // 5. Actualizar displayName
            await updateProfile(user, {
                displayName: `${capitalizar(form.nombre)} ${capitalizar(form.apellidoPaterno)}`,
            });

            navigate("/");

        } catch (error) {
            console.error("Error en el registro:", error);
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
    };


  return (
    <>
        <Header_principal />
        <div className='container_form_session'>
            <div className='container_forms_column'>
                <div className='container_form_style animate__animated animate__zoomIn' >
                    <form onSubmit={handleSubmit}>
                    <h3>Registrarme</h3>
                    <input name='email' type='email' placeholder='Correo electrónico' onChange={handleChange} className='email_input'/>
                    <input name='nombre' type='text' placeholder='Nombre' onChange={handleChange}/>
                    <input name='apellidoPaterno' type='text' placeholder='Apellido Paterno' onChange={handleChange}/>
                    <input name='apellidoMaterno' type='text' placeholder='Apellido Materno' onChange={handleChange}/>
                    <input name='telefono' type='tel' placeholder='Numero Telefónico' onChange={handleChange}/>
                    <input name='password' type='password' placeholder='Contraseña' onChange={handleChange} className='pass_input'/>
                    <button className='btn_blue'  type="submit">
                        Entrar
                    </button>
                    </form>
                    <p className='txt_form_footer'>¿Ya tienes una cuenta? <span onClick={() => navigate('/login')}> Inicia sesión</span></p>
                    {
                        error === null ? ("") : (<span className='msg_error'>{error}</span>)
                    }
                </div>
            </div>                
        </div>
        <Footer />
        <Menu_Bottom />
        
    </>
  )
}
