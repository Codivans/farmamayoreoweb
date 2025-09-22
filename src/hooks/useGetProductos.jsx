// hooks/useCatalogo.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig"; // importa tu instancia de firestore

export function useGetProductos(departamento) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        setLoading(true);

        const docRef = doc(db, "catalogo", "farmaMayoreo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const catalogo = data.catalogo || [];

          // filtrar por departamento
          let filtrados = catalogo.filter(
            (item) => item.departamento === departamento
          );

          // barajar el array aleatoriamente
          filtrados = filtrados.sort(() => Math.random() - 0.5);

          // limitar a 25
          filtrados = filtrados.slice(0, 25);

          setProductos(filtrados);
        } else {
          setError("Documento no encontrado");
        }
      } catch (err) {
        console.error("Error obteniendo catálogo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (departamento) {
      fetchCatalogo();
    }
  }, [departamento]);

  return { productos, loading, error };
}