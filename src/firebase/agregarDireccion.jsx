import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Asegúrate de importar la configuración de Firebase

const agregarDireccion = async ({userId, newAddress}) => {
     console.log('User: ',userId, '',newAddress)
  try {
    const userRef = doc(db, 'usuarios', `${userId}`);

    await updateDoc(userRef, {
      direcciones: arrayUnion(newAddress)
    });
    console.log('Dirección agregada correctamente');
  } catch (error) {
    console.error('Error al agregar la dirección: ', error);
  }

};
export default agregarDireccion;