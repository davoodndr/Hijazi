import React from 'react'
import { useState } from 'react';
import { IoAdd, IoImage, IoTrashOutline } from 'react-icons/io5';
import CropperModal from '../../ui/CropperModal';
import { hasBlankObjectValue, imageFileToSrc } from '../../../utils/Utils';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * 
 * @typedef {Object} VariantsTableSettings 
 * @property {Object[] | undefined} attributes - Attributes to create variants
 * @property {Function | undefined} getVariants - Function returns variants
 * @property {{ width: number, height: number }} outPutDimen - Required output dimensions for variant image
 */

function VariantsTable(
  {
    attributes,
    variants,
    setVariants,
    outPutDimen
  }
) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([])

  /* initialization & output */
  useEffect(() => {
    if(!variants.length){
      addRow();
    }
  },[variants])

  const handleChange = ({type = 'update', rowIndex, field, value, isAttr = false, list}) => {
    setVariants({type, rowIndex, field, value, isAttr, list})
  };

  const addRow = () => {
    setVariants({type: 'insert', value: {
          id: Date.now(),
          attributes: Object.fromEntries(attributes.map(attr => [attr.name, ''])),
          sku: '',
          price: '',
          stock: '',
          image: null,
          preview: null
        },
      }
    );
  };

  const handleModalResult = async(file) => {
    if(file && !hasBlankObjectValue(variants[activeIndex], ['image','preview'])){
      handleChange({rowIndex:activeIndex, field:'image', value:file});
      const preview = await imageFileToSrc(file)
      handleChange({rowIndex:activeIndex, field:'preview', value:preview});
    }else{
      toast.error('Fill all previous fields to add image')
    }
    setIsModalOpen(false);
    setActiveIndex(null);
  }

  const handleDeleteVariants = () => {
    handleChange({type: 'delete', list:selectedVariants})
    setSelectedVariants([])
  }
  
  return (
    <>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-medium text-gray-900">Variants</h2>
        <div className='flex items-center gap-2'>

          {/* delete button */}
          <div 
            onClick={handleDeleteVariants}
            className={`inline-flex bg-gray-200 p-2 rounded-lg cursor-pointer smooth
            hover:bg-red-400 hover:text-white 
            ${selectedVariants.length ? '' : 'pointer-events-none cursor-not-allowed opacity-50'}`}> 
            <IoTrashOutline size={20} />
          </div>

          {/* add variant button */}
          <div
            onClick={addRow} 
            className="inline-flex items-center border border-primary-300 ps-1 pe-2 py-1 rounded-2xl
            smooth hover:bg-primary-50 cursor-pointer"
            >
            <IoAdd size={20} />
            <span>Add Variant</span>
          </div>
        </div>
      </div>

      {/* content */}
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
                onChange={e => handleChange({
                  rowIndex:index, 
                  field: attribute.name, 
                  value:e.target.value, 
                  isAttr: true
                })}
                className={`capitalize
                  ${variant.attributes[attribute.name] === "" ? "!text-gray-400" : "!text-gray-800"}`}
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
              onChange={(e) => handleChange({rowIndex:index,  field:'sku', value:e.target.value})}
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) => handleChange({rowIndex:index,  field:'price', value:e.target.value})}
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) => handleChange({rowIndex:index,  field:'stock', value:e.target.value})}
            />
            <div className='flex w-full gap-x-1 items-center'>
              <div className='flex-1 border border-gray-300 rounded-lg h-full flex items-center justify-between p-1'>
                <label 
                  onClick={() => {
                    setActiveIndex(index);
                    setModalImageSrc(variant.preview);
                    setIsModalOpen(true);
                  }}
                  htmlFor={`variant-image-${index}`} 
                  className='cursor-pointer border border-gray-300 rounded-md inline-flex items-center
                  px-2 '
                >
                  Browse
                </label>
                <div className='border border-gray-300 w-7.5'>
                  <img src={variant?.preview || null} className='object-contain' alt="" />
                </div>
              </div>
              <div className='p-2.75 bg-gray-300 inline-flex rounded-lg'>
                <input type="checkbox" onChange={(e)=> {
                  if(e.target.checked){
                    setSelectedVariants(prev => ([...prev, variant?.id]));
                  }else{
                    setSelectedVariants(prev => prev.filter(el => el !== variant?.id));
                  }
                }} />
              </div>
            </div>
          </li>
        ))}

      </ul>
      <CropperModal
        src={modalImageSrc}
        dimen={{width: 450}}
        title="Crop Image"
        subTitle="Crop images as per the required dimention"
        headerIcon={IoImage}
        isOpen={isModalOpen}
        cropper={{
          outputFormat: 'webp',
          validFormats: ['jpg','jpeg','png','bmp'],
          outPutDimen: outPutDimen
        }}
        onResult={handleModalResult}
        onClose={()=> {
          setIsModalOpen(false);
          setActiveIndex(null);
        }}
      />
    </>
  )
}

export default VariantsTable