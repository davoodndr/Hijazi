import React from 'react'
import { generateRandomColor } from '../../utils/Utils'

function BadgeComponent({color, title, className = '', titleClass = ''}) {
  return (
    <div className={`absolute left-2 top-1 ${className}`}>
      <span 
        style={{
          backgroundColor: color || generateRandomColor()
        }}
        className={`text-[11px] text-white 
      rounded-xl px-1.5 py-0.25 inline-flex leading-normal ${titleClass}`}>{title}</span>
    </div>
  )
}

const ProductCardBadge = React.memo(BadgeComponent)

export default ProductCardBadge