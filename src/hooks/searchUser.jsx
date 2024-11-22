import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

const searchUser = (email) => {
    const [user, setUser] = useState([]);
   
    useEffect(() => {
         const consultarDocumentos = () => {
             const consultarUser = query(
                 collection(db, 'usuarios'),
                 where('email', '==', email)
             );

            const unsuscribe = onSnapshot(
                consultarUser,
                (querySnapshot) => {
                    setUser(querySnapshot.docs.map((documento) => {
                        return { ...documento.data()}
                    }))
                }
            );
            return unsuscribe
         }
         consultarDocumentos();
    }, [email])
    return user;    
}

export default searchUser;