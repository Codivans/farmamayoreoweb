import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <nav>
      <ul className="pagination">
        <li>
          <button
            className='btn_arrow'
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              className={number === currentPage ? 'active' : ''}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            className='btn_arrow'
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
