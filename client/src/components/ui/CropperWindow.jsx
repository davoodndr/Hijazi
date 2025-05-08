import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IoCrop, IoImageOutline } from 'react-icons/io5';
import { LuEye } from 'react-icons/lu';
import { RiImageEditLine } from "react-icons/ri";
import { BiReset } from "react-icons/bi";
import { blobToFile, getImageDimensions, isValidFileType } from '../../utils/Utils';
import { MdImageSearch } from 'react-icons/md';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';


const CropperWindow = React.memo(forwardRef(({
  buttonsClass = '', 
  cropperClass = '', 
  containerClass = '',
  outPutDimen, 
  outputFormat,
  disableMessage = "",
  onImageCrop = ()=> {}, 
  src,
  validFormats = ''
  
}, ref) => {

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
          onImageCrop(file);
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

    setIsPreview(false)
    if(cropFunRef.current){
      const blob = await cropFunRef.current()

      const file = blobToFile(blob, filename.replace(/\.[^/.]+$/,''));
      file.id = Date.now();

      setCroppedFile(file);
      onImageCrop(file)
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
      <div className={cropperClass}>
      
        {isPreview ? (
          <img src={imgSrc} className='object-contain w-full' alt="preview" 
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
      <input type="file" id="category-image" accept='image/*' ref={fileInputRef} onChange={handleImageSelect} hidden />
      {/* crop image buttons */}
      <div className={buttonsClass}>

        <div className='flex gap-2'>
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
        </div>

        <div className="flex gap-2">
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
    </div>
  )
}));

export default CropperWindow