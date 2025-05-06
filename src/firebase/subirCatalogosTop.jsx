import { getUnixTime } from 'date-fns';
import { db } from './firebaseConfig';
import { doc, setDoc, deleteDoc  } from "firebase/firestore";

const subirCatalogosTop = async (catalogo) => {

    await deleteDoc(doc(db, 'catalogo', 'catalogo_top'));

    await setDoc(doc(db, 'catalogo', 'catalogo_top'), {
        fecha_modificacion: getUnixTime(new Date()),
        catalogo: catalogo
      });
}

export default subirCatalogosTop;