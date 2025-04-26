import React, { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

function ContextMenu({items, isToggeled, iconRef, onClose}) {

  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isToggeled && iconRef?.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isToggeled, iconRef]);

  if (!isToggeled) return null;


  return createPortal(
    <ul
      onMouseLeave={onClose}
      style={{top: position.top+'px', right: position.right+'px'}}
      className='min-w-40 bg-white absolute border border-gray-200 
      shadow-lg rounded-2xl divide-y overflow-hidden'>

      {items && items.map(item => 
        <li 
          key={item.label} 
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`flex items-center gap-2 px-4 py-3
         border-gray-200 hover:bg-primary-25 cursor-pointer transition-all duration-300
          ${item.label === 'delete' ? 'hover:text-red-400 hover:bg-red-100/50':''}`}>

          {<item.icon className={`text-xl `} />}
          <span className={`capitalize`}>{item.label}</span>

        </li>
      )}
    </ul>,
    document.getElementById('portal')
  )
}

export default ContextMenu