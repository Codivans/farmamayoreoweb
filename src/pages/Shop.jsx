import React, { useState, useEffect } from 'react';
import { Header_principal } from '../components/Header_principal';
import { Carousel_products_top } from '../components/Carousel_products_top';
// import productos from './../data/products_carrousel';
import { Card_product } from '../components/Card_product';
import banner_shop from '../assets/banner_shop.webp'
import { Carousel_store } from '../components/Carousel_store';

import { useCatalogoCruce } from "./../hooks/useCatalogoCruce";



export const Shop = () => {
    const { productos, loading, error } = useCatalogoCruce("nivea");
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    let widthCardAuto = 250

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

    console.log("first", productosFiltrados )

  return (
    <>
         {/* ==============   header   ==============*/}
            <Header_principal />
            <div className='banner_shop'>
                <img src={banner_shop} />
            </div>
            <Carousel_products_top />

            <Carousel_store />

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
                        productosFiltrados.map((item) => (
                            <Card_product widthCard={widthCardAuto} item={item} />
                        ))
                    }
                </div>
            </div>
    </>
  )
}
