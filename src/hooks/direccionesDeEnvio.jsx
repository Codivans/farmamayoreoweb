
import { collection, onSnapshot, query, where  } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';

const direccionesDeEnvio = (uidUser) => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const consultarDocumentos = () => {
            const consultarUser = query(
                collection(db, 'usuarios'),
                where('uidUser', '==', uidUser )
            );
           const unsuscribe = onSnapshot(
               consultarUser,(querySnapshot) => {
                   setUser(querySnapshot.docs.map((documento) => {
                       return { ...documento.data()}
                   }))
               }
           );
           return unsuscribe
        }
        consultarDocumentos();
   }, [uidUser])
   return user;    
}

export default direccionesDeEnvio;