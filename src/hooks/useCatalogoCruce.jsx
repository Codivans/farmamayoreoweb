import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig";

export const useCatalogoCruce = (shopId) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCruceCatalogo = async () => {
      try {
        if (!shopId) return;

        // 🔹 Documento de la tienda
        const refPequeno = doc(db, "shops", shopId);
        // 🔹 Documento del catálogo general
        const refCompleto = doc(db, "catalogo", "farmaMayoreo");

        const [snapPequeno, snapCompleto] = await Promise.all([
          getDoc(refPequeno),
          getDoc(refCompleto),
        ]);

        if (snapPequeno.exists() && snapCompleto.exists()) {
          const arrayPequeno = snapPequeno.data().catalogo || [];
          const arrayCompleto = snapCompleto.data().catalogo || [];

          const mapaCompleto = new Map(
            arrayCompleto.map((prod) => [prod.codigo, prod])
          );

          const resultado = arrayPequeno
            .map((item) => {
              const encontrado = mapaCompleto.get(item.codigo);
              if (encontrado) {
                return {
                  ...encontrado,
                  marca: item.marca, // atributos extra del pequeño
                  productosTop: item.productosTop,
                  productosCarrusel: item.productosCarrusel,
                };
              }
              return null;
            })
            .filter(Boolean);

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
  }, [shopId]);

  return { productos, loading, error };
};
