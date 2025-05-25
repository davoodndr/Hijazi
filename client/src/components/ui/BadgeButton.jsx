import React from 'react'
import { IoIosClose } from 'react-icons/io';
import { motion } from 'motion/react'
import { xRowVariants } from '../../utils/Anim';

function BadgeButtonComponent({text, onClick, showClear = false, onClear}) {
  return (
    <motion.div
      layout="position"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={xRowVariants}
      className='inline-flex'
    >
      <div
        onClick={onClick}
        className={`text-xs border bg-white border-gray-300 ps-3 ${showClear ? 'pe-1.5' : 'pe-3'} 
          py-1.5 rounded-2xl inline-flex items-center group cursor-pointer 
          smooth hover:border-gray-400 capitalize gap-2`}
        >
        <span className='inline-flex'>{text}</span>
        {showClear && <div
          onClick={onClear}
          className='bg-gray-200 rounded-full smooth hover:bg-red-400 hover:text-white'>
          <IoIosClose className='text-sm' />
        </div>}
      </div>
    </motion.div>
  )
}

const BadgeButton = React.memo(BadgeButtonComponent);

export default BadgeButton