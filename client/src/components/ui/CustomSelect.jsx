import clsx from 'clsx';
import React from 'react'
import { Component } from 'react';
import Select from 'react-select'

const CustomSelect = React.memo((
  {options, isMulti = false, onChange, value, labelClass = ''}
) => {
  
  return (
    <Select
      menuPlacement="auto" // will open above if below space is limited
      menuPosition="fixed"
      menuShouldScrollIntoView
      isMulti={isMulti}
      options={options}
      onChange={onChange}
      value={value}
      formatOptionLabel={({ label }) => 
        label instanceof Component ? (label) :
        (<span className={`inline-flex capitalize ${labelClass}`}>{label}</span>)
      }
      classNames={{
        control: ({isFocused}) => clsx(
          '!ring-0 h-[40px] !rounded-input-border',
          isFocused ? '!border-primary-300' : '!border-neutral-300'
        ),
        option: ({isSelected, isFocused}) => clsx(
          isFocused && '!bg-gray-100',
          isSelected && '!bg-primary-50 !text-primary-400'
        ),
        input: () => `h-[40px] !m-0 !p-0`,
        indicatorsContainer:() => `h-[40px]`,
        valueContainer: () => `!py-0 !px-3`
      }}
    />
  )
})

export default CustomSelect