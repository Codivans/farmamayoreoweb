import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import productos from './../data/products_carrousel';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig"; // Ajusta según tu ruta


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Card_product } from './Card_product';

export const Carusel_shops = ({productos}) => {

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
    let widthCardAuto = (widthContainer / 6) - 10
    let countCards = Math.floor(widthContainer / widthCardAuto)
    let grapZiseCards = widthCardAuto * countCards
    let margenCard = (widthContainer - grapZiseCards) / (countCards - 1)

  return (
    <div className='container_products_top'>
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
            modules={[Autoplay, FreeMode, Navigation]}
            className="mySwiper"
        >
        {
            productos.map((item) => <SwiperSlide  key={item.codigo}>
                                        <Card_product widthCard={widthCardAuto} item={item} />
                                    </SwiperSlide>)
        }
        </Swiper>

    </div>
  )
}
