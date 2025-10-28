import React from 'react'
import { HiHome } from 'react-icons/hi2'
import { IoIosArrowForward } from 'react-icons/io'

function BreadcrumpsComponent({listType}) {
  return (
    <div className='flex items-center gap-2 mb-5 py-2 border-y border-theme-divider'>
      <HiHome size={20} />
      <IoIosArrowForward size={13} />
      <div className='inline-flex items-center text-sm gap-2 capitalize'>
        <span>{listType}</span>
      </div>
    </div>
  )
}

export default BreadcrumpsComponent