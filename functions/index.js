const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");
const vision = require("@google-cloud/vision");

const storage = new Storage();
const client = new vision.ImageAnnotatorClient();

const palabrasClave = [
  "RFC",
  "CONSTANCIA DE SITUACION FISCAL",
  "Farmacia",
  "SAT",
  "CLAVE DE RFC"
];

exports.verificarConstanciaManual = functions.https.onCall(async (data, context) => {
  console.log("DATA RECIBIDA:", data);
  const fileUrl = data.fileUrl; // Esto será una URL https://firebasestorage.googleapis.com/...
  console.log("URL recibida:", fileUrl);

  if (
    !fileUrl ||
    (!fileUrl.startsWith("gs://") && !fileUrl.startsWith("https://")) // Permitimos URLs https
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "URL del archivo no válida.", data
    );
  }

  try {
    // *** ¡Aquí está el cambio! Usar el nombre del bucket con .appspot.com ***
    // Puedes obtenerlo del contexto de Firebase Functions si es necesario,
    // o usar el nombre de tu proyecto seguido de .appspot.com
    const bucketName = `${process.env.GCLOUD_PROJECT}.appspot.com`; // O simplemente 'farmamayoreoapp.appspot.com' si prefieres hardcodearlo, pero usar process.env.GCLOUD_PROJECT es más flexible.
    console.log("Usando bucket name:", bucketName);


    // La URL de entrada es HTTPS. Necesitamos extraer la ruta y usar el bucketName correcto para la URI gs://
    const matches = fileUrl.match(/\/b\/([^/]+)\/o\/(.*?)(?:\?|$)/); // Regex mejorado para URLs https
    if (!matches || matches.length < 3) {
        // Si la URL no tiene el formato esperado, lanzamos error.
        // Esto también captura el caso de la URL de ejemplo "..."
        console.error("La URL no coincide con el formato esperado:", fileUrl);
        throw new functions.https.HttpsError("invalid-argument", "Formato de URL del archivo no válido.");
    }

    // matches[1] sería el bucket name de la URL https (que debería ser farmamayoreoapp.appspot.com)
    // matches[2] es la ruta del objeto codificada en la URL
    const extractedBucketFromUrl = matches[1]; // No lo usamos directamente para la URI gs://, solo para verificación si quieres
    const filePath = decodeURIComponent(matches[2]); // Decodificamos la ruta

    console.log("Ruta del archivo extraída:", filePath);

    // Construimos la URI gs:// usando el bucketName CORRECTO (.appspot.com) y la ruta extraída
    const fileUri = `gs://${bucketName}/${filePath}`;
    console.log("URI gs:// construida:", fileUri);

    const extension = filePath.split(".").pop().toLowerCase();

    let response;
    if (["jpg", "jpeg", "png", "bmp", "gif", "webp"].includes(extension)) {
      console.log(`Procesando imagen con Vision API: ${fileUri}`);
      response = await client.documentTextDetection(fileUri);

      const detections = response[0].fullTextAnnotation;
      const textoDetectado = detections ? detections.text.toUpperCase() : "";

      console.log("Texto detectado (primeros 300 chars):", textoDetectado.slice(0, 300));

      const contieneClave = palabrasClave.some(palabra => textoDetectado.includes(palabra));

      console.log("Resultado de la verificación (imagen):", { valido: contieneClave });
      return { valido: contieneClave }; // Devolvemos el resultado inmediato para imágenes

    } else if (extension === "pdf") {
      // *** Importante: La URL de destino para el output de Vision API también debe usar el bucket .appspot.com ***
      // const visionOutputPath = `vision-output/${Date.now()}/`;
      const visionOutputPath = `vision-output/${userId}_${nombreSeguro.replace(/\.pdf$/, '')}/`;
      const visionOutputUri = `gs://${bucketName}/${visionOutputPath}`;
      console.log(`Iniciando procesamiento de PDF asíncrono. Output en: ${visionOutputUri}`);


      const [operation] = await client.asyncBatchAnnotateFiles({
        requests: [{
          inputConfig: {
            mimeType: 'application/pdf',
            gcsSource: { uri: fileUri }
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          outputConfig: {
            gcsDestination: { uri: visionOutputUri },
            batchSize: 1 // Procesar página por página (útil para grandes PDFs)
          }
        }]
      });

      console.log("Operación de procesamiento de PDF iniciada.");
      // *** ¡Aquí está la decisión! ***
      // 1. Puedes esperar aquí a que termine (puede tomar mucho tiempo para PDFs grandes)
      //    await operation.promise();
      //    console.log("Procesamiento de PDF asíncrono terminado.");
      //    // Después de esperar, tendrías que leer los archivos JSON de salida generados por Vision API
      //    // en la ruta visionOutputUri y analizar su contenido para verificar las palabras clave.
      //    // Esto requiere lógica adicional para listar archivos en la carpeta de salida y leer cada uno.
      //    // Es más complejo y puede exceder el tiempo de ejecución de Cloud Functions para PDFs muy grandes.
      //
      // 2. O puedes simplemente informar al frontend que el procesamiento se ha iniciado
      //    y dejar que otro proceso (por ejemplo, otra Cloud Function activada por la creación de archivos en vision-output)
      //    realice la verificación una vez que Vision haya terminado. Esta es la opción actual en tu código.
      //    console.log("Procesamiento iniciado. Revisa la carpeta de output para el resultado cuando esté listo.");
      //    return { valido: true, mensaje: "PDF procesado asincrónicamente. La verificación manual requerirá leer los resultados guardados." };

      // Opción 2 (la que tenías implementada, solo mejorando el mensaje):
      console.log("Procesamiento iniciado. La verificación del contenido del PDF se realizará leyendo los archivos de salida cuando Vision API termine.");
      return { valido: true, mensaje: "PDF enviado para procesamiento asíncrono." };


    } else {
      console.warn("Tipo de archivo no compatible:", extension);
      throw new functions.https.HttpsError("invalid-argument", `Tipo de archivo no compatible: ${extension}.`);
    }

  } catch (error) {
    console.error("Error verificando constancia:", error);

    // Lanzar un HttpsError para que el frontend lo maneje correctamente
    if (error instanceof functions.https.HttpsError) {
        throw error; // Relanza errores HttpsError específicos
    } else {
        // Envuelve otros errores inesperados en un HttpsError genérico
        throw new functions.https.HttpsError(
          "internal",
          "Error interno al procesar el documento.",
          typeof error?.message === 'string' ? error.message : String(error)
        );

    }
  }
});


// exports.procesarResultadoVision = functions.storage.object().onFinalize(async (object) => {
//     const filePath = object.name;
//     if (!filePath.startsWith("vision-output/") || !filePath.endsWith(".json")) {
//       console.log("Archivo ignorado:", filePath);
//       return null;
//     }

//     const bucket = storage.bucket(object.bucket);
//     const file = bucket.file(filePath);
//     const [contents] = await file.download();

//     let json;
//     try {
//       json = JSON.parse(contents.toString());
//     } catch (err) {
//       console.error("Error al parsear JSON:", err);
//       return null;
//     }

//     const textoDetectado = json.responses
//       .map(res => res.fullTextAnnotation?.text || '')
//       .join('\n')
//       .toUpperCase();

//     const contieneClave = palabrasClave.some(palabra => textoDetectado.includes(palabra));
//     console.log("Resultado:", contieneClave);

//     // Extraer UID y nombre de archivo desde el path
//     const match = filePath.match(/^vision-output\/([^_]+)_(.+)\/output-\d+-to-\d+\.json$/);
//     if (!match) {
//       console.error("No se pudo extraer UID y nombre desde:", filePath);
//       return null;
//     }

//     const userId = match[1];
//     const nombreArchivo = match[2];
//     const docId = `${userId}_${nombreArchivo}`;

//     await firestore.collection("verificaciones").doc(docId).set({
//       userId,
//       nombreArchivo,
//       valido: contieneClave,
//       textoDetectado: textoDetectado.slice(0, 1000),
//       procesadoEn: new Date().toISOString(),
//       archivo: filePath,
//     });

//     console.log("Resultado guardado con ID:", docId);
//     return null;
//   });
