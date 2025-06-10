import React from 'react';
// Importar Componentes
import { Header_principal } from './../components/Header_principal';
import { Banner_principal } from './../components/Banner_principal';
import { Carousel_products_top } from './../components/Carousel_products_top';
import { Portada_shop_grid } from './../components/Portada_shop_grid';
import { Carousel_store } from './../components/Carousel_store';
import useShopNames from '../hooks/useShopNames';


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
        <Carousel_products_top />

        {
          shopNames.map((item) => (
            <Portada_shop_grid nameShop={item}/>
          ))
        }    

        <Carousel_store />
    </>
  )
}


