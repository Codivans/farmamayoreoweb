import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Header_principal } from '../components/Header_principal';
import { Menu_perfil } from '../components/Menu_perfil';

export function UploadConstancia() {
  const [archivo, setArchivo] = useState(null);
  const [nombreSeguro, setNombreSeguro] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setArchivo(file);

    if (file) {
      const nombreOriginal = file.name;
      const seguro = nombreOriginal.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
      setNombreSeguro(seguro);
    }
  };

  const handleUpload = async () => {
    if (!archivo) return alert('Selecciona un archivo');

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para subir un archivo.");
      return;
    }

    const userId = user.uid;
    const storage = getStorage();
    const db = getFirestore();

    const rutaArchivo = `constancias/${userId}/${nombreSeguro}`;
    const archivoRef = ref(storage, rutaArchivo);

    try {
      setMensaje('Subiendo archivo...');
      await uploadBytes(archivoRef, archivo);

      const urlDeDescarga = await getDownloadURL(archivoRef);

      // Agregar al campo 'constancias' del documento del usuario
      const usuarioRef = doc(db, `usuarios/${userId}`);
      await updateDoc(usuarioRef, {
        constancias: arrayUnion({
          nombre: nombreSeguro,
          url: urlDeDescarga,
          fecha_subida: new Date()
        })
      });

      setMensaje('✅ Archivo subido y registrado en tu perfil.');

    } catch (error) {
      console.error("Error durante la subida:", error);
      const mensajeError = error.message || "Error inesperado.";
      setMensaje(`❌ ${mensajeError}`);
    }
  };

  return (
    <>
      <Header_principal />

      <div className='container_perfil'>
        <Menu_perfil />
        <div className='container_pedidos_cliente'>
          <p>Por cuestiones de seguridad y para cumplimiento con las normativas de cofepris es necesario que nos proporciones tu constancia de situacion fiscal.</p>

          <div>
              <input type="file" onChange={handleFileChange} accept=".pdf" className='drop_document'/>
              <br /><br />
              <button onClick={handleUpload}>Subir archivo</button>
              <br /><br />
              <p>{mensaje}</p>
          </div>

        </div>
      </div>



    </>
   
  );
}
