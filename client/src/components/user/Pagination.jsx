import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

function Pagination({totalPages, currentPage, setCurrentPage, className}) {
  return (
    <div className={className}>
      <div className="flex justify-center gap-2">
        <div
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`cursor-pointer w-10 h-10 inline-flex items-center rounded-xl justify-center
              shadow-md border border-gray-200 smooth hover:border-primary-300 hover:text-primary-400`}
        >
          <IoIosArrowBack className='text-xl' />
        </div>

        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`cursor-pointer w-10 h-10 inline-flex items-center rounded-xl justify-center
              shadow-md border border-gray-200 smooth relative overflow-hidden hover:border-primary-300 hover:text-primary-400
              ${currentPage === i + 1 ?
                `border-primary-400/50` : ''
              }`}
            >
            
            <span>{i + 1}</span>
          </div>
        ))}

        <div
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`cursor-pointer w-10 h-10 inline-flex items-center rounded-xl justify-center
              shadow-md border border-gray-200 smooth hover:border-primary-300 hover:text-primary-400`}
        >
          <IoIosArrowForward className='text-xl' />
        </div>
      </div>
    </div>
  )
}

export default Pagination