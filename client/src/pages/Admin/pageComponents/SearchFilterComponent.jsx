import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from '../../../components/ui/Searchbar'
import { motion } from 'motion/react'
import DropdownMenuButton from '../../../components/ui/DropdownMenuButton'
import { CiFilter } from 'react-icons/ci'
import { buildFilterMenuItems, buildSortMenuItems, filterData, sortData } from '../../../utils/Utils'
import clsx from 'clsx'
import { FaCheck, FaSort } from 'react-icons/fa6'
import { LuArrowUpDown } from 'react-icons/lu'
import { BsSortDownAlt, BsSortUpAlt } from 'react-icons/bs'

function SearchFilterComponent({
  data,
  onFilter,
  onSearch,
  onSort
}) {

  const [list, setList] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(()=> {
    setList(data?.list);
    setFields(data?.fields);
  },[data])

  /* filter */
  const [searchQuery, setSearchQuery] = useState(null);
  const [filter, setFilter] = useState({});

  const filteredData = useMemo(()=> {
    return filterData(searchQuery, filter?.value, list, fields);
  },[searchQuery, filter, list, fields])
  
  useEffect(()=> {
    onFilter({ list: filteredData, filter })
  },[filteredData])

  /* sort */
  const [currentSort, setCurrentSort] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc');
  useEffect(() => {
    
    const sorted = sortData(currentSort, filteredData);
    onSort({ list: sorted, currentSort })

  },[filteredData, currentSort]);

  /* handling methods */
  const handleOnSearch = (value) => {
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="flex items-center justify-between mb-5">

      {/* search */}
      <div className="w-full flex items-center space-x-3">
        <SearchBar
          onSearch={handleOnSearch}
          placeholder={`Search ${data?.entity}`}
          className='w-4/10'
          inputClass="!pl-10 rounded-xl bg-white peer"
          iconClass='left-3 smooth peer-focus:text-primary-400'
        />

        {((Object?.keys(filter)?.length > 0 && filter?.label !== 'none') || searchQuery) && (
          <motion.p layout className='space-x-1'>
            <span>Found</span>
            {filteredData?.length > 0 && 
              <span className='font-semibold text-primary-400'>
                {filteredData?.length}
              </span>
            }
            <span>{
              filteredData?.length === 1 ? data?.entity?.slice(0,-1) : 
              filteredData?.length < 1 ? 'nothing' : data?.entity}!</span>
          </motion.p>
        )}

      </div>

      {/* filter sort */}
      <div className='flex items-center h-fit space-x-3'>

        {/* sort */}
        <motion.div layout 
          style={{ 
            '--dynamic': `var(${currentSort?.color || ''})` 
          }}
          className={clsx('flex items-center h-9 bg-white border rounded-xl overflow-hidden',
            currentSort && currentSort?.color && currentSort?.field !== 'none' ? 
            'border-(--dynamic)' : 'border-gray-300 text-gray-500'
          )}
        >
          <DropdownMenuButton
            label='Sort'
            icon={<span className='px-1.5'><FaSort className='text-base' /></span>}
            showTail={true}
            tailIconClass='p-2 w-full h-9'
            anchor='right'
            items={buildSortMenuItems(
              data?.sortMenus, 
              currentSort, 
              'none', 
              (menu) => setCurrentSort({
                field: menu?.field,
                ascending: sortDirection === 'asc',
                color: menu?.color
              }))
            }
          />

          <span className='h-9 border-r border-gray-300'></span>

          <DropdownMenuButton
            icon={<span className='px-1.5'><LuArrowUpDown className='text-base' /></span>}
            showTail={true}
            tailIconClass='p-2 h-9 rounded-e-xl'
            anchor='right'
            items={[
              { 
                icon: <BsSortDownAlt className='text-xl'/>,
                label: 'Low to high',
                tail: sortDirection === 'asc' ? (<span><FaCheck /></span>) : null,
                action: () => {
                  setSortDirection('asc')
                  setCurrentSort({...currentSort, ascending: true })
                }
              },
              { 
                icon: <BsSortUpAlt className='text-xl'/>,
                label: 'high to low',
                tail: sortDirection === 'desc' ? (<span><FaCheck /></span>) : null,
                action: () => {
                  setSortDirection('desc')
                  setCurrentSort({...currentSort, ascending: false })
                }
              },
            ]}
          />

        </motion.div>

        {/* filter */}
        <DropdownMenuButton
          label={ (filter?.label !== 'none' ? filter?.label : 'filter') || 'filter'}
          icon={<span className='px-1.5'><CiFilter className='text-lg' /></span>}
          showTail={true}
          tailIconClass='p-2 h-full rounded-e-xl'
          style={{ 
            '--dynamic': `var(${filter?.color || ''})` 
          }}
          className={clsx('bg-white h-9 border rounded-xl',
            (filter?.label !== 'none' && filter?.color) ?
              'text-(--dynamic) border-(--dynamic)' :
              'border-gray-300 text-gray-500'
          )}
          items={buildFilterMenuItems(data?.filterMenus, filter, 'none', (menu) => setFilter(menu))}
        />
      </div>

    </div>
  )
}

export default SearchFilterComponent