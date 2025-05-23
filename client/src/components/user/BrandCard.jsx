import React from 'react'

function BrandCardComponent({image}) {
  return (
    <div className='w-[190px] pb-6 grayscale-100 opacity-60 
      smooth hover:opacity-100 hover:grayscale-0 cursor-pointer'>
      <img src={image} loading='lazy' alt="" />
    </div>
  )
}

const BrandCard = React.memo(BrandCardComponent);

export default BrandCard