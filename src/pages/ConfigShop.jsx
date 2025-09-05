import { useState } from 'react';
import * as XLSX from 'xlsx';
import subirCatalogosTop from '../firebase/subirCatalogosTop';
import subirCatalogoProductos from '../firebase/subirCatalogoProductos';
import { Header_admin } from '../components/Header_admin';

import { CiImageOn } from "react-icons/ci";




export const ConfigShop = () => {

    const [catalogo, setCatalogo] = useState([]);
    const [bannerFront, setBannerFront] = useState(null);
    const [imgBannerFront, setImgBannerFront] = useState(null);
    const [bannerBack, setBannerBack] = useState(null);
    const [imgBannerBack, setImgBannerBack] = useState(null);
    const [bannerCarrusel, setBannerCarrusel] = useState(null);
    const [imgBannerCarrusel, setimgBannerCarrusel] = useState(null);

    const readExcel = (file) =>{
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (e) => {
                const buffeArray = e.target.result;
                const wb = XLSX.read(buffeArray, {type: 'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data=XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error)
                toast.error(error);
            };
        });

        promise.then((d) => {
            setCatalogo(d);
            // toast.success('Se cargo el catalogo correctamente!');
        });
    };

    const handleClick = async() => {
        try {
            await subirCatalogosTop(catalogo);
            setCatalogo([]);
            alert('Se cargo correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickProducts = async() => {
        try {
            await subirCatalogoProductos(catalogo);
            setCatalogo([]);
            alert('Se cargo correctamente')
        } catch (error) {
            console.log(error)
        }
    }

      // 🔹 Manejar cambios de archivos
    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (tipo === "banner_front") setBannerFront(file);
        if (tipo === "banner_front") setImgBannerFront(URL.createObjectURL(file));

        if (tipo === "banner_back") setBannerBack(file);
        if (tipo === "banner_back") setImgBannerBack(URL.createObjectURL(file));

        if (tipo === "banner_carrusel") setBannerCarrusel(file);
        if (tipo === "banner_carrusel") setimgBannerCarrusel(URL.createObjectURL(file));
        
    };

  return (
    <div className="container_pedidos_admin">
        <Header_admin />

        <div className='panel_config'>
            <div className='content_load_data'>
                <div className='div_step'>
                    <p>
                        <span className='circle_step'>1</span> Carga el banner principal que va en el home
                    </p>
                    <label onChange={(e) => handleFileChange(e, "banner_front")} className='btn-file'>
                        <div className='content_input_file'>
                            <CiImageOn />
                            <span> Cargar banner aqui</span>
                            <input 
                                hidden 
                                accept=".jpg" 
                                multiple 
                                type="file"
                            />
                        </div>
                    </label>
                </div>

                <div className='div_step'>
                    <p>
                        <span className='circle_step'>2</span> Cargar banners internos para Shop
                    </p>
                    <label onChange={(e) => handleFileChange(e, "banner_back")}  className='btn-file'>
                        <div className='content_input_file'>
                            <CiImageOn />
                            <span> Cargar banner</span>
                            <input 
                                hidden 
                                accept=".jpg, .png, .webp" 
                                multiple 
                                type="file"
                            />
                        </div>
                    </label>
                </div>

                <div className='div_step'>
                    <p>
                        <span className='circle_step'>3</span> Cargar banners internos para Shop
                    </p>
                    <label onChange={(e) => handleFileChange(e, "banner_carrusel")}  className='btn-file'>
                        <div className='content_input_file'>
                            <CiImageOn />
                            <span> Cargar banner</span>
                            <input 
                                hidden 
                                accept=".jpg" 
                                multiple 
                                type="file"
                            />
                        </div>
                    </label>

                </div>

                <div className='div_step'>
                    <p>
                        <span className='circle_step'>4</span> Cargar de Productos
                    </p>

                    <label onChange={(e) => {const file = e.target.files[0]; readExcel(file);}} className='btn-file'>
                        <div className='content_input_file'>
                            {/* <SiMicrosoftexcel /> <br/> */}
                            <span>Da click y sube tu archivo llenado aqui</span>
                            <input hidden accept=".xlsx" multiple type="file" />
                        </div>
                    </label>

                    <button onClick={handleClick}>Subir Catalogo Top</button>

                    <button onClick={handleClickProducts}>Subir Productos Shop</button>
                </div>
            </div>

            <div className='view_data'>
                <div className='view_step'>
                    <p>
                        <span className='circle_step'>1</span> Vista de banner Front (Home)
                    </p>
                    <div className='content_data_view'>
                        {
                            imgBannerFront && 
                            (<img src={imgBannerFront}/>)
                        }
                    </div>
                </div>

                <div className='view_step'>
                    <p>
                        <span className='circle_step'>4</span> Cargar de Productos
                    </p>
                    <div className='content_data_view'>
                        {
                            imgBannerBack &&
                            (<img src={imgBannerBack}/>)
                        }
                    </div>
                </div>

                <div className='view_step'>
                    <p>
                        <span className='circle_step'>4</span> Cargar de Productos
                    </p>
                    <div>
                        {
                            imgBannerCarrusel &&
                            (<img src={imgBannerCarrusel}/>)
                        }
                    </div>
                </div>
                

            </div>
           

        </div>


        
    </div>
  )
}
