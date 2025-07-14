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

function MyDatePicker({minDate = new Date(), value, onChange}) {
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    setStartDate(value ?? null)
  },[value])

  useEffect(() => {
    onChange(startDate)
  },[startDate])

  return (
    <DatePicker 
      selected={startDate} 
      onChange={(date) => setStartDate(date)}
      dateFormat='dd-MM-yyyy'
      minDate={minDate}
      customInput={<ReadOnlyInput />}
    />
  );
}

export default MyDatePicker