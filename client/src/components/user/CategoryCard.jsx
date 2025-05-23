import React from 'react'

const CategoryCard = React.memo(({image, categoryName = ''}) => {
  return (
    <div className="w-[166px] relative bg-white rounded-3xl 
      border border-gray-300 overflow-hidden cursor-pointer
      smooth hover:shadow-md/20 hover:border-primary-300">
      <figure className="m-2 rounded-2xl flex overflow-hidden">
        <img src={image} loading='lazy' alt="" />
      </figure>
      <h5 className='my-3 text-center'>{categoryName}</h5>
    </div>
  )
});

export default CategoryCard