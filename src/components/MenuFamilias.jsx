import { useState, useContext, useRef, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";


import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

export const MenuFamilias = () => {
    const [menu, setMenu] = useState([]);
    const db = getFirestore(); // Asegúrate que Firebase ya esté inicializado
    
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [hoveredCategoria, setHoveredCategoria] = useState(null);
    const menuRef = useRef();

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
  
            // Usamos un Map para agrupar departamentos por familia
            const familiaMap = new Map();
  
            catalogo.forEach(({ familia, departamento }) => {
              if (!familiaMap.has(familia)) {
                familiaMap.set(familia, new Set());
              }
              familiaMap.get(familia).add(departamento);
            });
  
            // Convertimos el Map a un array de objetos
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

    // Cierra el menú si se hace clic fuera
useEffect(() => {
  const handleClick = (e) => {
    const clickedInsideMenu = menuRef.current && menuRef.current.contains(e.target);
    const shouldClose = e.target.closest('[data-cerrar="true"]');

    if (!clickedInsideMenu || shouldClose) {
      setMenuAbierto(false); // ya no necesita delay
    }
  };

  document.addEventListener('click', handleClick); // <-- cambia a 'click' aquí
  return () => document.removeEventListener('click', handleClick);
}, []);


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
            <h2>Categorías</h2>
            <ul className="menu-list">
              {menu.map((cat) => (
                <li key={cat.familia} onClick={() => setActiveCategoria(cat)}>
                  {cat.familia}
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
                  <Link to={`/search/familia/${sub}`} onClick={() => setIsOpen(false)}>
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>

  )
}
