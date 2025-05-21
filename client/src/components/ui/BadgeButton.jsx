import React from 'react'
import { IoIosClose } from 'react-icons/io';

function BadgeButtonComponent({text}) {
  return (
    <div className='text-xs border border-gray-300 ps-3 pe-1.5 py-1.5 rounded-2xl
        inline-flex items-center group cursor-pointer smooth hover:border-gray-400
        capitalize gap-2'
      >
      <span className='inline-flex'>{text}</span>
      <div className='bg-gray-200 rounded-full smooth hover:bg-red-400 hover:text-white'>
        <IoIosClose className='text-sm' />
      </div>
    </div>
  )
}

const BadgeButton = React.memo(BadgeButtonComponent);

export default BadgeButton