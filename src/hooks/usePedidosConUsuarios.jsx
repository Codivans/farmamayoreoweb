import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./../firebase/firebaseConfig"; // Tu configuración

export const usePedidosConUsuarios = () => {
  const [pedidosConUsuarios, setPedidosConUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const pedidosSnap = await getDocs(collection(db, "pedidos"));
        const pedidosData = [];

        for (const docPedido of pedidosSnap.docs) {
          const pedidoData = docPedido.data();
          const uidUsuario = pedidoData.usuario;

          let usuarioData = null;

          if (uidUsuario) {
            const usuarioSnap = await getDoc(doc(db, "usuarios", uidUsuario));
            usuarioData = usuarioSnap.exists() ? usuarioSnap.data() : null;
          }

          pedidosData.push({
            idPedido: docPedido.id,
            pedido: pedidoData,
            usuario: usuarioData,
          });
        }

        setPedidosConUsuarios(pedidosData);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  return { pedidosConUsuarios, loading };
};
