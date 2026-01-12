import { useState } from 'react';
import * as XLSX from 'xlsx';
import subirCatalogo from '../firebase/subirCatalogo';
import { Header_admin } from '../components/Header_admin';
import { SiMicrosoftexcel } from 'react-icons/si';

export const AltaCatalogo = () => {

    const [catalogo, setCatalogo] = useState([]);

    const normalizarProducto = (producto) => {
        const codigoLimpio = producto.codigo
            ? Number(String(producto.codigo).replace(/\D/g, ""))
            : null;

        return {
            ...producto,
            codigo: isNaN(codigoLimpio) ? null : codigoLimpio
        };
    };



    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: 'buffer' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws);

            // 👇 NORMALIZAMOS AQUÍ
            const dataNormalizada = data
                .map(normalizarProducto)
                .filter(p => p.codigo !== null);

            resolve(dataNormalizada);
            };

            fileReader.onerror = (error) => {
            reject(error);
            toast.error(error);
            };
        });

        promise.then((d) => {
            setCatalogo(d);
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
        <Header_admin />
            <div className='content_master'>
            {
                catalogo.length > 0 ? (
                    <div>
                        <div className='header_table_catalogo'>
                            <span>Total de renglones: {catalogo?.length}</span>
                            <button onClick={handleClick}>Subir</button>
                        </div>
                        

                        <table className='table_catalogo'>
                            <thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th>Existencia</th>
                                    <th>Precio</th>
                                    <th>Departamento</th>
                                    <th>Substancia</th>
                                    <th>Oferta</th>
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
                                                <td>{product.departamento}</td>
                                                <td>{product.substancia}</td>
                                                <td>{product.oferta}</td>                                                
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <label onChange={(e) => {const file = e.target.files[0]; readExcel(file);}} className='btn-file'>
                        <div>
                            <SiMicrosoftexcel /> <br/>
                            <span>Cargar Catálogo</span>
                            <input hidden accept=".xlsx" multiple type="file" />
                        </div>
                    </label>

                )
            }
        </div>
    </>
  )
}
