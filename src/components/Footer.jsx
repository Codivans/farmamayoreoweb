import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import logo from './../assets/farmamayoreo.svg';
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoInstagram } from "react-icons/io5";
import { IoLogoTiktok } from "react-icons/io5";
import fondo from "./../assets/imagenfooter.jpg"

export const Footer = () => {
      const [menu, setMenu] = useState([]);
      const db = getFirestore();

      useEffect(() => {
        const fetchCatalogo = async () => {
          try {
            const docRef = doc(db, 'catalogo', 'farmaMayoreo');
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              const data = docSnap.data();
              const catalogo = data.catalogo || [];
    
              const familiaMap = new Map();
    
              catalogo.forEach(({ familia, departamento }) => {
                if (!familiaMap.has(familia)) {
                  familiaMap.set(familia, new Set());
                }
                familiaMap.get(familia).add(departamento);
              });
    
              const menuFinal = Array.from(familiaMap.entries()).map(([familia, departamentosSet]) => ({
                familia,
                departamentos: Array.from(departamentosSet),
              }));
    
              setMenu(menuFinal);
            } else {
              console.log('No se encontró el documento');
            }
          } catch (error) {
            console.error('Error obteniendo catálogo:', error);
          }
        };
        fetchCatalogo();
      }, [db]);


  return (
    <footer>
        {/* <div
            className='newsletter'   
            style={{
                backgroundImage: `url(${fondo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "200px"
            }}
        >
            <div className='content_newsletter'>
                <h3>Recibe nuestro catálogo</h3>
                <div>
                    <input type='email'/>
                    <button>Enviar</button>
                </div>
            </div>

        </div> */}
       <div className='content_cols_footer'>
            <div className='cols_footer'>
                <img src={logo} className='logo_footer'/>
                <p>Av. Pantitlán 617, La Perla, 57820 Cdad. Nezahualcóyotl, Méx.</p>
            </div>
            <div className='cols_footer'>
                <h4>Navegación</h4>
                <ul className='nav_familias'>
                    {
                        menu.map((item, index) => {
                            return(
                                <li key={index}>
                                    <Link to={`/search/familia/${item.familia}`}>{item.familia}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='cols_footer'>
                <h4>Avisos y politicas</h4>
                <ul>
                    <li>
                        <Link to="/">Aviso de privasidad</Link>
                    </li>
                    <li>
                        <Link to="/">Terminos y condiciones</Link>
                    </li>
                    <li>
                        <Link to="/">Politica de devoluciones</Link>
                    </li>
                </ul>
            </div>
            <div className='cols_footer'>
                <h4>Contactanos</h4>
                <ul>
                    <li><Link to="https://www.facebook.com/p/FarmaMayoreo-Neza-100083206968508/"  target="_blank"><IoLogoFacebook /> farmamayoreo</Link></li>
                    <li><Link to="/"  target="_blank"><IoLogoInstagram /> farmamayoreo</Link></li>
                    <li><Link to="/"  target="_blank"><IoLogoTiktok /> farmamayoreo</Link></li>
                </ul>
            </div>
       </div>
    </footer>
  )
}
