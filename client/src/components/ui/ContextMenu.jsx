
import { MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useState } from 'react';

function ContextMenuComponent({items, open, itemHeight = 10}) {

  return (
    <AnimatePresence>
      {open && 
      
        <MenuItems as={motion.div}
          portal
          static
          anchor="bottom end"
          initial={{ opacity: 0, scale: 0.90 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.90 }}
          className={`min-w-40 border border-gray-200 outline-0 bg-white shadow-lg rounded-2xl 
          divide-y overflow-hidden origin-top z-100`}
        >
          {items && items.map(item => 
            
            <MenuItem key={item?.id}>
              {item?.custom ? 
                (item?.custom)
                :
                (<div
                  htmlFor={item?.htmlFor ?? ''} 
                  onClick={() => item.onClick()}
                  className={`flex items-center gap-2 cursor-pointer smooth
                    border-gray-200 hover:bg-primary-25 justify-between text-sm ${item?.itemClass || ''}`}
                  style={{
                    padding: `${itemHeight}px 12px`
                  }}
                >
                  <div className='inline-flex items-center gap-2'>
                    {item?.icon}
                    {item?.text}
                  </div>
                  {item?.tail}
                </div>)
              }
            </MenuItem>
            
          )}
        </MenuItems>
      }
    </AnimatePresence>
  );

  
}

const ContextMenu = React.memo(ContextMenuComponent);

export default ContextMenu