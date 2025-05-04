import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoCrop, IoImageOutline } from 'react-icons/io5';
import { LuEye } from 'react-icons/lu';
import { BiReset } from "react-icons/bi";
import { blobToFile, isValidFileType } from '../../utils/Utils';
import { MdImageSearch } from 'react-icons/md';
import ImageCropper from './ImageCropper';
import toast from 'react-hot-toast';


function CropperWindow({
  buttonsClass = '', 
  cropperClass = '', 
  outPutDimen, 
  outputFormat, 
  onImageCrop, 
  src,
  validFormats
}

) {

  const cropFunRef = useRef(null);
  const [filename, setFilename] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  const handleImageSelect = async(e) => {

    setIsPreview(false);
    
    const file = e.target.files[0];
    
    if(file){

      // set result as non cropped file
      onImageCrop(file);

      if(validFormats.length && !isValidFileType(validFormats, file)){
        toast.error('File type not supported');
        return
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

  const handleReset = () => {
    if(originalFile) setImgSrc(originalFile);
  }

  return (
    <div className='flex flex-col w-full h-full items-center justify-between'>
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
      <input type="file" id="category-image" accept='image/*' onChange={handleImageSelect} hidden />
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

          {/* reset */}
          <span 
            onClick={handleReset}
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
          
        </div>

      </div>
    </div>
  )
}

export default CropperWindow