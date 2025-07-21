import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const createPedido = async (dataLayout) => {

    await setDoc(doc(db, "pedidos" , `${dataLayout[0].uidPedido}`), {
        uidPedido: dataLayout[0].uidPedido,
        usuario: dataLayout[0].usuario,
        emailUser: dataLayout[0].emailUser,
        tipoEntrega: dataLayout[0].tipoEntrega,
        pickupEntrega: dataLayout[0].pickupEntrega,
        direccion: dataLayout[0].direccion,
        formaPago: dataLayout[0].formaPago,
        importePedido: dataLayout[0].importePedido,
        costoEnvio: dataLayout[0].costoEnvio,
        pedido: dataLayout[0].pedido,
        estatus: dataLayout[0].estatus,
        fecha: dataLayout[0].uidPedido     
    });
}

export default createPedido;