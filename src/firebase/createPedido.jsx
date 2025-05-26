import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getUnixTime } from 'date-fns';

const createPedido = async (dataLayout) => {

    await setDoc(doc(db, "pedidos" , `${dataLayout[0].uidPedido}`), {
        uidPedido: dataLayout[0].uidPedido,
        usuario: dataLayout[0].usuario,
        emailUser: dataLayout[0].emailUser,
        direccion: dataLayout[0].direccion,
        formaPago: dataLayout[0].formaPago,
        costoEnvio: dataLayout[0].costoEnvio,
        pedido: dataLayout[0].pedido,
        fechaPedido: getUnixTime(new Date())        
    });
}

export default createPedido;