import React from 'react'

function BrandCardComponent({image}) {
  return (
    <div className='w-[190px] grayscale-100 opacity-60 
      smooth hover:opacity-100 hover:grayscale-0 cursor-pointer
      border border-gray-300 rounded-2xl'>
      <img src={image} loading='lazy' alt="" />
    </div>
  )
}

const BrandCard = React.memo(BrandCardComponent);

export default BrandCard