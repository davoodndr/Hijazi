import clsx from 'clsx'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { FiSearch } from "react-icons/fi";
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

function MultiSelectCheckComponent({
  options = [],
  className,
  searchable = false,
  searchPlaceholder = 'Search',
  onSelect = () => {}
}) {

  const [selected, setSelected] = useState([]);
  const [dropUp, setDropUp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  /* handles expanded */
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* handles expansion position */
  useLayoutEffect(() => {
    if (!isExpanded) {
      setIsLayoutReady(false);
      return
    };

    const measure = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const dropdownHeight = dropdownRect.height;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      const buffer = 24;
      const shouldDropUp = spaceBelow < dropdownHeight + buffer && spaceAbove > spaceBelow;
      setDropUp(shouldDropUp);
      setReadyToShow(true);
      setIsLayoutReady(true);
    };

    setReadyToShow(false);

    requestAnimationFrame(measure);

    // to avoid flickers
    const timer = setTimeout(() => {
      setIsLayoutReady(true)
    }, 10);

    return () => clearTimeout(timer)

  }, [isExpanded]);

  /* search */
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState(query);

  /* debouncer */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  },[query])

  /* search filter */
  const filteredOptions = useMemo(() => {
    return options?.filter(option => 
      option?.value?.toString().match(searchQuery)
    )
  }, [searchQuery, options])

  /* select export */
  useEffect(() => {
    onSelect(selected)
  },[selected])

  return (
    <div
      ref={wrapperRef}
      className='relative overflow-visible'
    >
      <div
        ref={triggerRef}
        onClick={() => setIsExpanded(prev => !prev)}
        className={clsx(`select group ${className}`)}>

        {/* text */}
        <div className='flex-grow'>
          {selected?.length > 0 ? 
            selected?.length === options?.length ?
              (<span>All selected</span>)
              :
              (<p><span className='pr-2'>{`${selected?.length}/${options?.length}`}</span>selected</p>)
            :
            <span>Select....</span>
          }
        </div>

        {/* arrwow */}
        <div 
          className='px-2.5 h-full inline-flex items-center text-gray-400/70 smooth group-hover:text-gray-600'>
          <IoIosArrowDown className='text-lg' />
        </div>
      </div>

      {/* dropdown */}
      <AnimatePresence>
        {isExpanded &&  (
          <motion.div
            ref={dropdownRef}
            key={isLayoutReady ? "dropdown" : ""}
            initial={{ opacity: 0, scaleY: 0.85 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.85 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              `absolute bg-white border border-neutral-300 w-full flex flex-col 
              shadow-md rounded-input-border max-h-60 overflow-hidden`,
              !readyToShow && 'opacity-0 pointer-events-none bottom-[-9999px]',
              readyToShow && (dropUp ? 'bottom-full mb-1 origin-bottom' : 'top-full mt-1 origin-top z-50')
            )}
            layout
          >
          {/* search */}
          {searchable &&
            (<div className="flex p-2 border-b border-neutral-300 relative">
              <input type="text" placeholder={searchPlaceholder}
                value={query ?? ""}
                onChange={e => setQuery(e.target.value)}
              />
              <span className='text-xl text-primary-300 absolute top-1/2 -translate-y-1/2 right-5'>
                <FiSearch />
              </span>
            </div>)
          }

          {/* options */}
          <motion.div className='overflow-hidden overflow-y-auto h-full'>
            {filteredOptions?.length > 0 ?
              filteredOptions?.map(item => 
                <motion.div
                  key={item?.value}
                  onClick={() => {
                    if(selected?.includes(item?.value)){
                      const filtered = selected.filter(el => el !== item.value);
                      setSelected(filtered)
                    }else{
                      setSelected(list => ([...list, item.value]))
                    }
                    
                  }}
                  className={clsx('flex items-center smooth hover:bg-primary-50 hover:text-primary-400',
                    selected?.includes(item.value) && 'bg-primary-25 text-primary-400'
                  )}>
                  <div className='w-8 inline-flex justify-center'>
                    {selected?.includes(item.value) && <FaCheck className='text-lg' />}
                  </div>
                  <span className='pr-3.75 py-2 text-sm capitalize'> {item?.label} </span>
                </motion.div>
              )
              :
              (
                <motion.div className='flex items-center justify-center'>
                  <span className='pr-3.75 py-2 text-sm capitalize text-gray-400'>No items found</span>
                </motion.div>
              )
            }
          </motion.div>
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}

const MultiSelectCheck = React.memo(MultiSelectCheckComponent)

export default MultiSelectCheck