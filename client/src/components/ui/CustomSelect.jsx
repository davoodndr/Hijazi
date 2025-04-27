import React from 'react'
import Select from 'react-select'

const CustomSelect = ({focusColor, options, isMulti = false}) => {

  const customStyles = {
      control: (base, state) => ({
        ...base,
        marginTop: '3px',
        minHeight: 40,
        height: 40,
        borderColor: state.isFocused ? focusColor : '#d4d4d8',
        borderRadius: '10px',
        boxShadow: 'none !important',
        outline: 'none !important',
        '&:hover': {
          borderColor: '#d4d4d8',
        },
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 12px',
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      indicatorsContainer: (base) => ({
        ...base,
        height: 40,
      }),
    };

  return (
    <Select
      isMulti={isMulti}
      styles={customStyles}
      options={options}
    />
  )
}

export default CustomSelect