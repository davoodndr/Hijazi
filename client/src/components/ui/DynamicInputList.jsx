import React, { useEffect, useState } from 'react';
import { IoAdd, IoTrashOutline } from 'react-icons/io5';

const DynamicInputList = (
  {
    title, 
    titleClass, 
    containerClass,
    inputContainerClass, 
    removeBtnClass, 
    onChange = () => {},
    onRemove = () => {},
    value,
    disabledValues
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
        id: item?._id || item?.id,
        _id: item?._id || null,
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

    // custom attributes can't delete on enable this
    /* if(result.length)  */onChange(result);
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
    onRemove(id)
  };

  return (
    <>
      <label className={titleClass}>
          {title}
          <span className='text-gray-400 ms-2'>@ex: Color: red, green, blue</span>
        </label>
      <div className={containerClass}>
        
        {disabledValues?.length > 0 && disabledValues.map((input, index) => (
          <div key={input._id} className={`${inputContainerClass}`}>
            <input
              type="text"
              value={input.name}
              disabled
              className='disabled:text-gray-400 disabled:bg-gray-100'
              />
            
            <input
              type="text"
              value={input.values.join(',')}
              disabled
              className='disabled:text-gray-400 disabled:bg-gray-100'
            />
            
            <button 
              type='button' 
              disabled
              className={`${removeBtnClass}
               disabled:!text-gray-400 disabled:!bg-gray-100 disabled:pointer-events-none
                disabled:cursor-not-allowed`}
            >
              <IoTrashOutline size={20} />
            </button>

            <div className="flex col-span-full mt-1">
              <span className='capitalize'>{input.name && input.name + ':'}</span>
              <span className='ms-1 capitalize'>{input.values.join(',')}</span>
            </div>

          </div>
        ))}
        
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
      </div>
    </>
  );
}

export default DynamicInputList;