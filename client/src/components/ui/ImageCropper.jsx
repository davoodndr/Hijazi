import React, { useState, useCallback, useEffect} from 'react';
import Cropper from 'react-easy-crop';
import useSafeImage from '../../hooks/useSafeImage'
import toast from 'react-hot-toast';

const ImageCropper = ({ 
  imageSrc, className = '', format = 'jpeg', onCrop, outPutDimen
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { loaded, error } = useSafeImage(imageSrc);

  if(error){
    toast.error("Image failed to load, please choose another one.");
    return;
  }

  useEffect(() => {

    if(onCrop && typeof onCrop === 'function'){
      onCrop(() => getCroppedImg(imageSrc, croppedAreaPixels, format, outPutDimen));
    }

  },[imageSrc, croppedAreaPixels, onCrop])


  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  return (
    <>
      <div 
        className={`relative ${className}`}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          
        />
      </div>
    </>
  );
};

const getCroppedImg = (imageSrc, crop, format, outPutDimen)=> {

  if(!outPutDimen){
    outPutDimen = {
      width: crop.width,
      height: crop.height
    }
  }

  return new Promise((resolve, reject) => {

    const outputWidth = typeof outPutDimen === 'number' ? outPutDimen : outPutDimen.width;
    const outputHeight = typeof outPutDimen === 'number' ? outPutDimen : outPutDimen.height;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(blob);
        },
        `image/${format}`,
        0.7 // quality (1 = highest)
      );
    };

    image.onerror = (e) => reject(e);
  });
}

export default ImageCropper;