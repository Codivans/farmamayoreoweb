// searchCatalog.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const useGetProductosGi = async ({searchTerm}) => {
  
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
        // Filtrar por código, nombre o sustancia
        results = catalogo.filter(item => 
            item.departamento.toString().includes(searchTermLower)
        );
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

export default useGetProductosGi;