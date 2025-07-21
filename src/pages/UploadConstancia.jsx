import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

export function UploadConstancia() {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState('');

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
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

    const nombreOriginal = archivo.name;
    const nombreSeguro = nombreOriginal.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
    const rutaArchivo = `constancias/${userId}/${nombreSeguro}`;

    const archivoRef = ref(storage, rutaArchivo);

    console.log("Intentando subir archivo:", nombreOriginal, "a la ruta:", rutaArchivo);

    let urlDeDescarga = undefined; // Inicializamos la variable de URL
    try {
        // 1. Subir el archivo
        console.log("Iniciando uploadBytes...");
        await uploadBytes(archivoRef, archivo);
        console.log("uploadBytes completado correctamente."); // <-- Log de éxito de subida

        // 2. Obtener la URL de descarga
        console.log("Iniciando getDownloadURL...");
        urlDeDescarga = await getDownloadURL(archivoRef); // <-- Asignamos a la variable
        console.log('Url de descarga obtenida:', urlDeDescarga); // <-- Verifica el valor aquí

        // *** Verifica este log en la consola del navegador. ***
        // *** ¿Muestra una URL https://... válida, o undefined? ***

        if (!urlDeDescarga) {
             console.error("getDownloadURL no devolvió una URL válida."); // <-- Si es undefined/null
             setResultado('❌ No se pudo obtener la URL de descarga.');
             return; // Detenemos la ejecución si no hay URL
        }


        // 3. Llamar a la función de backend
        console.log("Llamando a la función para verificar con URL:", urlDeDescarga); // <-- Verifica la URL que envías
        const functions = getFunctions();
        const verificarConstanciaManual = httpsCallable(functions, "verificarConstanciaManual");

        // Pasa la variable que contiene la URL real
        const response = await verificarConstanciaManual({ fileUrl: urlDeDescarga });

        console.log("Respuesta de la función:", response.data);

        if (response.data && typeof response.data.valido !== 'undefined') {
             setResultado(response.data.valido ? '✅ Constancia válida' : '❌ Constancia inválida');
        } else if (response.data && response.data.mensaje) {
             setResultado(`✅ ${response.data.mensaje}`);
        } else {
             setResultado('⚠️ No se pudo verificar el archivo o la función no devolvió un resultado esperado.');
        }


    } catch (error) {
        console.error("Error en el proceso de subir y verificar:", error); // <-- Este log es crucial
        // Aquí puedes inspeccionar 'error' para ver la causa exacta (storage/...)
        let mensajeError = "Ocurrió un error inesperado.";
        if (error.code) {
            mensajeError = `Error (${error.code}): ${error.message}`;
        } else if (error.message) {
             mensajeError = `Error: ${error.message}`;
        }
        setResultado(`❌ ${mensajeError}`);
    }
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*,.pdf" />
      <button onClick={handleUpload}>Subir y Verificar</button>
      <p>{resultado}</p>
    </div>
  );
}
