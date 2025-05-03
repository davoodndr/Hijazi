import React from 'react'

function AdminPagination({totalPages, currentPage, setCurrentPage, className}) {
  return (
    <div className={className}>
      <div className="flex justify-end gap-2">
        <div
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="cursor-pointer px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </div>

        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`cursor-pointer px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </div>
        ))}

        <div
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="cursor-pointer px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default AdminPagination