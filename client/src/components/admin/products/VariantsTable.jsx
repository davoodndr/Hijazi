import React, { useLayoutEffect, useRef } from 'react'
import { useState } from 'react';
import { IoAdd, IoImage, IoTrashOutline } from 'react-icons/io5';
import CropperModal from '../../ui/CropperModal';
import { hasBlankObjectValue, imageFileToSrc } from '../../../utils/Utils';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineImageSearch } from 'react-icons/md';
import CustomSelect from '../../ui/CustomSelect';
import clsx from 'clsx';

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
    outPutDimen,
    thumbDimen
  }
) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([])
  const [colCount, setColCount] = useState(0);
  const [lastColWidth, setLastColWidth] = useState(0);
  const lastColRef = useRef(null);

  /* initialization & output */
  useEffect(() => {
    if(!variants.length){
      addRow();
    }else{
      getColCount(variants[0])
    }
  },[variants])

  /* changes on attribute change */
  useLayoutEffect(() => {
    if(variants.length){
      const updatedVariant = {
        ...variants[0],
        attributes,
      }
      getColCount(updatedVariant)
    }
  },[attributes])

  /* for adjusting the lastCol width of table header */
  useEffect(() => {

    const updateWidth = () => {
      if (lastColRef.current) {
        const width = lastColRef.current.getBoundingClientRect().width;
        if (width > 0 && width !== lastColWidth) {
          setLastColWidth(width);
        }
      }
    };

    let timer = setTimeout(() => {
      updateWidth();
    }, 0); // initial

    // Optional: Watch window resize too
    window.addEventListener('resize', updateWidth);

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateWidth);
    };
  },[])

  const gridTemplate = lastColWidth
    ? `19px repeat(${colCount}, 1fr) ${lastColWidth}px`
    : `19px repeat(${colCount}, 1fr) auto`;

  const handleChange = ({type = 'update', rowIndex, field, value, isAttr = false, list}) => {
    setVariants({type, rowIndex, field, value, isAttr, list})
  };

  const addRow = () => {
    const variant = {
          id: Date.now(),
          attributes: Object.fromEntries(attributes.map(attr => [attr.name, ''])),
          sku: '',
          price: '',
          stock: '',
          files: null,
          preview: null
        };

    setVariants({type: 'insert', value: variant})

  };

  const getColCount = (variant) => {
    const topLevelCount = Object.keys(variant).filter(
      key => !['id','_id', 'files', 'image', 'preview', 'attributes'].includes(key)
    ).length;

    const attributeCount = Object.keys(variant.attributes).length;
    setColCount(topLevelCount + attributeCount)
  }

  const handleModalResult = async(files) => {

    console.log(variants[activeIndex])
    if(!hasBlankObjectValue(variants[activeIndex], ['files','image','preview'])){

      if(files){
        handleChange({rowIndex:activeIndex, field:'files', value:files});
        const preview = await imageFileToSrc(files.thumb)
        handleChange({rowIndex:activeIndex, field:'preview', value:preview});
      }

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
        <li
          style={{
            gridTemplateColumns: gridTemplate
          }} 
          className={`grid gap-1 capitalize font-semibold`}
        >
          <span></span>
          {attributes.map(item =>
            <span key={item.name}>{item.name}</span>
          )}
          <span>sku</span>
          <span>price</span>
          <span>stock</span>
          <span className='inline-flex w-fit'>image</span>
        </li>

        {/* dynamic rows */}
        {variants.map((variant, index) => {
          console.log()
          return(<li
            style={{
              gridTemplateColumns: gridTemplate
            }}
            key={variant.id} className={`grid gap-1 items-center capitalize`}
          >
            <div className='pe-1.5 inline-flex rounded-lg'>
              <input type="checkbox" onChange={(e)=> {
                if(e.target.checked){
                  setSelectedVariants(prev => ([...prev, variant?.id]));
                }else{
                  setSelectedVariants(prev => prev.filter(el => el !== variant?.id));
                }
              }} />
            </div>
            
            {attributes.map(attribute => {

              const colorLabel = <span
                      style={{
                        "--dynamic" : variant.attributes[attribute.name],
                      }}
                      className='point-before !text-sm !text-(--dynamic) point-before:!bg-(--dynamic)
                        point-before:!p-1.5 point-before:none'
                      >{variant.attributes[attribute.name]}
                    </span>
              
              const attr = variant.attributes[attribute.name] ? {
                id: attribute.id || attribute._id || index, 
                value: variant.attributes[attribute.name],
                label: (attribute.name === 'color' || attribute.name === 'colour') ?
                    colorLabel
                    :
                    variant.attributes[attribute.name]
              } : null
              
              return <CustomSelect
                key={attribute.name}
                value={attr}
                onChange={(val) => handleChange({
                  rowIndex:index, 
                  field: attribute.name, 
                  value: val.value, 
                  isAttr: true
                })}
                options={
                  attribute?.values?.map((el,index)=> ({id: el+index, value:el, label: 
                    (attribute.name === 'color' || attribute.name === 'colour') ?
                    <span
                      style={{
                        "--dynamic" : el,
                      }}
                      className='point-before !text-sm !text-(--dynamic) point-before:!bg-(--dynamic)
                        point-before:!p-1.5 point-before:none'
                      >{el}</span>
                    :
                    el
                  }))
                }
              />}
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
            <div ref={lastColRef} className='flex w-fit h-full items-center whitespace-nowrap'>
              <label 
                onClick={() => {
                  setActiveIndex(index);
                  setModalImageSrc(variant.preview);
                  setIsModalOpen(true);
                }}
                htmlFor={`variant-image-${index}`} 
                style={{backgroundImage: `url(${variant?.preview || null})`}}
                className={` min-w-10 w-full h-full cursor-pointer border border-gray-300 rounded-md 
                  inline-flex items-center justify-center bg-contain bg-center bg-no-repeat
                  smooth hover:border-primary-300`}
              >
                {!variant?.preview && <MdOutlineImageSearch size={25} />}
              </label>
            </div>
          </li>)
        })}

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
          outPutDimen: outPutDimen,
          thumbDimen,
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