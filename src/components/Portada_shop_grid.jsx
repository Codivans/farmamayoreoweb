import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCatalogoCruce } from "./../hooks/useCatalogoCruce";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Autoplay, Navigation } from 'swiper/modules';
import { Card_product } from './Card_product';
import { Link } from 'react-router-dom';

export const Portada_shop_grid = ({nameShop, img, shopId}) => {
    const { productos, loading, error } = useCatalogoCruce(shopId);

    console.log(productos)

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

    let widthContainer = windowSize.width * .90
    let widthCardAuto = (widthContainer / 5) - 10

    let totalCardsWidth = 235;
    if(widthContainer <= 480 ){
        totalCardsWidth = (widthContainer / 2)-10
    }
    let margenCard = 10;
    
    if(widthContainer <= 440){
        margenCard = ((widthContainer/2) - ((widthContainer / 2)-10))/2
    }


  return (
    <div className='container_products_category container_swiper_responsive'>
        <Link className='img_category' to={`/shop/${nameShop}/shopid/${shopId}`}>
            <img src={img} />
        </Link>
        <div className='container_carousel_category'>
            <Swiper
                slidesPerView={Math.floor(widthContainer / totalCardsWidth)}
                spaceBetween={margenCard}
                freeMode={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: false,
                }}
                modules={[Autoplay, FreeMode, Navigation]}
                className="mySwiper carrusel_shop"
            >
                {
                    productos.map((item, index) => <SwiperSlide style={{ width: `${widthCardAuto}px !important` }} key={index} >
                                                <Card_product widthCard={widthCardAuto} item={item} index={index}/>
                                            </SwiperSlide>)
                }
            </Swiper>
        </div>
    </div>
  )
}
