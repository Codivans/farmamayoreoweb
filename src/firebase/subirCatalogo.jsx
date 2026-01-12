import { getUnixTime } from 'date-fns';
import { db } from './firebaseConfig';
import { doc, setDoc } from "firebase/firestore";

const subirCatalogo = async (catalogo) => {
  await setDoc(
    doc(db, 'catalogo', 'farmaMayoreo'),
    {
      fecha_modificacion: getUnixTime(new Date()),
      catalogo
    }
  );
};

export default subirCatalogo;
