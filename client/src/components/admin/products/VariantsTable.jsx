import React from 'react'
import { useState } from 'react';
import { IoAdd, IoImage } from 'react-icons/io5';
import CropperModal from '../../ui/CropperModal';
import { hasBlankObjectValue, imageFileToSrc } from '../../../utils/Utils';
import { useEffect } from 'react';

function VariantsTable({attributes, getVariants}) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      attributes: Object.fromEntries(attributes?.map(attr => [attr.name, ''])),
      sku: '',
      price: '',
      stock: '',
      image: null,
      preview: null
    },
  ]);

  useEffect(() => {
    const result = variants?.map(item => {
      if(!hasBlankObjectValue(item)){
        return {
          attributes: item.attributes,
          sku: item.sku,
          price: item.price,
          stock: item.stock,
          image: item.image
        }
      }
    }).filter(Boolean)
    if(result?.length) getVariants(result)
  }, [variants])

  const handleChange = (rowIndex, field, value, isAttr = false) => {
    setVariants(prev => {
      const updated = [...prev];
      if (isAttr) {
        updated[rowIndex].attributes[field] = value;
      } else {
        updated[rowIndex][field] = value;
      }
      return updated;
    });
  };

  const addRow = () => {
    setVariants(prev => [
      ...prev,
      {
        id: Date.now(),
        attributes: Object.fromEntries(attributes.map(attr => [attr.name, ''])),
        sku: '',
        price: '',
        stock: '',
        image: null,
        preview: null
      },
    ]);
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-medium text-gray-900">Variants</h2>
        <div
          onClick={addRow} 
          className="inline-flex items-center border border-primary-300 ps-1 pe-2 py-1 rounded-2xl
          transition-all duration-300 hover:bg-primary-50 cursor-pointer"
          >
          <IoAdd size={20} />
          <span>Add Variant</span>
        </div>
      </div>
      <ul className='flex flex-col gap-2'>
        {/* headers */}
        <li className={`grid grid-flow-col auto-cols-[minmax(0,1fr)] gap-1 capitalize font-semibold`}>
          {attributes.map(item =>
            <span key={item.name}>{item.name}</span>
          )}
          <span>sku</span>
          <span>price</span>
          <span>stock</span>
          <span>image</span>
        </li>

        {/* dynamic rows */}
        {variants.map((variant, index) => (
          <li key={variant.id} className={`grid grid-flow-col auto-cols-[minmax(0,1fr)] gap-1 items-center capitalize`}>
            {attributes.map(attribute =>
              <select key={attribute.name} 
                value={variant.attributes[attribute.name]}
                onChange={e => handleChange(index, attribute.name, e.target.value, true)}
                className='!text-gray-400 capitalize'
              >
                <option value="" disabled>Select...</option>
                {attribute?.values.map(item =>
                  <option key={item} value={item} 
                    className={`${item === 'size' ? 'uppercase' : 'capitalize'} text-gray-800`}
                  >{item}</option>
                )}
              </select>
            )}
            <input
              type="text"
              placeholder="SKU"
              value={variant.sku}
              onChange={(e) => handleChange(index, 'sku', e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) => handleChange(index, 'price', e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) => handleChange(index, 'stock', e.target.value)}
            />
            <div className='border border-gray-300 rounded-lg h-full flex items-center justify-between p-1'>
              <label 
                onClick={() => {
                  setActiveIndex(index);
                  setIsModalOpen(true);
                }}
                htmlFor={`variant-image-${index}`} 
                className='cursor-pointer border border-gray-300 rounded-md inline-flex items-center
                px-2 '
              >
                Browse
              </label>
              <div className='border border-gray-300 w-7.5'>
                {/* {console.log(variant)} */}
                <img src={variant?.preview || null} className='object-contain' alt="" />
              </div>
            </div>
          </li>
        ))}
        
      </ul>
      <CropperModal
        dimen={{width: 450}}
        title="Crop Image"
        subTitle="Crop images as per the required dimention"
        headerIcon={IoImage}
        isOpen={isModalOpen}
        onResult={async(file) => {
          handleChange(activeIndex, 'image', file);
          handleChange(activeIndex, 'preview', await imageFileToSrc(file));
          setIsModalOpen(false);
          setActiveIndex(null);
        }}
        onClose={()=> {
          setIsModalOpen(false);
          setActiveIndex(null);
        }}
      />
    </>
    
  )
}

export default VariantsTable