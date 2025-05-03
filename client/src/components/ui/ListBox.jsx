import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react'
import { FaCheck, FaChevronDown } from 'react-icons/fa6';

function ListBox({items, value, onChange}) {

  const [selected, setSelected] = useState(null);

  const handleChange = (value)=>{
    setSelected(value);
    onChange(value)
  }

  useEffect(() => {
    setSelected(value)
  },[value])

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div>
          <ListboxButton 
            className={clsx(
              'group relative block w-full h-[40px] !rounded-input-border !bg-transparent !py-0 !px-[15px] text-left text-sm/6',
              '!shadow-none !border border-neutral-300 focus:!border-neutral-300',
              selected ? '!text-black' : '!text-neutral-400/80'
            )}
          >
            {selected?.label || 'Select Status'}
            <FaChevronDown
              className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-400 group-hover:fill-black"
              aria-hidden="true"
            />
          </ListboxButton>
          <AnimatePresence>
            {open && (
              <ListboxOptions
                portal
                static
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                anchor="bottom"
                className={clsx(
                  `origin-top border empty:invisible z-[1000] bg-white outline-none`,
                  `w-(--button-width) rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:--spacing(1)] empty:invisible
                    shadow-lg`
                )}
              >
                {items.map((item) => (
                  <ListboxOption 
                    key={item.id} value={item} 
                    className="group flex items-center gap-2 rounded-lg px-3 py-1.5 
                    select-none data-focus:bg-primary-50 cursor-pointer"
                  >
                    <FaCheck className="invisible size-4 text-black group-data-selected:visible" />
                    <div className="text-sm/6 text-black">{item.label}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  )
}

export default ListBox