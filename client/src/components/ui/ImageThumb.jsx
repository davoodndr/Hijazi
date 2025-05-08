import React from 'react'
import { MdOutlineAddAPhoto } from "react-icons/md";

const ImageThumb = React.memo(({thumbClass = '', imgClass = '', src, Actions = () => {}, onClick = ()=> {}}) => {
  return (
    <div 
      onClick={onClick}
      className={thumbClass}>
      <div className={imgClass}>
        {src ? 
          <img src={src} className='object-contain' alt="" />
          :
          <div 
            className='cursor-pointer w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
            <MdOutlineAddAPhoto size={30} />
          </div>
        }
      </div>
      <Actions />
    </div>
  )
})

export default ImageThumb