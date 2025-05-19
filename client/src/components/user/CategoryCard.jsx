import React from 'react'

function CategoryCard({image, categoryName = ''}) {
  return (
    <div class="w-[166px] relative bg-white rounded-3xl border border-gray-300 overflow-hidden">
      <figure class="m-2 rounded-2xl flex overflow-hidden">
        <img src={image} alt="" />
      </figure>
      <h5 className='my-3 text-center'>{categoryName}</h5>
    </div>
  )
}

export default CategoryCard