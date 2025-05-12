import React, { useState, useEffect } from 'react';
import { Header_principal } from '../components/Header_principal';
import { Carusel_shops } from '../components/Carusel_shops';
// import productos from './../data/products_carrousel';
import { Card_product } from '../components/Card_product';
import banner_shop_nivea from '../assets/banner_shop_nivea.png'
import banner_shop_electrolit from '../assets/banner_shop_electrolit.png'
import { Carrusel_store_shop } from '../components/Carrusel_store_shop';

import { useCatalogoCruce } from "./../hooks/useCatalogoCruce";
import { useParams } from 'react-router-dom';

const banners = {
    nivea: banner_shop_nivea,
    electrolit: banner_shop_electrolit,
};


export const Shop = () => {
    const { nameShop } = useParams();

    const { productos, loading, error } = useCatalogoCruce(nameShop);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    let widthCardAuto = 250
    
    const bannerSrc = banners[nameShop];

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

  return (
    <>
         {/* ==============   header   ==============*/}
            <Header_principal />
            <div className='banner_shop'>
                <img src={bannerSrc} />
            </div>
            <Carusel_shops productos={productos} />

            <Carrusel_store_shop productos={productos} nameShop={nameShop} />

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
