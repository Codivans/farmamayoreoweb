import { useState, useEffect } from 'react'
import useShopNames from '../hooks/useShopNames';
import { useParams } from 'react-router-dom';
import { Header_principal } from '../components/Header_principal'
import { Card_product } from '../components/Card_product'
import Pagination from './../components/Pagination';
import searchCatalog from '../hooks/searchCatalog';
import ClipLoader from "react-spinners/ClipLoader";
import { Footer } from '../components/Footer';
import { SliderBannersShops } from '../components/SliderBannersShops';
import { FiFilter } from "react-icons/fi";

export const Search = () => {
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedDeps, setSelectedDeps] = useState([]); 
    const [selectedLabs, setSelectedLabs] = useState([]);
    const { modulo, searchTerm } = useParams();
    const [loading, setLoading] = useState(false);
    const [showFiltros, setShowFiltros] = useState(false);

    const { shopNames } = useShopNames();

        // transformamos shopNames -> props para LogoSlider
    const shops = shopNames.map((shop) => ({
        id: shop.id,
        name: shop.name,
        src: shop.images.bannerFront, // usamos la URL del logotipo
        url: `/shop/${shop.name}/shopid/${shop.id}`, // o la ruta que uses en tu app
    }));

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const searchResults = await searchCatalog({ modulo, searchTerm });
                setResults(searchResults);
                setFilteredResults(searchResults);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error al buscar el producto', error);
                setResults([]);
                setFilteredResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchTerm]);

    const productsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const widthCardAuto = 250;

    // 1️⃣ Filtrar por departamento primero
    const resultsByDep = selectedDeps.length > 0
        ? results.filter(item => selectedDeps.includes(item.departamento))
        : results;

    // 2️⃣ A partir de los departamentos seleccionados, sacar labs y grupos disponibles
    const deps = [...new Set(results?.map(x => x.departamento))].sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );

    const labs = [...new Set(resultsByDep.map(x => x.laboratorio))].sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );



    // 3️⃣ Filtrar por laboratorios y grupos seleccionados (dentro de resultsByDep)
    useEffect(() => {
        let filtered = resultsByDep;

        if (selectedLabs.length > 0) {
            filtered = filtered.filter(item => selectedLabs.includes(item.laboratorio));
        }
        setFilteredResults(filtered);
        setCurrentPage(1);
    }, [selectedDeps, selectedLabs, results]);

    // Paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredResults.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    // Manejar check/uncheck genérico
    const toggleSelection = (value, selectedArray, setSelectedArray) => {
        if (selectedArray.includes(value)) {
            setSelectedArray(selectedArray.filter(v => v !== value));
        } else {
            setSelectedArray([...selectedArray, value]);
        }
    };

    // Limpiar filtros
    const clearFilters = () => {
        setSelectedDeps([]);
        setSelectedLabs([]);
    };

    return (
        <>
            <Header_principal />
            <div className='container_result_search'>
                <div className={`filtro_responsive ${showFiltros ? 'active_filtros' : 'desactive_filtros'}`}>
                    <div className='filtro_research'>
                        <div className='cabeceras_filtros'>
                            <h4>Filtros <FiFilter /></h4>
                            <button onClick={clearFilters}>Limpiar filtros</button>
                        </div>

                        {/* 🔹 Filtro padre: Departamentos */}
                        <h5>Departamentos {`(${deps.length})`}</h5>
                        <div className='content_data_filters'>
                            <ul>
                                {deps.map((dep, index) => (
                                    <li key={index}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedDeps.includes(dep)}
                                                onChange={() => toggleSelection(dep, selectedDeps, setSelectedDeps)}
                                            />
                                            {dep}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 🔹 Filtro dependiente: Laboratorios */}
                        <h5>Laboratorios {`(${labs.length})`}</h5>
                        <div className='content_data_filters'>
                            <ul>
                                {labs.map((lab, index) => (
                                    <li key={index}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedLabs.includes(lab)}
                                                onChange={() => toggleSelection(lab, selectedLabs, setSelectedLabs)}
                                            />
                                            {lab}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {
                            showFiltros
                            ? (<button className='close_filtros' onClick={() => setShowFiltros(!showFiltros)}>Cerrar Filtros</button>)
                            : ''
                        }
                        
                    </div>
                </div>

                {/* Productos */}
                <div className='container_cards_results'>
                    <div className='barra_filtros'>
                        <button onClick={() => setShowFiltros(!showFiltros)}>Filtrar <FiFilter/> </button>
                    </div>
                    <SliderBannersShops shops={shops}/>

                    {loading ? (
                        <div className='container_searching_products'>
                            <div className='content_spinner'>
                                <ClipLoader
                                    color='#66e6f1'
                                    loading={loading}
                                    size={50}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                /> <br />
                                <span>Buscando...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='content_items_result'>
                                {
                                    selectedDeps.map((item, index) => {
                                        return(
                                            <div className='item_result'>{item}</div>
                                        );
                                    })
                                }
                                {
                                    selectedLabs.map((item, index) => {
                                        return(
                                            <div className='item_result'>{item}</div>
                                        );
                                    })
                                }
                            </div>
                            <div className='container_result_products'>
                                {currentProducts.map((item, i) => (
                                    <Card_product widthCardAuto={widthCardAuto} item={item} key={i} />
                                ))}
                            </div>
                        </>
                    )}

                    {currentProducts.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredResults.length / productsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
