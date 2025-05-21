const functions = require("firebase-functions");
const {Storage} = require("@google-cloud/storage");
const vision = require("@google-cloud/vision");

const storage = new Storage();
const client = new vision.ImageAnnotatorClient();

// Lista de palabras clave a buscar
const palabrasClave = [
  "RFC",
  "CONSTANCIA DE SITUACION FISCAL",
  "SERVICIO DE ADMINISTRACIÓN TRIBUTARIA",
  "SAT",
  "CLAVE DE RFC"
];

exports.verificarConstancia = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;

  console.log(`Archivo recibido: ${filePath}, tipo: ${contentType}`);

  // Verifica que sea imagen o PDF
  if (!contentType.startsWith("image/") && !contentType.endsWith("pdf")) {
    console.log("Archivo no válido. Solo se permiten imágenes o PDFs.");
    return null;
  }

  // Ruta completa en storage
  const bucketName = object.bucket;
  const fileUri = `gs://${bucketName}/${filePath}`;

  let response;
  try {
    // Si es imagen, usa documentTextDetection o textDetection
    if (contentType.startsWith("image/")) {
      response = await client.documentTextDetection(fileUri);
    } else if (contentType.endsWith("pdf")) {
      // Para PDF usa una petición especial con feature DOCUMENT_TEXT_DETECTION
      const [operation] = await client.asyncBatchAnnotateFiles({
        requests: [{
          inputConfig: {
            mimeType: 'application/pdf',
            gcsSource: {uri: fileUri}
          },
          features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
          outputConfig: {
            gcsDestination: {uri: `gs://${bucketName}/vision-output/`},
            batchSize: 1
          }
        }]
      });

      console.log("Esperando procesamiento del PDF...");
      await operation.promise();

      console.log("Procesamiento terminado. Debes leer el output desde vision-output/");
      return null; // O puedes leer el resultado desde vision-output/
    }

    const detections = response[0].fullTextAnnotation;
    const textoDetectado = detections ? detections.text.toUpperCase() : "";

    console.log("Texto extraído:", textoDetectado.slice(0, 500)); // muestra los primeros 500 caracteres

    // Verifica si contiene alguna palabra clave
    const contieneClave = palabrasClave.some(palabra => textoDetectado.includes(palabra));

    if (contieneClave) {
      console.log("✅ El documento parece ser una constancia válida.");
    } else {
      console.log("❌ El documento NO contiene información de una constancia válida.");
    }

    return null;
  } catch (error) {
    console.error("Error al analizar el documento:", error);
    return null;
  }
});

