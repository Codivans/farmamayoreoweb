import { getUnixTime } from 'date-fns';
import { db } from './firebaseConfig';
import { doc, setDoc, deleteDoc  } from "firebase/firestore";

const subirCatalogoProductos = async (catalogo) => {

    await deleteDoc(doc(db, 'shops', 'electrolit'));

    await setDoc(doc(db, 'shops', 'electrolit'), {
        fecha_modificacion: getUnixTime(new Date()),
        catalogo: catalogo
      });
}

export default subirCatalogoProductos;