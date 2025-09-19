import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import portada_nivea from './../assets/portada_nivea.jpg';
import portada_electrolit from './../assets/portada_electrolit.jpg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Card_product } from './Card_product';


export const Carrusel_store_shop = ({productos, img}) => {

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

   let widthContainerPrimary = windowSize.width * 1
    let widthContainer =  windowSize.width <= 490 ? windowSize.width : widthContainerPrimary - 390
    let widthCardAuto = (widthContainer / 5) - 10
    let countCards = Math.floor(widthContainer / widthCardAuto)

    let totalCardsWidth = 235;
    if(widthContainer <= 480 ){
      totalCardsWidth = (widthContainer / 2)-10
    }
    let margenCard = 10;
    
    if(widthContainer <= 440){
      margenCard = ((widthContainer/2) - ((widthContainer / 2)-10))/2
    }
    
  return (
    <div className='container_products_column container_swiper_responsive'>
        <div className='img_portada'>
            <img src={img} />
        </div>
        
        <div className='container_carousel_column'>
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
                className="mySwiper"
                style={{marginTop: '20px !important'}}
            >
                {
                    productos.map((item) => <SwiperSlide style={{width : totalCardsWidth}}  key={item.CODIGO}>
                                                <Card_product item={item}/>
                                            </SwiperSlide>)
                }
            </Swiper>
        </div>
    </div>
  )
}
