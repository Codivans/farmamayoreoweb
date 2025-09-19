import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function useShopNames() {
  const [shopNames, setShopNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "shops"));
        const shops = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShopNames(shops);
      } catch (error) {
        console.error("Error al obtener shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return { shopNames, loading };
}

