import { useState } from 'react';
import { Header_principal } from '../components/Header_principal';
import { Footer } from '../components/Footer';
import { Menu_Bottom } from '../components/Menu_Bottom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';

export const RecuperarPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const handlePasswordReset = async () => {
        const auth = getAuth();
        try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Se ha enviado un enlace para restablecer tu contraseña al correo proporcionado.");
        setError("");
        } catch (err) {
        setMessage("");
        setError("Hubo un error al enviar el correo. Verifica tu dirección de correo.");
        }
    };

  return (
     <>
        <Header_principal />
        <div className='container_form_session'>
            <div className='container_forms_column'>

                <div className='container_form_style animate__animated animate__zoomIn' >
                    <div className='form_div'>
                    <h3>Restaura tu Contraseña</h3>
                    <p className='txt_recuperar'>¿Olvidaste tu contraseña?, ingresa tu correo y te enviaremos por correo un link para restablecer tu contraseña</p>

                    <input 
                        name='email' 
                        type='email' 
                        placeholder='Correo electrónico'  
                        transform='lowercase'
                        className='inp_email'
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                 
                    
                    <button  onClick={handlePasswordReset} className='btn_blue'>Recuperar</button>
            
                    </div>
                      {message && <>
                            <p style={{ color: "green" }}>{message}</p>
                            <Link to="/login">Ir a login</Link>
                        </>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

            </div>                
        </div>
        <Footer />
        <Menu_Bottom />
        
    </>
  )
}
