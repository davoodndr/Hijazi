import React from 'react'

function ColorButton({
  color,
  onChange,
  checked,
  selected
}) {
  return (
    <div 
      className='relative inline-flex h-fit w-fit'
    >
      <input 
        type="checkbox"
        checked={checked}
        onChange={onChange} 
        id={color} 
        hidden
      />

      {/* selection ring */}
      {selected &&
        <span
          style={{ '--dynamic': color }}
          className='smooth rounded-full absolute -inset-1.25 border-2 border-(--dynamic)'
        >
        </span>
      }
      
      <label
        htmlFor={color}
        style={{ '--dynamic': color }}
        className={`cursor-pointer smooth point-before point-before:p-2.5!
          point-before:m-0! point-before:bg-(--dynamic)!`}
      >
      </label>
    </div>
  )
}

export default ColorButton