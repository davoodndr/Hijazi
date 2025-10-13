import clsx from 'clsx'
import React from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

function HeaderSortIconComponent({
  currentSort,
  field,
  color
}) {
  return (
    <>
      <IoIosArrowUp className={clsx(
        currentSort?.field === field && !currentSort?.ascending && 'text-red-500'
      )} />
      <IoIosArrowDown className={clsx(
        currentSort?.field === field && currentSort?.ascending && 'text-red-500'
      )} />
    </>
  )
}

const HeaderSortIcon = React.memo(HeaderSortIconComponent)

export default HeaderSortIcon