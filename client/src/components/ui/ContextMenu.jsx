
import { MenuItem, MenuItems } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react'

function ContextMenu({items, open, itemHeight = 10}) {

  return (
    <AnimatePresence>
      {open && 
      
        <MenuItems as={motion.div}
          static
          anchor="bottom end"
          initial={{ opacity: 0, scale: 0.90 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.90 }}
          className={`min-w-40 border border-gray-100 outline-0 bg-white shadow-lg rounded-2xl 
          divide-y overflow-hidden origin-top`}
        >
          {items && items.map(item => 
            <MenuItem key={item.label}>
              <li 
                onClick={() => {
                  item.onClick();
                }}
                className={`flex items-center gap-2 cursor-pointer transition-all duration-300
                  border-gray-200 hover:bg-primary-25 
                  ${item.label === 'delete' ? 'bg-red-100/50 hover:text-red-400 hover:bg-red-200/50':''}`}
                style={{
                  padding: `${itemHeight}px 12px`
                }}
              >
                {<item.icon className={`text-xl `} />}
                <span className={`capitalize`}>{item.label}</span>
              </li>
            </MenuItem>
          )}
        </MenuItems>
      }
    </AnimatePresence>
  );

  
}

export default ContextMenu