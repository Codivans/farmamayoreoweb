import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig";

export const useCatalogoCruce = (rutaDocumentoPequeno) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCruceCatalogo = async () => {
      try {
        const refPequeno = doc(db, "shops", ...rutaDocumentoPequeno.split("/"));
        const refCompleto = doc(db, "catalogo", "farmaMayoreo");

        const [snapPequeno, snapCompleto] = await Promise.all([
          getDoc(refPequeno),
          getDoc(refCompleto),
        ]);

        if (snapPequeno.exists() && snapCompleto.exists()) {
          const arrayPequeno = snapPequeno.data().catalogo;
          const arrayCompleto = snapCompleto.data().catalogo;

          const mapaCompleto = new Map(
            arrayCompleto.map((prod) => [prod.codigo, prod])
          );

          const resultado = arrayPequeno
            .map((item) => {
              const encontrado = mapaCompleto.get(item.codigo);
              if (encontrado) {
                return {
                  ...encontrado,
                  marca: item.marca, // añadimos la marca del array pequeño
                  store: item.store, // añadimos la marca del array pequeño
                };
              }
              return null;
            })
            .filter((item) => item !== null);

          setProductos(resultado);
        } else {
          throw new Error("Uno o ambos documentos no existen");
        }
      } catch (err) {
        console.error("Error en el cruce de catálogo:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerCruceCatalogo();
  }, [rutaDocumentoPequeno]);

  return { productos, loading, error };
};
