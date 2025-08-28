import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Header_principal } from '../components/Header_principal';
import { Menu_perfil } from '../components/Menu_perfil';
import ic_pdf from './../assets/ic-pdf.svg'
import { RiFileUploadLine } from "react-icons/ri";

export function UploadConstancia() {
  const [archivoConstancia, setArchivoConstancia] = useState(null);
  const [archivoAviso, setArchivoAviso] = useState(null);
  const [usuarioDocs, setUsuarioDocs] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [openPdf, setOpenPdf] = useState(null); // "constancia" o "aviso"

  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const user = auth.currentUser;

  // 🔹 Cargar documentos del usuario al montar el componente
  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      const usuarioRef = doc(db, `usuarios/${user.uid}`);
      const snap = await getDoc(usuarioRef);
      if (snap.exists()) {
        setUsuarioDocs(snap.data());
      }
    };
    fetchDocs();
  }, [user]);

  // 🔹 Manejar cambios de archivos
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (tipo === "constancia") setArchivoConstancia(file);
    if (tipo === "aviso") setArchivoAviso(file);
  };

  // 🔹 Subir archivo genérico
  const handleUpload = async (file, tipo) => {
    if (!file) return alert('Selecciona un archivo');

    try {
      setMensaje(`Subiendo ${tipo}...`);
      const nombreSeguro = file.name.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
      const rutaArchivo = `${tipo}/${user.uid}/${nombreSeguro}`;
      const archivoRef = ref(storage, rutaArchivo);

      // Subir archivo a Storage
      await uploadBytes(archivoRef, file);
      const url = await getDownloadURL(archivoRef);

      // Guardar en Firestore
      const usuarioRef = doc(db, `usuarios/${user.uid}`);
      await updateDoc(usuarioRef, {
        [tipo]: {
          nombre: nombreSeguro,
          url,
          fecha_subida: new Date()
        }
      });

      setMensaje(`✅ ${tipo} subida correctamente.`);
      setUsuarioDocs(prev => ({
        ...prev,
        [tipo]: { nombre: nombreSeguro, url, fecha_subida: new Date() }
      }));

    } catch (error) {
      console.error("Error durante la subida:", error);
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header_principal />

      <div className='container_perfil'>
        <Menu_perfil />
        <div className='container_panel'>
          {
            usuarioDocs?.constancia?.url || usuarioDocs?.aviso?.url ? 'ya estan' : 'no hay archivos'
          }
          <p className='message_alert'>⚠️ Es necesario que proporciones tu constancia de situación fiscal y tu aviso de funcionamiento.</p>

          {/* 📌 Constancia */}
          <h3>Constancia de situación fiscal</h3>
          {usuarioDocs?.constancia?.url ? (
            <div  className="container_icon_pdf">
              <div
                onClick={() => setOpenPdf("constancia")}>
                <img src={ic_pdf}  alt="pdf icon" className="icon_pdf" />
                <p className="txt_view_pdf">Ver Constancia</p>
              </div>
            </div>
          ) : (
            <div className='container_input_file'>

              {
                archivoConstancia != null ? 
                  (
                    <p className='txt_info_document'>
                      <b>{archivoConstancia.name}</b> / size:{archivoConstancia.size.toLocaleString('es-ES')} bytes
                    </p>
                  ) 
                  : (
                  <label className='input_file_document' onChange={(e) => handleFileChange(e, "constancia")} >
                    <RiFileUploadLine /><br />
                    <span>Carga tu archivo</span>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, "constancia")} 
                      accept=".pdf" 
                      hidden
                    />
                  </label>
                )
              }
              {
                archivoConstancia != null &&
                <button 
                  onClick={() => handleUpload(archivoConstancia, "constancia")}
                  className='btn_save_document'
                >
                  Subir Constancia
                </button>
              }
            </div>
          )}

          <hr className="separtor"/>

          {/* 📌 Aviso de funcionamiento */}
          <h3>Aviso de funcionamiento</h3>
          {usuarioDocs?.aviso?.url ? (
            <div className="container_icon_pdf">
              <div onClick={() => setOpenPdf("aviso")}>
                <img src={ic_pdf}  alt="pdf icon" className="icon_pdf" />
                <p className="txt_view_pdf">Ver Aviso</p>
              </div>
            </div>
          ) : (
            <div className='container_input_file'>
              {
                archivoAviso != null ? (
                  <p className='txt_info_document'>
                      <b>{archivoAviso.name}</b> / size:{archivoAviso.size.toLocaleString('es-ES')} bytes
                  </p>
                ) : (
                  <label className='input_file_document' onChange={(e) => handleFileChange(e, "aviso")} >
                    <RiFileUploadLine /><br />
                    <span>Carga tu archivo</span>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      hidden
                    />
                  </label>
                  
                )
              }

              {
                archivoAviso != null &&
                <button 
                  onClick={() => handleUpload(archivoAviso, "aviso")} 
                  className='btn_save_document'
                >
                  Subir Aviso
                </button>
              }
              
              
            </div>
          )}

          <p>{mensaje}</p>

          {/* Modal PDF */}
          {openPdf && (
            <div className="wrap_pop">
              <div className="pop_content">
                <button onClick={() => setOpenPdf(null)} className="btn_delete_pop">✕</button>
                <iframe
                  src={usuarioDocs?.[openPdf]?.url}
                  title="PDF Viewer"
                  className="fram_container"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
