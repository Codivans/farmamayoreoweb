import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import productos from './../data/products_carrousel';
import imgPleca from './../assets/pleca.jpg';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Card_product } from './Card_product';
import { Link } from 'react-router-dom';

export const Carousel_category = () => {

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
    
        let widthContainer = windowSize.width * .80
        let widthCardAuto = (widthContainer / 5) - 10
        let countCards = Math.floor(widthContainer / widthCardAuto)
        let grapZiseCards = widthCardAuto * countCards
        let margenCard = (widthContainer - grapZiseCards) / (countCards - 1)


  return (
    <div className='container_products_category'>
        <Link className='img_category' to='/shop'>
            <img src={imgPleca} />
        </Link>
        <div className='container_carousel_category'>
            <Swiper
                slidesPerView={Math.floor(widthContainer / 220)}
                spaceBetween={margenCard}
                freeMode={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, FreeMode, Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    productos.map((item) => <SwiperSlide style={{ width: `${widthCardAuto}px !important` }} key={item.CODIGO}>
                                                <Card_product widthCard={widthCardAuto} item={item} />
                                            </SwiperSlide>)
                }
            </Swiper>
        </div>
    </div>
  )
}
