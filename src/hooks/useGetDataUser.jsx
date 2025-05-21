import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { auth, db } from "./../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const useGetDataUser = ({showFormAddress}) => {
  const { estatus, setEstatus } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Listener para detectar cambios en la autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si hay un usuario logueado, obtén su uid
        const uid = user.uid;

        try {
          // Buscar el documento del usuario en Firestore usando el uid
          const userDoc = await getDoc(doc(db, "usuarios", uid));

          if (userDoc.exists()) {
            // Si el documento existe, guarda los datos en userData
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Si no hay un usuario logueado, resetea userData
        setUserData(null);
      }
    });
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [showFormAddress, estatus]);
  return userData;
};

export default useGetDataUser;