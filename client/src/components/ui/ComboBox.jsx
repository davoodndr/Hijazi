import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react'
import { FaCheck, FaChevronDown } from 'react-icons/fa6';

const ComboBox = React.memo(({items = [], value, onChange, placeholder = ''}) => {

  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('')

  const handleChange = (value)=>{
    setSelected(value);
    onChange(value);
    console.log('----ok')
  }

  useEffect(() => {
    setSelected(value)
  }, [value])
    
  const filteredItems = query ?
    items?.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
    : items;

  return (
    <Combobox 
      value={selected} 
      onChange={handleChange} 
      onClose={()=> setQuery('')}
      virtual={{options: filteredItems}}
      >
      
      <div className="relative">
          <ComboboxInput
            spellCheck={false}
            displayValue={(item) => item?.label}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className='capitalize'
            />
          <ComboboxButton className="group absolute inset-y-0 right-3 px-2.5 !bg-transparent !shadow-none">
            <FaChevronDown  className="size-4 text-gray-400 group-data-hover:fill-black"/>
          </ComboboxButton>
        </div>

        
          <ComboboxOptions
            portal
            anchor="bottom"
            static
            className={clsx(
              `origin-top border empty:invisible z-[1000] bg-white`,
              `w-(--input-width) rounded-xl border border-gray-300 bg-white p-1 [--anchor-gap:--spacing(1)] empty:invisible
                shadow-lg`,
            )}
          >

          {({ option: item }) => (
            <ComboboxOption value={item} 
              className="group w-full flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 
              select-none data-focus:bg-primary-50 transition-all duration-300"
            >
              <FaCheck className="invisible size-4 text-black group-data-selected:visible" />
              <div className="text-sm/6 text-black capitalize">{item.label}</div>
            </ComboboxOption>
          )}

          </ComboboxOptions>

    </Combobox>
  )

  /* return (
    <Combobox 
      value={selected} 
      onChange={handleChange} 
      onClose={()=> setQuery('')}
      virtual={{options: filteredItems}}
      >

      {({open}) => (

        <div>

          <div className="relative">
            <ComboboxInput
              spellCheck={false}
              displayValue={(item) => item?.label}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className='capitalize'
              />
            <ComboboxButton className="group absolute inset-y-0 right-3 px-2.5 !bg-transparent !shadow-none">
              <FaChevronDown  className="size-4 text-gray-400 group-data-hover:fill-black"/>
            </ComboboxButton>
          </div>

          <AnimatePresence>
            {open && (
            <ComboboxOptions
              portal
              anchor="bottom"
              static
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onAnimationComplete={() => setQuery('')}
              className={clsx(
                `origin-top border empty:invisible z-[1000] bg-white`,
                `w-(--input-width) rounded-xl border border-gray-300 bg-white p-1 [--anchor-gap:--spacing(1)] empty:invisible
                  shadow-lg`,
              )}
            >
              {({ option: item }) => (
                <ComboboxOption value={item} 
                  className="group w-full flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 
                  select-none data-focus:bg-primary-50 transition-all duration-300"
                >
                  <FaCheck className="invisible size-4 text-black group-data-selected:visible" />
                  <div className="text-sm/6 text-black capitalize">{item.label}</div>
                </ComboboxOption>
              )}
            </ComboboxOptions>
          )}
          </AnimatePresence>

        </div>

      )}

    </Combobox>
  ) */
})

export default ComboBox