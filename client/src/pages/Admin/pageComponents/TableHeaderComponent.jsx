import React, { useEffect, useState } from 'react'
import { BsFillMenuButtonFill } from 'react-icons/bs';
import SortHeader from '../../../components/ui/SortHeader';
import HeaderSortIcon from '../../../components/ui/HeaderSortIcon';
import clsx from 'clsx';
import { sortData } from '../../../utils/Utils';

function TableHeaderComponent({
  data,
  filteredData,
  onSort,
}) {

  /* sort */
  const [currentSort, setCurrentSort] = useState(null)
  useEffect(() => {
    
    const sorted = sortData(currentSort, filteredData);
    onSort({ list: sorted, currentSort })

  },[filteredData, currentSort]);

  const handleChangeSort = (item)=> {
    if (currentSort?.field === item.field) {
      setCurrentSort({ ...item, ascending: !currentSort.ascending });
    }else{
      setCurrentSort({ ...item, ascending: true });
    }
  }

  return (
    <div className="text-gray-400 uppercase font-semibold tracking-wider
      border-b border-theme-divider px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
      <div className={`grid ${data?.gridCols} items-center w-full`}>
        <span><input type="checkbox" /></span>
        {data?.headers?.map((header, i) => {
          if(header?.sortOptions){
            return (
              header?.sortOptions?.map((item, index) => 
                <SortHeader
                  key={index}
                  onClick={() => handleChangeSort(item)}
                  title={item?.title}
                  sortIcon={
                    item?.field ? (
                      <HeaderSortIcon currentSort={currentSort} field={item?.field} />
                    ):
                    null
                  }
                  className={clsx('flex items-center space-x-1',
                    item?.field && 'cursor-pointer smooth hover:text-primary-300',
                    (data?.centerHeaders && data?.centerHeaders?.includes(i+index)) && 'justify-center'
                  )}
                  titleClass='relative'
                  iconClass='inline-flex flex-col -space-y-1 absolute -right-4'
                />
              )
            )
          }
          return (
            <span 
              key={header}
              className={clsx((centerHeaders && centerHeaders?.includes(i)) && 'text-center')}
            >{header}</span>
          )
        })}
        <span className="flex items-center justify-center">
          <BsFillMenuButtonFill className='text-xl' />
        </span>
      </div>
    </div>
  )
}

export default TableHeaderComponent