import { useState, useEffect } from 'react'
import { auth, db } from './../firebase/firebaseConfig';
import { Header_principal } from '../components/Header_principal'
import { Menu_perfil } from '../components/Menu_perfil'
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import formatoMoneda from '../functions/formatoMoneda';

export const Pedidos_clientes = () => {
    const [pedidos, setPedidos] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
            const consultarDocumentos = () => {
                const user = auth.currentUser;
                if (!user) return;

                const consultarUser = query(
                    collection(db, 'pedidos'),
                    where('usuario', '==', user.uid),
                    // orderBy("fecha", "desc")
                );

            const unsuscribe = onSnapshot(
                consultarUser,
                (querySnapshot) => {
                    setPedidos(querySnapshot.docs.map((documento) => {
                        return { ...documento.data()}
                    }))
                }
            );
            return unsuscribe
            }
            consultarDocumentos();
    }, [])

    const imagenDefault = (e) =>{
      e.target.src =  'https://farmacias2web.com/imagenes/predeterminada.jpg' 
    }

    function formatUnixTimestamp(timestamp) {
        const date = new Date(timestamp * 1000); // Convertir de segundos a milisegundos

        // Obtener día, mes y año
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const year = date.getFullYear();

        // Obtener horas y minutos
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Formatear horas para AM/PM
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convertir formato de 24 horas a 12 horas

        // Formatear la fecha en el formato deseado
        return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }

  return (
    <>
        <Header_principal />

        <div className='container_perfil'>
            <Menu_perfil />
            <div className='container_pedidos_cliente'>
                {
                    pedidos.map((ped, i) => (
                    <div className='item_pedido_client' key={i}>     
                        <div>
                            <div className='title_order'>
                                <h3>Orden Id: {ped.uidPedido}</h3>
                                <p>{formatUnixTimestamp(ped.fecha)}</p>
                            </div>
                            <div className='footer_order_pleca'>
                                <p>Estatus: {ped.estatus}</p>
                                <p>Importe: {ped.importePedido}</p>
                                <p>Forma de pago: {ped.formaPago}</p>
                                <p>Modo entrega: {ped.tipoEntrega}</p>
                                {
                                    activeOrder === i 
                                    ? (<button className='btn_controller_order' onClick={() => setActiveOrder(null)}>Cerrar</button>)
                                    : (<button className='btn_controller_order' onClick={() => setActiveOrder(i)}>Ver detalle</button>)
                                }
                                
                            </div>
                        </div>

                        <div className={`container_products_order ${activeOrder === i ? 'active_container_products_order' : ''}`}>
                            {
                                ped.pedido?.map((p , i) => (
                                    <div className='row_mis_pedidos' key={p.codigo}>
                                        <img className='img_row' loading="lazy" onError={imagenDefault} src={`https://farmacias2web.com/imagenes/${p.codigo}.jpg`}/>
                                        <div className='detalle_row'>
                                            <p className='code_row'>{p.codigo}</p>
                                            <p className='name_row'>{p.nombre}</p>
                                            <p className='price_row'>Precio: {formatoMoneda(p.precio)}</p>
                                            <p className='cantidad_row'>Cantidad: {p.pedido}</p>
                                            <p className='importe_row'>Importe: {formatoMoneda(p.importe)}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            
                        </div>
                    </div>
                    ))
                }

                

            </div>

        </div>
    </>
  )
}
