import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReadOnlyInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    readOnly
    ref={ref}
    value={value}
    onClick={onClick}
    placeholder='Enter coupon expiry date'
    className="custom-input"
  />
));

function MyDatePicker({value, onChange}) {
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    setStartDate(value)
  },[value])

  useEffect(() => {
    onChange(startDate)
  },[startDate, setStartDate])

  return (
    <DatePicker 
      selected={startDate} 
      onChange={(date) => setStartDate(date)}
      dateFormat='dd-MM-yyyy'
      customInput={<ReadOnlyInput />}
    />
  );
}

export default MyDatePicker