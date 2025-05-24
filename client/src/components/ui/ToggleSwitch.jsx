import React, { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'

function ToggleSwitch({size = 5, value, onChange}) {

  const [enabled, setEnabled] = useState(false)

  const handleChange = (value) =>{
    setEnabled(!Boolean(value));
    onChange(value);
  }

  useEffect(() => {
    setEnabled(Boolean(value))
  },[value])

  return (

    <Switch
      as="div"
      checked={enabled}
      onChange={handleChange}
      style={{
        width: `calc(var(--spacing) * ${size * 1.8})`,
        height: `calc(var(--spacing) * ${size})`
      }}
      className="group relative flex cursor-pointer rounded-full 
      !bg-black/20 p-1 ease-in-out focus:not-data-focus:outline-none 
      data-checked:!bg-primary-300 data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        style={{
          width: `calc(var(--spacing) * ${size - 2})`,
          height: `calc(var(--spacing) * ${size - 2})`,
          transform: enabled ? `translateX(calc(var(--spacing) * ${size * 0.8}))` : 'translateX(0)'
        }}
        className="pointer-events-none inline-block translate-x-0 rounded-full 
        bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
  )
}

export default ToggleSwitch