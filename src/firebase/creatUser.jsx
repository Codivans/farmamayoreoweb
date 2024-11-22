import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const createUser = async ({uidUser, email, nombre, apellidos, telefono }) => {

    console.log(uidUser, email, nombre, apellidos, telefono)

    await setDoc(doc(db, "usuarios" , `${uidUser}`), {
        uidUser: uidUser,
        email: email,
        nombre: nombre.toUpperCase(),
        apellidos: apellidos.toUpperCase(),
        telefono: telefono,
        roll: 'Cliente'
    });
}

export default createUser;