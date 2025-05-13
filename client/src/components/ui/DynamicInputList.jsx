import React, { useEffect, useState } from 'react';
import { IoAdd, IoTrashOutline } from 'react-icons/io5';

const DynamicInputList = (
  {
    title, titleClass, containerClass,inputContainerClass, removeBtnClass, onChange = () => {}, value
  }
) => {
  const [inputs, setInputs] = useState([
    { 
      id: Date.now(), 
      data: { name:'', value: '' } 
    }
  ]);

  /* input Setup */
  useEffect(()=> {
    
    const input = value?.map(item => {
      return {
        ...item,
        id: item?._id,
        data: {
          name: item?.name,
          value: item?.values?.join(',')
        }
      }
    });
    if(input) setInputs(input)
  },[value])

  /* out put setup */
  useEffect(()=> {
    const result = inputs.map(item => {
      if(item?.data?.name && item?.data?.value) return item
    }).filter(Boolean);

    if(result.length) onChange(result);
  }, [inputs])

  const handleInputs = (rowIndex, field, value) => {
    setInputs(prev => {
      const updated = [...prev];
      updated[rowIndex].data[field] = value;
      return updated;
    })
  }

  const addInput = () => {
    setInputs(prev => [...prev, { 
      id: Date.now(), 
      data: { name:'', value: '' } 
    }]);
  };

  const removeInput = (id) => {
    setInputs(prev => prev.filter(input => input.id !== id));
  };

  return (
    <>
      <label className={titleClass}>
          {title}
          <span className='text-gray-400 ms-2'>@ex: Color: red, green, blue</span>
        </label>
      <div className={containerClass}>
        
        {inputs.map((input, index) => (
          <div key={input.id} className={`${inputContainerClass}`}>
            <input
              type="text"
              value={input?.data?.name}
              onChange={e => handleInputs(index, 'name', e.target.value)}
              placeholder={`Attribute ${index + 1}`}
              disabled={input.parent}
              className='disabled:text-gray-400 disabled:bg-gray-100'
              />
            
            <input
              type="text"
              value={input?.data?.value}
              onChange={e => handleInputs(index, 'value', e.target.value)}
              placeholder={`Values ${index + 1}`}
              disabled={input.parent}
              className='disabled:text-gray-400 disabled:bg-gray-100'
            />
            
            <button 
              type='button' 
              onClick={() => removeInput(input.id)} 
              disabled={inputs.length === 1 && index < 1 ||  input.parent}
              className={`${removeBtnClass} disabled:!text-gray-400 disabled:!bg-gray-100 disabled:pointer-events-none disabled:cursor-not-allowed`}
            >
              <IoTrashOutline size={20} />
            </button>

            <div className="flex col-span-full mt-1">
              <span className='capitalize'>{input?.data?.name && input?.data?.name + ':'}</span>
              <span className='ms-1 capitalize'>{input?.data?.value}</span>
            </div>

            {/* <pre className='col-span-full'>{JSON.stringify(input.value, null, 2)}</pre> */}

          </div>
        ))}
        <div className='flex w-full items-center justify-center p-2'>
          <span 
            onClick={addInput}
            className='inline-flex items-center ps-1 pe-3 py-1 rounded-xl cursor-pointer'>
            <IoAdd size={20} />
            <span>Add new</span>
          </span>
        </div>
        {/* <pre>{JSON.stringify(inputs, null, 2)}</pre> */} {/* for debugging */}
      </div>
    </>
  );
}

export default DynamicInputList;