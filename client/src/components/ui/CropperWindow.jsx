import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IoCrop, IoImageOutline } from 'react-icons/io5';
import { LuEye } from 'react-icons/lu';
import { RiImageEditLine } from "react-icons/ri";
import { BiReset } from "react-icons/bi";
import { blobToFile, getImageDimensions, isValidFileType, resizeImageFile } from '../../utils/Utils';
import { MdImageSearch } from 'react-icons/md';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';


/**
 * @typedef {Object} CropperWindowProps
 * @property {string} buttonsClass - Custom classes for cropper button container
 * @property {string} cropperClass - Custom classes for cropper container
 * @property {string} containerClass - Custom classes for cropper window container
 * @property {{ width: number, height: number }} outPutDimen - Dimention of output file
 * @property {string} outputFormat - Output file format
 * @property {string} disableMessage - Message to show disaling the cropper
 * @property {Function} onImageCrop - Function returns output as blob
 * @property {string} src - Fills the cropper with a given image
 * @property {string[]} validFormats - Allowed file extensions to select
 */

/** @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<CropperWindowProps> & React.RefAttributes<any>>} */
function CropperWindowComponent({
  buttonsClass = '', 
  cropperClass = '', 
  containerClass = '',
  wrapperClass = '',
  outPutDimen, 
  thumbDimen, 
  outputFormat,
  disableMessage = "",
  onImageCrop = ()=> {}, 
  src,
  validFormats = [],
  /* multiSelect = false */
  
}, ref) {

  const cropFunRef = useRef(null);
  const fileInputRef = useRef(null);
  const [filename, setFilename] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  /* to capture the file from out side in to cropper */
  useEffect(() => {
    setImgSrc(src)
    if(!src) setImgSrc(null)
  }, [src])

  /* reset completely */
  useImperativeHandle(ref, ()=> ({
    reset: () => {
      setImgSrc(null);
      setOriginalFile(null);
      setCroppedFile(null);
      setIsPreview(null)
      setFilename("");
      cropFunRef.current = null;
      fileInputRef.current.value = null;
    }
  }))

  const handleImageSelect = async(e) => {

    if(disableMessage){
      toast.error(disableMessage);
      return
    }

    setIsPreview(false);
    
    const file = e.target.files[0];
    
    if(file){

      if(validFormats.length && !isValidFileType(validFormats, file)){
        toast.error('File type not supported');
        return
      }

      // set result as non cropped file
      const dimen = await getImageDimensions(file);
      if(outPutDimen && dimen){
        if(outPutDimen.width === dimen.width && outPutDimen.height === dimen.height){
          const thumb = await resizeImageFile(file,thumbDimen.width, thumbDimen.height, 0.7)
          onImageCrop({file, thumb});
        }
      }

      setImgSrc(null);
      setFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result);
        setOriginalFile(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleCrop = useCallback(async() => {

    setIsPreview(true)
    if(cropFunRef.current){
      const imageBlob = await cropFunRef.current(outPutDimen);
      const thumBlob = await cropFunRef.current(thumbDimen);

      const file = blobToFile(imageBlob, filename.replace(/\.[^/.]+$/,''));
      file.id = Date.now();

      const thumb = blobToFile(thumBlob, filename.replace(/\.[^/.]+$/,''));
      thumb.id = file.id;

      setCroppedFile(file);
      onImageCrop({file, thumb})
      /* set to preview */
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result);
      }
      reader.readAsDataURL(file);
    }

  },[croppedFile, onImageCrop, filename])

  const handleResetImage = () => {
    if(originalFile) setImgSrc(originalFile);
  }

  return (
    <div className={containerClass}>

      <div className={`relative ${wrapperClass}`}>
        <div className={`${cropperClass}`}>
        
          {isPreview ? (
            <img src={imgSrc} className='object-contain w-full border-12 border-white' alt="preview" 
              onError={e => console.log(e.nativeEvent)} 
            />
          ):(
            imgSrc ? (
              <ImageCropper 
                imageSrc={imgSrc}
                onCrop={(cropFunction) => cropFunRef.current = cropFunction}
                outPutDimen={outPutDimen}
                format={outputFormat}
                className='!w-full !h-full'
              />
            ): (
              <div className='flex flex-col items-center justify-center w-full h-full bg-gray-100'>
                <IoImageOutline size={50} className='text-gray-300'/>
                <span className='text-gray-400'>no image</span>
              </div>
              )
            )
          }
        </div>
        {/* crop image buttons */}
        <div className={`absolute ${buttonsClass}`}>

          {/* browse image */}
          <label 
            htmlFor='category-image'
            className='w-9 h-9 inline-flex items-center justify-center
            cursor-pointer border border-gray-300 p-1 rounded-xl transition-all duration-300
            hover:border-primary-300 hover:!text-primary-400 hover:shadow-md/10
            hover:scale-105 !text-gray-600'>

            <MdImageSearch size={23}/>

          </label>

          {/* crop reset */}
          <span 
            onClick={handleResetImage}
            className='w-9 h-9 inline-flex items-center justify-center
            cursor-pointer border border-gray-300 rounded-xl transition-all duration-300
            hover:border-primary-300  hover:text-primary-400 hover:shadow-md/10
            hover:scale-105'>
            <BiReset size={23}/>
          </span>

          {/* crop */}
          <span 
            onClick={handleCrop}
            className='w-9 h-9 inline-flex items-center justify-center
            cursor-pointer border border-gray-300 rounded-xl transition-all duration-300
            hover:border-primary-300  hover:text-primary-400 hover:shadow-md/10
            hover:scale-105'>
            <IoCrop size={23}/>
          </span>
          {/* view */}
          <span 
            onClick={() => setIsPreview(true)}
            className='w-9 h-9 inline-flex items-center justify-center
            cursor-pointer border border-gray-300 rounded-xl transition-all duration-300
            hover:border-primary-300  hover:text-primary-400 hover:shadow-md/10
            hover:scale-105'>
            <LuEye size={23}/>
          </span>
          {/* edit */}
          <span 
            onClick={() => setIsPreview(false)}
            className='w-9 h-9 inline-flex items-center justify-center
            cursor-pointer border border-gray-300 rounded-xl transition-all duration-300
            hover:border-primary-300  hover:text-primary-400 hover:shadow-md/10
            hover:scale-105'>
            <RiImageEditLine size={23}/>
          </span>

        </div>
      </div>
      <input 
        type="file" 
        /* multiple = {multiSelect} *///not implimented
        id="category-image" 
        accept='image/*' 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        hidden 
        />
      
    </div>
  )
};

const CropperWindow = React.memo(forwardRef(CropperWindowComponent));

export default CropperWindow