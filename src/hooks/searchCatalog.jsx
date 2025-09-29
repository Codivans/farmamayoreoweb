// searchCatalog.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const searchCatalog = async ({modulo, searchTerm}) => {
  
  try {
    const catalogRef = doc(db, 'catalogo', 'farmaMayoreo');
    const catalogSnap = await getDoc(catalogRef);
    
    if (catalogSnap.exists()) {
      const data = catalogSnap.data();
      const { catalogo } = data;

      // Convertir el término de búsqueda a minúsculas
      const searchTermLower = searchTerm.toLowerCase();
      

      // Buscar según el módulo
      let results = [];
      if (modulo === 'search_input') {
        // Filtrar por código, nombre o sustancia
        results = catalogo.filter(item => 
          item.codigo.toString().includes(searchTermLower) ||
          item.nombre.toLowerCase().includes(searchTermLower) ||
          (item.sustancia && item.sustancia.toLowerCase().includes(searchTermLower))
        );
      } else if (modulo === 'familia'|| modulo === 'departamento') {
        // Filtrar por familia o departamento
        results = catalogo.filter(item => 
          item.familia.toLowerCase().includes(searchTermLower) ||
          item.departamento.toLowerCase().includes(searchTermLower)
        );
      } else if (modulo === 'laboratorio') {
        // Filtrar por laboratorio
        results = catalogo.filter(item => 
          item.laboratorio && item.laboratorio.toLowerCase().includes(searchTermLower)
        );
      }

      return results;
    } else {
      console.log("No se encontró el documento");
      return [];
    }
  } catch (error) {
    console.error("Error al buscar en el catálogo:", error);
    return [];
  }
};

export default searchCatalog;