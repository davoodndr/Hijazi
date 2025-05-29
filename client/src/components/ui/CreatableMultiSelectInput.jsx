import React from 'react'
import CreatableSelect from 'react-select/creatable'

const components = {
  DropdownIndicator: null,
};

const MultiSelectInput = (
  {focusColor = '#4cc4bb',
    
  }
) => {

  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState([]);

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue('');
        event.preventDefault();
    }
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const customStyles = {
    control: (base, state) => ({
      ...base,
      marginTop: '3px',
      minHeight: 40,
      height: 'auto',
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
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      styles={customStyles}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="Type & press enter..."
      value={value}
    />
  )
}

export default MultiSelectInput