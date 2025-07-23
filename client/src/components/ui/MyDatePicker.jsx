import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReadOnlyInputComponent = (props, ref) => (
  <input
    {...props}
    readOnly
    ref={ref}
    className="custom-input"
  />
)

const ReadOnlyInput = React.forwardRef(ReadOnlyInputComponent);

function MyDatePicker({minDate = new Date(), value, onChange, placeholder}) {
  
  const handleChange = (date) => {
    if (date !== value) {
      onChange(date);
    }
  };

  return (
    <DatePicker 
      selected={value ?? null} 
      onChange={handleChange}
      dateFormat='dd-MM-yyyy'
      minDate={minDate}
      customInput={<ReadOnlyInput />}
      placeholderText={placeholder}
    />
  );
}

export default MyDatePicker