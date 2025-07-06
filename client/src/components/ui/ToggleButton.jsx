import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

function ToggleButtonComponent({text, onClick}) {

  const [active, setActive] = useState(false);

  useEffect(() => {
    onClick(active)
  },[active])

  return (
    <div
      onClick={() => {
        setActive(!active)
      }}
      className={clsx(`w-fit text-sm px-3 py-0.5 rounded-full capitalize smooth cursor-pointer`,
        active ? 'bg-green-200 text-primary-400' : 'bg-gray-200 text-gray-400'
      )}
      
    >{text}</div>
  )
}

const ToggleButton = React.memo(ToggleButtonComponent);

export default ToggleButton