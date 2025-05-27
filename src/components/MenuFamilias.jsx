import { useState, useContext, useRef, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

export const MenuFamilias = () => {
    const [menu, setMenu] = useState([]);
    const db = getFirestore(); // Asegúrate que Firebase ya esté inicializado
    
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [hoveredCategoria, setHoveredCategoria] = useState(null);
    const menuRef = useRef();

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
    <div className="mega-menu-container" ref={menuRef}>
        <button
            className="categoria-button"
            onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <BiCategoryAlt />
            Categorías
            {/* <MdOutlineKeyboardArrowDown /> */}
        </button>

        {menuAbierto && (
            <div className="menu-dropdown">
            <ul className="menu-categorias">
                {menu.map((categoria) => (
                <li
                     key={categoria.familia}
                    className="menu-item"
                    data-cerrar="true"
                    onMouseEnter={() => setHoveredCategoria(categoria)}
                >
                    {categoria.familia}
                </li>
                ))}
            </ul>

            {hoveredCategoria && (
                <ul className="menu-subcategorias">
                {hoveredCategoria.departamentos?.map((sub) => (
                    <li key={sub} className="submenu-item">
                    <Link to={`/search/familia/${sub}`} data-cerrar="true" >{sub}</Link>
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
    </div>
  )
}
