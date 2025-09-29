import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";

export const MenuFamilias = () => {
  const [menu, setMenu] = useState([]);
  const db = getFirestore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoria, setActiveCategoria] = useState(null);

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
    <>
      <button className="menu-toggle-button" onClick={() => setIsOpen(true)}>
        <span className='btn_txt_categorias'><BiCategoryAlt /> Categorías</span>
        <span className='btn_txt_burger'><IoMenu /></span>
      </button>

      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        {!activeCategoria ? (
          <>
            <h2>Familias</h2>
            <ul className="menu-list">
              {menu.map((cat) => (
                <li key={cat.familia} className="familia-item">
                  {/* Click en el nombre = filtra */}
                  <Link
                    to={`/search/familia/${cat.familia}`}
                    onClick={() => setIsOpen(false)}
                    className="familia-link"
                  >
                    {cat.familia}
                  </Link>
                  {/* Ícono desplegable para mostrar departamentos */}
                  {cat.departamentos.length > 0 && (
                    <button
                      className="toggle-submenu"
                      onClick={() => setActiveCategoria(cat)}
                    >
                      <MdOutlineKeyboardArrowDown />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className='container_submenu'>
            <div className="submenu-header">
              <button onClick={() => setActiveCategoria(null)}>
                <MdOutlineKeyboardArrowLeft /> Regresar
              </button>
              <h2>{activeCategoria.familia}</h2>
            </div>
            <ul className="submenu-list">
              {activeCategoria.departamentos?.map((sub) => (
                <li key={sub}>
                  <Link to={`/search/departamento/${sub}`} onClick={() => setIsOpen(false)}>
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
