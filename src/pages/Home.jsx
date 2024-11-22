import React from 'react';
// Importar Componentes
import { Header_principal } from './../components/Header_principal';
import { Banner_principal } from './../components/Banner_principal';
import { Grid_Ofertas } from './../components/Grid_Ofertas';
import { Carousel_products_top } from './../components/Carousel_products_top';
import { Carousel_category } from './../components/Carousel_category';
import { Carousel_store } from './../components/Carousel_store';


export function Home() {
  
  return (
    <>
      {/* ==============   header   ==============*/}
        <Header_principal />
      {/* ==============   banner   ==============*/}
        <Banner_principal />
      {/* ==============   Grid Offer   ==============*/}
        <Grid_Ofertas />
      {/* ==============   Grid Offer   ==============*/}
        <Carousel_products_top />
        <Carousel_category />
        <Carousel_store />
    </>
  )
}


