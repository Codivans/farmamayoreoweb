import { useState } from "react";
import { storage } from "./../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uid } from 'uid';

export const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo");

    try {
      const storageRef = ref(storage, `documentos/${uid(16)}`);

      console.log("Subiendo archivo...");
      await uploadBytes(storageRef, file)
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
  };

  return (
    <div>
      <h2>Subir archivo v2</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>

      {/* {fileURL && (
        <div>
          <p>Archivo subido correctamente:</p>
          <a href={fileURL} target="_blank" rel="noopener noreferrer">
            Ver archivo
          </a>
        </div>
      )} */}
    </div>
  );
};
