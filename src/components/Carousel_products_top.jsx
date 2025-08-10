import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import productos from './../data/products_carrousel';
import { count, doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig"; // Ajusta según tu ruta


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Card_product } from './Card_product';

export const Carousel_products_top = () => {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerCatalogoTopCompleto = async () => {
          try {
            const refTop = doc(db, "catalogo", "catalogo_top");
            const refCompleto = doc(db, "catalogo", "farmaMayoreo");
    
            const [topSnap, completoSnap] = await Promise.all([
              getDoc(refTop),
              getDoc(refCompleto),
            ]);
    
            if (topSnap.exists() && completoSnap.exists()) {
              const topArray = topSnap.data().catalogo;
              const completoArray = completoSnap.data().catalogo;
    
              const mapaCompleto = new Map(
                completoArray.map((prod) => [prod.codigo, prod])
              );
    
              const resultado = topArray
                .map((itemTop) => mapaCompleto.get(itemTop.codigo))
                .filter((item) => item !== undefined);
    
              setProductos(resultado);
            } else {
              throw new Error("Uno o ambos documentos no existen");
            }
          } catch (err) {
            console.error("Error obteniendo catálogo top:", err);
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        obtenerCatalogoTopCompleto();
      }, []);



    // Define el estado para almacenar el tamaño de la ventana
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Define una función que se ejecuta cuando se redimensiona la ventana
    const handleResize = () => {
        setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
        });
    };

    useEffect(() => {
        // Agrega un event listener para manejar el cambio de tamaño de la ventana
        window.addEventListener('resize', handleResize);

        // Limpia el event listener al desmontar el componente
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    let widthContainer = windowSize.width * 1

    let totalCardsWidth = 235;
    if(widthContainer <= 480 ){
      totalCardsWidth = (widthContainer / 2)-10
    }
    let margenCard = 10;
    
    if(widthContainer <= 440){
      margenCard = ((widthContainer/2) - ((widthContainer / 2)-10))/2
    }


  

  return (
    <div className='container_products_top container_swiper_responsive'>
        <h4 className='title_carrusel'>Productos Top</h4>
        <Swiper
            slidesPerView={Math.floor(widthContainer / totalCardsWidth)}
            spaceBetween={margenCard}
            freeMode={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            modules={[Autoplay, FreeMode, Navigation]}
            className="mySwiper swiper_top"
        >
        {
            productos.map((item) => <SwiperSlide  key={item.codigo} className='content_swiper_top' style={{width : totalCardsWidth}}>
                                        <Card_product  item={item}/>
                                    </SwiperSlide>)
        }
        </Swiper>

    </div>
  )
}
