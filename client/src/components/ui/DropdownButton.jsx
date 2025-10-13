import React from 'react'
import { Menu, MenuButton } from '@headlessui/react'
import { IoIosArrowDown } from 'react-icons/io'
import ContextMenu from './ContextMenu'
import { AnimatePresence, motion } from 'motion/react';

function DropdownButtonComponent({
  icon, label, onClick, style, className = '', labelClass = '', items
}){
  return (
    <Menu as={motion.div} layout className='h-full'>
      {({open}) => (

        <>
          
          <MenuButton as={motion.div}
            layout
            onClick={onClick}
            style={style}
            className={`inline-flex h-full items-center ps-2 pe-3 py-1 cursor-pointer 
              relative ${className}`}
          >
            {icon}
            <span className={`capitalize ${labelClass}`}>{label}</span>
            <div className='inline-flex items-center h-full'>
              <span className='h-[60%] w-px mx-2 bg-gray-500/30'></span>
              <IoIosArrowDown />
            </div>

          </MenuButton>
          
          <ContextMenu 
            open={open}
            items={items}
          />
        </>
      )}

    </Menu>
  )
}

const DropdownButton = React.memo(DropdownButtonComponent)

export default DropdownButton