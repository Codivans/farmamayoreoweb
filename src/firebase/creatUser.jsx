import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const createUser = async ({uidUser, email, nombre, apellidos, telefono, urlDocument }) => {

    console.log(uidUser, email, nombre, apellidos, telefono)

    await setDoc(doc(db, "usuarios" , `${uidUser}`), {
        uidUser: uidUser,
        email: email,
        nombre: nombre.toUpperCase(),
        apellidos: apellidos.toUpperCase(),
        telefono: telefono,
        urlDocument: urlDocument,
        status: 'inactivo',
        roll: 'Cliente'
    });
}

export default createUser;