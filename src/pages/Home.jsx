import React from 'react';
// Importar Componentes
import { Header_principal } from './../components/Header_principal';
import { Banner_principal } from './../components/Banner_principal';
import { Carousel_products_top } from './../components/Carousel_products_top';
import { Portada_shop_grid } from './../components/Portada_shop_grid';
import { Carrusel_store } from './../components/Carrusel_store';
import useShopNames from '../hooks/useShopNames';
import { Menu_Bottom } from '../components/Menu_Bottom';
import LogoSlider from '../components/LogoSlider';
import { MdVerified } from "react-icons/md";
import { Footer } from '../components/Footer';


export function Home() {

  const { shopNames, loading } = useShopNames();

  console.log(shopNames)

    // transformamos shopNames -> props para LogoSlider
  const logos = shopNames.map((shop) => ({
    id: shop.id,
    name: shop.name,
    src: shop.images.logotipo, // usamos la URL del logotipo
    url: `/shop/${shop.name}/shopid/${shop.id}`, // o la ruta que uses en tu app
  }));
  
  return (
    <>
      {/* ==============   header   ==============*/}
        <Header_principal />
      {/* ==============   banner   ==============*/}
        <Banner_principal />
        <div className='container_slider_shops'>
          <h4>Tiendas oficiales <MdVerified /> </h4>
          <LogoSlider logos={logos}/>  
        </div>  
      {
        shopNames.map((shop, index) => (
          <React.Fragment key={shop.id}>
            {/* Siempre mostrar tienda */}
            <Portada_shop_grid nameShop={shop.name} img={shop.images?.bannerFront} shopId={shop.id}/>

            {/* Insertar elementos fijos en posiciones específicas */}
            {index === 0 &&  <Carousel_products_top />}
            {index === 1 && <Carrusel_store departamento='GENERICOS'/>}
          </React.Fragment>
        ))
      }
      <Footer />
      <Menu_Bottom />
    </>
  )
}


