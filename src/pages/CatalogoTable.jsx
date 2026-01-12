import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // ajusta ruta si es necesario

export const CatalogoTable = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerCatalogo = async () => {
    try {
      const ref = doc(db, "catalogo", "farmaMayoreo");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // 👇 aquí está tu array
        setProductos(data.catalogo || []);
      }
    } catch (error) {
      console.error("Error al obtener catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCatalogo();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;
  if (productos.length === 0) return <p>No hay productos</p>;

  // columnas dinámicas según el primer producto
  const columnas = Object.keys(productos[0]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Catálogo Farma Mayoreo</h2>

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="6" width="100%">
          <thead>
            <tr>
              {columnas.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                {columnas.map(col => (
                  <td key={col}>
                    {typeof producto[col] === "object"
                      ? JSON.stringify(producto[col])
                      : producto[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
