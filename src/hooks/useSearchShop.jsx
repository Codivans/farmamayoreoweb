import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const useSearchShop = (shopId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const referencia = doc(db, "shops", shopId);
        const querySnapshot = await getDoc(referencia);
        // const querySnapshot = await getDocs(collection(db, "shops", shopId));
        const shops = querySnapshot.data()
        setData(shops);
      } catch (error) {
        console.error("Error al obtener shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [loading]);

  return { data };
};
