import React , { useState, useEffect, CSSProperties  }from 'react'
import { useParams } from 'react-router-dom';
import { Header_principal } from '../components/Header_principal'
import { Flag_Header } from '../components/Flag_Header'
import { Card_product } from '../components/Card_product'
import Pagination from './../components/Pagination';
import searchCatalog from '../hooks/searchCatalog';

import ClipLoader from "react-spinners/ClipLoader";

export const Search = () => {
    const [results, setResults] = useState([]);
    const { modulo, searchTerm } = useParams();
    const [loading, setLoading] = useState(false);
    console.log('Modulo: ', modulo, searchTerm)


 
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const searchResults = await searchCatalog({modulo,searchTerm});
                setResults(searchResults);
                setCurrentPage(1)  
            } catch (error) {
                console.error('Error al buscar el producto', error);
                setResults([]);
            }finally{
                setLoading(false)
            }
            
        };

        fetchResults();
    }, [searchTerm]);
    

    const productsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const widthCardAuto = 250;

      // Calcula el índice de los productos actuales
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = results.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambia la página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
    };

  return (
    <>
        <Header_principal />

        <div className='container_result_search'>
            <h4>Se encontraron <span>({results.length})</span> resultados con. <br /><span>"{searchTerm}"</span></h4>

            {
                loading ? (
                    <div className='container_searching_products'>
                        <div className='content_spinner'>
                            <ClipLoader
                                color='#66e6f1'
                                loading={loading}
                                // cssOverride={override}
                                size={50}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> <br  />
                            <span>Buscando...</span>
                        </div>
                    </div>

                ):(
                    <div className='container_result_products'>
                        {
                            currentProducts.map((item, i) => <Card_product widthCardAuto={widthCardAuto} item={item} key={i}/>) 
                        }
                    </div>
                )
            }

            {
                currentProducts.length > 0 ? (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(results.length / productsPerPage)}
                        onPageChange={handlePageChange}
                    />
                ) : ('')
            }

            
        </div>
    </>
  )
}
