import { AnimatePresence } from 'motion/react'
import Modal from './Modal';
import CropperWindow from './CropperWindow';
import LoadingButton from './LoadingButton';
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useEffect } from 'react';

function CropperModal(
  {
    dimen = {}, 
    isOpen, 
    onResult, 
    onClose, 
    title, 
    subTitle, 
    headerIcon = null,
    cropper = {
      src: null,
      disableMessage: "",
      outputFormat: "",
      validFormats: [],
      outPutDimen: 0,
      thumbDimen: 0,
      containerClass: '',
      wrapperClass: '',
      cropperClass: '',
      buttonsClass: ''
    }
  }
) {
  
  /* reset image on every opens */
  useEffect(() => {
    if (isOpen) {
      setImage(cropper?.src ?? null);
    } else {
      setImage(null);
    }
  },[isOpen, cropper?.src])

  const [image, setImage] = useState(null)

  const handleClose = ()=>{
    onClose();
  }

  const Icon = headerIcon;

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen}>

        {/* header */}
        <div 
          style={{width: `${dimen?.width}px` || 'auto', height:`${dimen?.height}px` || 'auto'}}
          className='flex flex-col'>
          <div className='flex gap-4 mb-5 border-b border-gray-300'>
            <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
              {Icon && <Icon size={20} />}
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className='text-xl'>{title}</h1>
              <p>{subTitle}</p>
            </div>
          </div>

          <CropperWindow
            src={cropper?.src}
            onImageCrop={(files) => setImage(files)}
            outPutDimen={cropper?.outPutDimen}
            thumbDimen={cropper?.thumbDimen}
            disableMessage={cropper?.disableMessage}
            outputFormat={cropper?.outputFormat}
            validFormats={cropper?.validFormats}
            containerClass={cropper?.containerClass}
            wrapperClass={cropper?.wrapperClass}
            cropperClass={cropper?.cropperClass}
            buttonsClass={cropper?.buttonsClass}
          /> 
        </div>

        {/* action buttons */}
        <div className='flex w-full items-center justify-end gap-2 pt-6'>
          
          <button
            onClick={handleClose}
            className={`px-4! rounded-3xl! inline-flex items-center
            transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

            <span>Close</span>
          </button>

          <LoadingButton
            onClick={() => onResult(image)}
            text='Save Image'
            type='submit'
            form='new-category-form'
            icon={<ClipLoader color="white" size={23} />}
            className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300`}
          />
        </div>

      </Modal>}
    </AnimatePresence>
  )
}

export default CropperModal