import clsx from 'clsx'
import React from 'react'

function SortHeaderComponent({
  title = '',
  onClick,
  sortIcon
}) {
  return (
    <div
      onClick={onClick}
      className='flex items-center space-x-1 cursor-pointer'
    >
      <span>{title}</span>
      <div className='inline-flex flex-col -space-y-1'>
        {sortIcon}
      </div>

    </div>
  )
}

const SortHeader = React.memo(SortHeaderComponent)

export default SortHeader