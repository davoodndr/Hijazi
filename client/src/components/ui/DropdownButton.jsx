import { Menu, MenuButton } from '@headlessui/react'
import { IoIosArrowDown } from 'react-icons/io'
import ContextMenu from './ContextMenu'

function DropdownButton({icon, label, onClick, className, items}) {
  return (
    <Menu as="div" className='h-full'>
      {({open}) => (

        <>
          <MenuButton as="div"
            onClick={onClick}
            className={`inline-flex h-full items-center !ps-2 !pe-3 py-1 cursor-pointer 
              relative ${className}`}
          >
            {icon}
            <span className='capitalize'>{label}</span>
            <span className='h-[60%] w-px mx-2 bg-gray-500/30'></span>
            <IoIosArrowDown />

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

export default DropdownButton