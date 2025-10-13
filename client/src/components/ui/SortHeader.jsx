import clsx from 'clsx'
import React from 'react'

function SortHeaderComponent({
  title = '',
  onClick,
  sortIcon,
  className,
  titleClass,
  iconClass
}) {

  return (
    <div
      onClick={onClick}
      className={className || ''}
    >
      <div className={titleClass || ''}>

        <span>{title}</span>

        <div className={iconClass || ''}>
          {sortIcon}
        </div>

      </div>

    </div>
  )
}

const SortHeader = React.memo(SortHeaderComponent)

export default SortHeader