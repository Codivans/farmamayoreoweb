import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export const MenuFamilias = () => {
    const [menu, setMenu] = useState([]);
    const db = getFirestore(); // Asegúrate que Firebase ya esté inicializado

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


  return (
    <nav id='nav_header'>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <Link to={`/search/familia/${item.familia}`}>{item.familia}</Link>
            <ul>
                {
                    item.departamentos.map((item) =>(
                        <li>
                            <Link to={`/search/familia/${item}`}>{item}</Link>
                        </li>
                    ))
                }
                
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
