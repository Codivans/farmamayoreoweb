import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Header_principal } from '../components/Header_principal'
import subirCatalogo from '../firebase/subirCatalogo';

export const AltaCatalogo = () => {

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
            await subirCatalogo (catalogo);
            setCatalogo([]);
            alert('Se cargo correctamente')
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <>
        <Header_principal />
        <div>
            <label onChange={(e) => {const file = e.target.files[0]; readExcel(file);}} className='btn-file'>
                <div>
                    {/* <SiMicrosoftexcel /> <br/> */}
                    <span>Da click y sube tu archivo llenado aqui</span>
                    <input hidden accept=".xlsx" multiple type="file" />
                </div>
            </label>

            <button onClick={handleClick}>Subir</button>

            <table>
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Existencia</th>
                        <th>Precio</th>
                        <th>Oferta</th>
                        <th>Familia</th>
                        <th>Departamento</th>
                        <th>Sustancia</th>
                        <th>Laboratorio</th>
                        <th>Grupo</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        catalogo.map((product) => {
                            return(
                                <tr key={product.codigo}>
                                    <td>{product.codigo}</td>
                                    <td>{product.nombre}</td>
                                    <td>{product.existencia}</td>
                                    <td>{product.precio}</td>
                                    <td>{product.oferta}</td>
                                    <td>{product.familia}</td>
                                    <td>{product.departamento}</td>
                                    <td>{product.sustancia}</td>
                                    <td>{product.laboratorio}</td>
                                    <td>{product.grupo}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </div>
    </>
  )
}
