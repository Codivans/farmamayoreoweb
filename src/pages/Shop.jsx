import React, { useState, useEffect, useRef } from 'react';
import { Header_principal } from '../components/Header_principal';
import { Carusel_shops } from '../components/Carusel_shops';
// import productos from './../data/products_carrousel';
import { Card_product } from '../components/Card_product';
import { BannerBackSlider } from "./../components/BannerBackSlider";
import { Carrusel_store_shop } from '../components/Carrusel_store_shop';

import { useCatalogoCruce } from "./../hooks/useCatalogoCruce";
import { useSearchShop } from "./../hooks/useSearchShop";
import { useParams } from 'react-router-dom';




export const Shop = () => {
    const { nameShop, shopid } = useParams();
    const { productos, loading, error } = useCatalogoCruce(shopid);
    const { data } = useSearchShop(shopid);    

    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    let widthCardAuto = 250

    const images = data?.images?.bannerBack || []

      // Agrupar por marca
    const agrupadoPorMarca = productos.reduce((acc, prod) => {
        const marca = prod.marca || "Sin marca";
        const grupo = acc.find((g) => g.marca === marca);

        if (grupo) {
        grupo.products.push(prod);
        } else {
        acc.push({ marca, products: [prod] });
        }

        return acc;
    }, []);

    // Marcar la primera marca como seleccionada por defecto
    const marcas = agrupadoPorMarca.map((grupo) => grupo.marca);
    const marcaActiva = marcaSeleccionada || marcas[0];
    const productosFiltrados = agrupadoPorMarca.find((g) => g.marca === marcaActiva)?.products || [];

    const productosTop = productos.filter((item) => item.productosTop === "true");
    const productosCarrusel = productos.filter((item) => item.productosCarrusel === "true");



  return (
    <>
         {/* ==============   header   ==============*/}
            <Header_principal />
            <div className='banner_shop'>
                <BannerBackSlider images={images} />
            </div>
            <Carusel_shops productos={productosTop} />

            <Carrusel_store_shop productos={productosCarrusel} img={data?.images?.bannerCarrusel}/>

            <div className='content_fiters_shop'>
                <div className='menu_shop'>
                    <ul>
                        {
                            agrupadoPorMarca.map((item) => (
                                <li key={item.marca}><button onClick={() => setMarcaSeleccionada(item.marca)} >{item.marca}</button></li>        
                            ))
                        }
                    </ul>
                </div>
                <div className='item_shop'>
                    {
                        productosFiltrados.map((item, index) => (
                            <Card_product widthCard={widthCardAuto} item={item} key={index}/>
                        ))
                    }
                </div>
            </div>
    </>
  )
}
