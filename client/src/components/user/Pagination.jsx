import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

function Pagination({totalPages, currentPage, setCurrentPage, className}) {
  return (
    <div className={className}>
      <div className="flex justify-center gap-2">
        <div
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='cursor-pointer w-10 h-10 inline-flex items-center justify-center rounded-xl shadow-sm
          smooth border border-primary-300 bg-primary-50 hover:bg-primary-300 hover:text-white'
        >
          <IoIosArrowBack className='text-xl' />
        </div>

        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`cursor-pointer w-10 h-10 inline-flex items-center rounded-xl justify-center
               shadow-sm border border-gray-50 smooth ${
              currentPage === i + 1
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-white hover:bg-primary-50 hover:border-primary-300'
            }`}
          >
            {i + 1}
          </div>
        ))}

        <div
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='cursor-pointer w-10 h-10 inline-flex items-center justify-center rounded-xl shadow-sm
          smooth border border-primary-300 bg-primary-50 hover:bg-primary-300 hover:text-white'
        >
          <IoIosArrowForward className='text-xl' />
        </div>
      </div>
    </div>
  )
}

export default Pagination