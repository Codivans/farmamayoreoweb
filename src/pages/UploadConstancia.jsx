import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useState } from 'react';

export function UploadConstancia() {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState('');

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!archivo) return alert('Selecciona un archivo');

    
    const userId = "invitado"; // Evita undefined

    const storage = getStorage();
    const archivoRef = ref(storage, `constancias/${userId}/${archivo.name}`);
    await uploadBytes(archivoRef, archivo);
    const url = await getDownloadURL(archivoRef);

    const functions = getFunctions();
    const verificarConstancia = httpsCallable(functions, 'verificarConstancia');
    const response = await verificarConstancia({ fileUrl: url });

    setResultado(response.data.valido ? '✅ Constancia válida' : '❌ Constancia inválida');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*,.pdf" />
      <button onClick={handleUpload}>Subir y Verificar</button>
      <p>{resultado}</p>
    </div>
  );
}
