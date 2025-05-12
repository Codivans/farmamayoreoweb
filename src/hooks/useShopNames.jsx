import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const useShopNames = () => {
    const [shopNames, setShopNames] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchShops = async () => {
        try {
          const snapshot = await getDocs(collection(db, '/shops'));
          const names = snapshot.docs.map(doc => doc.id);
          setShopNames(names);
        } catch (error) {
          console.error('Error fetching shop names:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchShops();
    }, []);
  
    return { shopNames, loading };
  };
  
  export default useShopNames;
