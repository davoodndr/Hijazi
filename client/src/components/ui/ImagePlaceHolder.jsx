import React from 'react'
import { IoImageOutline } from 'react-icons/io5'

function ImagePlaceHolder({size, className}) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <IoImageOutline size={size} />
    </div>
  )
}

export default ImagePlaceHolder