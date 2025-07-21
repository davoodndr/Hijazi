import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { AnimatePresence, motion } from 'motion/react'

function MultiSelectCheckComponent({
  options = [],
  className
}) {

  const [selected, setSelected] = useState([]);
  const [dropUp, setDropUp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handlePosition = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setDropUp(true);
        } else {
          setDropUp(false);
        }
      }
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    
    return () => {
      window.removeEventListener('resize', handlePosition);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className='relative overflow-visible'>
      <div className={clsx(`select ${className}`)}>

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
          onClick={() => {
            setIsExpanded(prev => !prev)
          }}
          className='px-2.5 h-full inline-flex items-center text-gray-400/70 smooth hover:text-gray-600'>
          <IoIosArrowDown className='text-lg' />
        </div>
      </div>

      {/* dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
          key="dropdown"
          initial={{ opacity: 0, scaleY: 0.85 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.85 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={clsx(`absolute bg-white border border-neutral-300 w-full 
          shadow-md rounded-input-border cursor-pointer overflow-hidden max-h-60 overflow-y-auto`,
          dropUp ? 'bottom-full mb-1 origin-bottom' : 'top-full mt-1 origin-top z-50'
        )}>
          {
            options?.map(item => 
              <div
                onClick={() => {
                  if(selected?.includes(item.value)){
                    const filtered = selected.filter(el => el !== item.value);
                    setSelected(filtered)
                  }else{
                    setSelected(list => ([...list, item.value]))
                  }
                  
                }}
                key={item?.value}
                className={clsx('flex items-center smooth hover:bg-primary-50 hover:text-primary-400',
                  selected?.includes(item.value) && 'bg-primary-25 text-primary-400'
                )}>
                <div className='w-8 inline-flex justify-center'>
                  {selected?.includes(item.value) && <FaCheck className='text-lg' />}
                </div>
                <span className='pr-3.75 py-2 text-sm capitalize'> {item?.label} </span>
              </div>
            )
          }
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}

const MultiSelectCheck = React.memo(MultiSelectCheckComponent)

export default MultiSelectCheck