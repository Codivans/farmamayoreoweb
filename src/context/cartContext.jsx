import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import toast, { Toaster } from 'react-hot-toast';


const ContextoCarrito = React.createContext();

const CarritoProvider = ({children}) =>{
    const [productosCarrito, setProductosCarrito] = useState([]);
    const [click, setClick] = useState(false);
    const [productDeliting, setProductDeliting] = useState('')
    
  useEffect(() => {
    let data = localStorage.getItem('CarritoCedifa');
    // setProductosCarrito(JSON.parse(data));
    if(data != null){
      setProductosCarrito(JSON.parse(data));
    }else{
      setProductosCarrito([]);
    }
  },[click])

    //Agregar producto al carrito
    const addProductoCart = ({codigo, nombre, pedido, precio, cantidad}) => {      
        if(!productosCarrito.find(product => product.codigo === codigo)){
            setProductosCarrito([...productosCarrito, {codigo: codigo, nombre: nombre, pedido: pedido, precio, importe: precio * pedido}]);
            localStorage.setItem('CarritoCedifa', JSON.stringify([...productosCarrito, {codigo: codigo, nombre: nombre, pedido: pedido, precio, importe: precio * pedido}]))
            setClick(!click)
            // toast.success('Se agrego productos al carrito');
        }else{
            setProductosCarrito(productosCarrito.map(p => (p.codigo === codigo ? {...p, pedido: parseInt(p.pedido) + parseInt(pedido), importe : p.precio * (p.pedido + pedido) } : p)))
            // toast.success(`Se agrego ${pedido} ${pedido > 1 ? 'piezas' : 'pieza'} más`);
        }
    }

    const removeProductCart = ({codigo, disminuir, agregados}) => {
        if(productosCarrito.find(product => product.codigo === codigo && disminuir == 1)){
            setProductosCarrito(productosCarrito.map(p => (p.codigo === codigo ? {...p, pedido: p.pedido - 1, importe: p.precio * (p.pedido - 1)} : p)))
            // toast.success('Se quito 1 pieza');
        }
        if(productosCarrito.find(product => product.codigo === codigo && disminuir == 1 && agregados == 1)){
          let newProductItem = productosCarrito.filter( x => x.codigo != codigo);
          setProductosCarrito(newProductItem);
          // toast.success('Se elimino el producto del carrito');

        }
    }

    const deleteProductoCart = (codigo) => {
        setProductDeliting(codigo)
        setTimeout(() => {
            let newCarrito = productosCarrito.filter( x => x.codigo != codigo);
            setProductosCarrito(newCarrito);
            setProductDeliting('');
            // toast.success('Se elimino el producto del carrito');
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
