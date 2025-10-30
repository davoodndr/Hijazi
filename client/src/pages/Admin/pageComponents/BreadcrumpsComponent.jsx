import React from 'react'
import { HiHome } from 'react-icons/hi2'
import { IoIosArrowForward } from 'react-icons/io'

function BreadcrumpsComponent({
  listType,
  listTypeClass,
  view,
  viewClass
}) {
  return (
    <div className='flex items-center space-x-2 mb-5 py-2 border-y border-theme-divider'>
      <HiHome size={20} />
      <IoIosArrowForward size={13} />
      <span className={`capitalize ${listTypeClass}`}>{listType}</span>
      {view && (
        <>
          <IoIosArrowForward size={13} />
          <span className={`capitalize ${viewClass}`}>{view}</span>
        </>
      )}
    </div>
  )
}

export default BreadcrumpsComponent