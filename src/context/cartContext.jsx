import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import { getUnixTime } from 'date-fns';
// import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';


const ContextoCarrito = React.createContext();

const CarritoProvider = ({children}) =>{
    const [productosCarrito, setProductosCarrito] = useState([]);
    const [fechaCreacion, setFechaCreacion] = useState(null);
    const [click, setClick] = useState(false);
    const [productDeliting, setProductDeliting] = useState('')
    
    useEffect(() => {
      let data = localStorage.getItem('CarritoCedifa');
      if(data){
        const parsed = JSON.parse(data);
        setProductosCarrito(parsed.productos || []);
        setFechaCreacion(parsed.fecha_creacion || null);
      }
    },[])
      // Cada vez que cambia el carrito, guardar en localStorage
    useEffect(() => {
      if(productosCarrito.length > 0){
        localStorage.setItem('CarritoCedifa', JSON.stringify({
          fecha_creacion: fechaCreacion ?? getUnixTime(new Date()), // si no existe, crearla
          productos: productosCarrito
        }));
        if(!fechaCreacion) setFechaCreacion(getUnixTime(new Date()));
      }else{
        localStorage.removeItem('CarritoCedifa');
        setFechaCreacion(null);
      }
    }, [productosCarrito]);



    //Agregar producto al carrito (versión corregida)
    const addProductoCart = ({ codigo, nombre, pedido, precio, existencia }) => {
      // Aseguramos que todo sea numérico
      pedido = parseInt(pedido) || 0;
      precio = parseFloat(precio) || 0;
      existencia = parseInt(existencia) || 0;

      if (existencia <= 0) {
        toast.error(`No hay existencia disponible de ${nombre}.`);
        return;
      }

      const productoExistente = productosCarrito.find(product => product.codigo === codigo);

      // Si no existe aún en el carrito
      if (!productoExistente) {
        if (pedido > existencia) {
          toast.error(`Solo hay ${existencia} piezas disponibles de ${nombre}.`);
          if (existencia > 0) {
            setProductosCarrito([
              ...productosCarrito,
              { codigo, nombre, pedido: existencia, precio, importe: precio * existencia, existencia }
            ]);
            toast.success(`Se agregaron ${existencia} piezas (máximo disponible).`);
          }
          return;
        }

        setProductosCarrito([
          ...productosCarrito,
          { codigo, nombre, pedido, precio, importe: precio * pedido, existencia }
        ]);
        toast.success(`Se agregó al carrito.`);
        return;
      }

      // Si ya existe en el carrito
      const pedidoActual = parseInt(productoExistente.pedido) || 0;
      const totalDeseado = pedidoActual + pedido;

      if (totalDeseado > existencia) {
        const disponibles = existencia - pedidoActual;

        if (disponibles > 0) {
          setProductosCarrito(productosCarrito.map(p =>
            p.codigo === codigo
              ? { ...p, pedido: existencia, importe: p.precio * existencia, existencia }
              : p
          ));
          toast.error(`Solo se agregaron ${disponibles} más (máximo ${existencia} disponibles).`);
        } else {
          toast.error(`No hay más piezas disponibles de ${nombre}.`);
        }
        return;
      }

      // Si hay suficiente existencia
      setProductosCarrito(productosCarrito.map(p =>
        p.codigo === codigo
          ? { ...p, pedido: totalDeseado, importe: p.precio * totalDeseado, existencia }
          : p
      ));
      toast.success(`Se agregaron ${pedido} ${pedido > 1 ? 'piezas' : 'pieza'} más.`);
    };




    const removeProductCart = ({codigo, disminuir, agregados}) => {
        if(productosCarrito.find(product => product.codigo === codigo && disminuir == 1)){
            setProductosCarrito(productosCarrito.map(p => (p.codigo === codigo ? {...p, pedido: p.pedido - 1, importe: p.precio * (p.pedido - 1)} : p)))
            toast.success('Se quito 1 pieza');
        }
        if(productosCarrito.find(product => product.codigo === codigo && disminuir == 1 && agregados == 1)){
          let newProductItem = productosCarrito.filter( x => x.codigo != codigo);
          setProductosCarrito(newProductItem);
          toast.success('Se elimino el producto del carrito');

        }
    }

    const deleteProductoCart = (codigo) => {
        setProductDeliting(codigo)
        setTimeout(() => {
            let newCarrito = productosCarrito.filter( x => x.codigo != codigo);
            setProductosCarrito(newCarrito);
            setProductDeliting('');
            toast.success('Se elimino el producto del carrito');
          }, 1000);
        
    }
    //Vaciar carrito
    const vaciarCarrito = () => {
        localStorage.removeItem('CarritoCedifa');
        setProductosCarrito([]);
        // toast.success('Se vacio el carrito');
    }

    let countCart = productosCarrito.reduce((a,b) => a + b.pedido, 0)
    let importeCart = productosCarrito.reduce((a,b) => a + b.importe, 0)


    return(
        <ContextoCarrito.Provider value={{
            productosCarrito, 
            addProductoCart, 
            removeProductCart, 
            deleteProductoCart, 
            vaciarCarrito, 
            countCart,
            importeCart,
            productDeliting
        }}>
            {children}
        </ContextoCarrito.Provider>
    )

}


export { ContextoCarrito, CarritoProvider };
