import React, { useEffect, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { motion } from 'motion/react'

function SearchBarComponent({
  onSearch = () => {},
  placeholder,
  className,
  inputClass,
  iconClass
}) {

  /* debouncer */
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300);

    return () => clearTimeout(timer);

  },[query])

  return (
    <motion.div layout className={`flex items-center relative ${className || ''}`}>
      <input 
        type="text"
        value={query} 
        onChange={e => setQuery(e?.target?.value)}
        placeholder={placeholder || ''}
        className={inputClass || ''}
      />
      <LuSearch size={20} className={`absolute text-neutral-400/80 ${iconClass || ''}`}/>
    </motion.div>
  )
}

const SearchBar = React.memo(SearchBarComponent)

export default SearchBar