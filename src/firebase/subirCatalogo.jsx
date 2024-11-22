import { getUnixTime } from 'date-fns';
import { db } from './firebaseConfig';
import { doc, setDoc, deleteDoc  } from "firebase/firestore";

const subirCatalogo = async (catalogo) => {

    await deleteDoc(doc(db, 'catalogo', 'farmaMayoreo'));

    await setDoc(doc(db, 'catalogo', 'farmaMayoreo'), {
        fecha_modificacion: getUnixTime(new Date()),
        catalogo: catalogo
      });
}

export default subirCatalogo;