import React, { forwardRef } from 'react'

const DropdownDivComponent = forwardRef(({
  className,
  style,
  children
}, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      className={`hidden-div absolute ${className || ''}`}
    >
      {children}
    </div>
  )
})

const DropdownDiv = React.memo(DropdownDivComponent)

export default DropdownDiv