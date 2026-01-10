import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function obtenerRangosEnvio() {
  const q = query(
    collection(db, "configuracion_envio"),
    where("activo", "==", true),
    orderBy("km_min")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
