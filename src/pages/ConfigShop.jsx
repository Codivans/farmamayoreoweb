import { useState } from 'react';
import * as XLSX from 'xlsx';
import subirCatalogosTop from '../firebase/subirCatalogosTop';
import subirCatalogoProductos from '../firebase/subirCatalogoProductos';




export const ConfigShop = () => {

    const [catalogo, setCatalogo] = useState([]);

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

  return (
    <div>
        <label onChange={(e) => {const file = e.target.files[0]; readExcel(file);}} className='btn-file'>
            <div>
                {/* <SiMicrosoftexcel /> <br/> */}
                <span>Da click y sube tu archivo llenado aqui</span>
                <input hidden accept=".xlsx" multiple type="file" />
            </div>
        </label>

        <button onClick={handleClick}>Subir Catalogo Top</button>

        <button onClick={handleClickProducts}>Subir Productos Shop</button>
    </div>
  )
}
