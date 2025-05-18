import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];

export default function MultiSelect() {
  return (
    <div className="w-72">
      <Select
        isMulti
        components={animatedComponents}
        options={options}
        classNames={{
          control:(state) => `!ring-0 h-auto ${state.isFocused ? '!border-red-500':''}`,
          input: () => ''
        }}
      />
    </div>
  );
}