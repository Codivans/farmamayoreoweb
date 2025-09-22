import React from 'react';
// Importar Componentes
import { Header_principal } from './../components/Header_principal';
import { Banner_principal } from './../components/Banner_principal';
import { Carousel_products_top } from './../components/Carousel_products_top';
import { Portada_shop_grid } from './../components/Portada_shop_grid';
import { Carrusel_store } from './../components/Carrusel_store';
import useShopNames from '../hooks/useShopNames';
import { Menu_Bottom } from '../components/Menu_Bottom';


export function Home() {

  const { shopNames, loading } = useShopNames();

  console.log(shopNames)
  
  return (
    <>
      {/* ==============   header   ==============*/}
        <Header_principal />
      {/* ==============   banner   ==============*/}
        <Banner_principal />
      {/* ==============   Grid Offer   ==============*/}
       

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

        
        <Menu_Bottom />
    </>
  )
}


