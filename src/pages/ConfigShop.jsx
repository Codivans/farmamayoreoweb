import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Header_admin } from '../components/Header_admin';
import { CiImageOn } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";

// Firebase
import { db, storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export const ConfigShop = () => {
  const [catalogo, setCatalogo] = useState([]);

  const [logotipoLab, setLogotipoLab] = useState(null);
  const [imgLogotipo, setImgLogotipo] = useState(null);

  const [bannerFront, setBannerFront] = useState(null);
  const [imgBannerFront, setImgBannerFront] = useState(null);

  const [bannerBackFiles, setBannerBackFiles] = useState([]);   // 👈 múltiples archivos
  const [imgBannerBacks, setImgBannerBacks] = useState([]);     // 👈 múltiples previews

  const [bannerCarrusel, setBannerCarrusel] = useState(null);
  const [imgBannerCarrusel, setimgBannerCarrusel] = useState(null);
  const [storeName, setStoreName] = useState("");

  // 🔹 Leer Excel
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
          fileReader.onerror = (error) => reject(error);
      });

      promise.then((d) => setCatalogo(d));
  };

  // 🔹 Cambios en los inputs de imágenes
  const handleFileChange = (e, tipo) => {
      const files = e.target.files;
      if (!files.length) return;

      if (tipo === "logotipo_img") {
        setLogotipoLab(files[0]);
        setImgLogotipo(URL.createObjectURL(files[0]));
      }

      if (tipo === "banner_front") {
        setBannerFront(files[0]);
        setImgBannerFront(URL.createObjectURL(files[0]));
      }

      if (tipo === "banner_back") {
        const fileArray = Array.from(files);

        // acumulamos lo que ya existía + lo nuevo
        setBannerBackFiles((prev) => [...prev, ...fileArray]);
        setImgBannerBacks((prev) => [...prev, ...fileArray.map(file => URL.createObjectURL(file))]);
      }


      if (tipo === "banner_carrusel") {
        setBannerCarrusel(files[0]);
        setimgBannerCarrusel(URL.createObjectURL(files[0]));
      }
  };

  // 🔹 Subir imagen a Storage y devolver URL
  const uploadImageAndGetURL = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // 🔹 Guardar tienda
  const handleSave = async () => {
    try {
      const storeId = Date.now().toString(); // unixtime como ID
      const folderPath = `stores/${storeId}`;

      let images = {};

      if (bannerFront) {
        images.bannerFront = await uploadImageAndGetURL(bannerFront, `${folderPath}/bannerFront_${bannerFront.name}`);
      }

      if (bannerBackFiles.length > 0) {
        images.bannerBack = [];
        for (let file of bannerBackFiles) {
          const url = await uploadImageAndGetURL(file, `${folderPath}/bannerBack/${Date.now()}_${file.name}`);
          images.bannerBack.push(url); // 👈 guardamos array de URLs
        }
      }

      if (bannerCarrusel) {
        images.bannerCarrusel = await uploadImageAndGetURL(bannerCarrusel, `${folderPath}/bannerCarrusel_${bannerCarrusel.name}`);
      }

      // 🔹 Guardar en Firestore
      await setDoc(doc(db, "shops", storeId), {
        id: storeId,
        name: storeName || "Sin nombre",
        images,
        catalogo
      });

      alert("✅ Tienda guardada correctamente");
      setCatalogo([]);
      setBannerFront(null);
      setBannerBackFiles([]);
      setBannerCarrusel(null);
      setImgBannerFront(null);
      setImgBannerBacks([]);
      setimgBannerCarrusel(null);
      setStoreName("");

    } catch (error) {
      console.error("Error al guardar tienda:", error);
      alert("❌ Error al guardar tienda");
    }
  };

  console.log(imgLogotipo, logotipoLab, bannerBackFiles)

  return (
    <div className="container_pedidos_admin">
      <Header_admin />

      <div className='panel_config'>
        <div className='content_load_data'>
          <div className='div_step input_name'>
              <label>Nombre de tienda</label>
              <input 
                placeholder='Ejemplo: Kimberly'
                value={storeName}
                onChange={(e)=>setStoreName(e.target.value)}
              />
          </div>

          {/* 🔹 Logotipo */}
          <div className='div_step'>
            <p><span className='circle_step'>1</span> Carga logotipo</p>
            <div className='content_flex_icons'>
                <label className='btn-file'>
                    <div className='content_input_file'>
                        <CiImageOn />
                        <span> Click para cargar Imagen</span>
                        <input 
                            hidden 
                            accept=".jpg,.png,.webp" 
                            type="file"
                            onChange={(e) => handleFileChange(e, "logotipo_img")}
                        />
                    </div>
                </label>
                { imgBannerFront && <FaCheckCircle /> }
            </div>
          </div>


          {/* 🔹 Paso 1 */}
          <div className='div_step'>
            <p><span className='circle_step'>1</span> Carga el banner principal</p>
            <div className='content_flex_icons'>
                <label className='btn-file'>
                    <div className='content_input_file'>
                        <CiImageOn />
                        <span> Click para cargar Imagen</span>
                        <input 
                            hidden 
                            accept=".jpg,.png,.webp" 
                            type="file"
                            onChange={(e) => handleFileChange(e, "banner_front")}
                        />
                    </div>
                </label>
                { imgBannerFront && <FaCheckCircle /> }
            </div>
          </div>

          {/* 🔹 Paso 2 - MULTIPLES */}
          <div className='div_step'>
            <p><span className='circle_step'>2</span> Cargar banners internos (múltiples)</p>
            <div className='content_flex_icons'>
                <label className='btn-file'>
                    <div className='content_input_file'>
                        <CiImageOn />
                        <span> Cargar varios banners</span>
                        <input 
                            hidden 
                            accept=".jpg,.png,.webp" 
                            type="file"
                            multiple   // 👈 ahora múltiples
                            onChange={(e) => handleFileChange(e, "banner_back")}
                        />
                    </div>
                </label>
                { imgBannerBacks.length > 0 && <FaCheckCircle /> }
            </div>
          </div>

          {/* 🔹 Paso 3 */}
          <div className='div_step'>
            <p><span className='circle_step'>3</span> Cargar banner carrusel</p>
            <div className='content_flex_icons'>
                <label className='btn-file'>
                    <div className='content_input_file'>
                        <CiImageOn />
                        <span> Cargar banner</span>
                        <input 
                            hidden 
                            accept=".jpg,.png,.webp" 
                            type="file"
                            onChange={(e) => handleFileChange(e, "banner_carrusel")}
                        />
                    </div>
                </label>
                { imgBannerCarrusel && <FaCheckCircle /> }
            </div>
          </div>

          {/* 🔹 Paso 4 */}
          <div className='div_step'>
              <p><span className='circle_step'>4</span> Cargar catálogo</p>
              <label className='btn-file'>
                  <div className='content_input_file'>
                      <span>Da click y sube tu archivo llenado aqui</span>
                      <input 
                        hidden 
                        accept=".xlsx" 
                        type="file"
                        onChange={(e) => {const file = e.target.files[0]; readExcel(file);}}
                      />
                  </div>
              </label>
          </div>

          <div>
            <button className='btn_save' onClick={handleSave}>Guardar</button>
          </div>
        </div>
        <div className='content_data_view'>    
            
            <div className='preview_images'>
              <p>1- Logotipo</p>
              <img src={imgLogotipo} alt={`bannerBack`} width={300} className="m-2"/>
            </div>

            <div className='preview_images'>
              <p>1- Banner portada</p>
              <img src={imgBannerFront} alt={`bannerBack`} width={700} className="m-2"/>
            </div>

            {/* Previews de todas */}
            <div className='preview_images cat_banners'>
              <p>3.- banners</p>
              {imgBannerBacks.map((src, i) => (
                <img key={i} src={src} alt={`bannerBack ${i}`} width={700} className="m-2"/>
              ))}
            </div>

            <div className='preview_images'>
              <p>1- Portada Carrusel</p>
              <img src={imgBannerCarrusel} alt={`bannerBack`} width={450} className="m-2"/>
            </div>

            <div className='preview_images'>
              <p>1- Portada Carrusel</p>
              <img src={imgBannerCarrusel} alt={`bannerBack`} width={450} className="m-2"/>
            </div>


        </div>
      </div>
    </div>
  )
}
