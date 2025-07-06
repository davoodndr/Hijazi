import { Axios } from "./AxiosSetup";
import AxiosToast from "./AxiosToast";

export const hexToRgba = (hex, alpha = 100) => {

  if (typeof hex !== 'string' || !/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Invalid hex color format. Expected format: #RRGGBB');
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

export const capitalize = (value) => {
  return value?.charAt(0).toUpperCase() + value?.slice(1);
}

export function isEmailValid(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type });
};

export const isValidName = (name) => name.length > 2;

// remove all blank fileds
export const finalizeValues = (data) => {
  const filtered = Object.entries(data).filter(([_,value]) => {
    if (value === "" || value === null || value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if(typeof value === 'object' && Object.keys(value).length === 0) return false;
    return true;
  });

  return Object.fromEntries(filtered)
}

// check input is a valid file
export const isValidFile = (file) => {

  return file instanceof File;
}

// to check valid file type
export const isValidFileType = (validFormats, file) => {

  if(!Array.isArray(validFormats)) throw new Error("Expects array for valid formats")

  validFormats = validFormats.map(item => `image/${item}`);
  return validFormats.includes(file.type)
}

// checks all field contain data
export const isValidDatas = (fields, data) => {
  if(!Array.isArray(fields)) throw new Error("Expects array for valid formats")
  
  return fields.every(item => {
    const value = data[item];
  
    if (Array.isArray(value)) {
      return value.length > 0;
    }
  
    if (typeof value === 'string') {
      return value && value.trim() !== '';
    }

    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0 || value instanceof Date;
    }
  
    return value !== null && value !== undefined;
  });
}

// to extract image dimen
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => reject(new Error("Not valid image, select another one"));
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
};

// convert file to src
export const imageFileToSrc = (file) => {
  
  if(!file || !isValidFile(file)) return;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}

// check object value is blank
export function hasBlankObjectValue(obj, exceptions = []) {
  return Object.entries(obj).some(([key, value]) => {

    if(exceptions.includes(key)){
      return false;
    }

    if (typeof value === 'object' && value !== null) {
      return hasBlankObjectValue(value);
    }
    return value === '' || value == null;
  });
}

export function findDuplicateAttribute(attributes){
  const set = new Set();
  for(let item of attributes){
    if(set.has(item.name)) return true;
    set.add(item.name)
  }
  return false;
}

export const fetchImageAsFile = async(url, filename = 'image')=> {

  try {
    
    //axios not giving the blob

    const response = await fetch(url, {
      mode: 'cors'
    });
    
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;

  } catch (error) {
    console.log(error)
    AxiosToast(error)
  }
  

  
}

export const getEffectivePrice = (product) => {
  if (product.price != null) return product.price;

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const variantPrices = product.variants
      .map(v => v.price)
      .filter(p => p != null);

    return variantPrices.length > 0 ? Math.min(...variantPrices) : Infinity;
  }

  return Infinity;
}

export const sortProductsByPrice = (products, order = 'asc') => {
  return [...products].sort((a, b) => {
    const priceA = getEffectivePrice(a);
    const priceB = getEffectivePrice(b);

    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

export const resizeImageFile = async(file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let { width, height } = img;

      // Resize keeping aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width *= scale;
        height *= scale;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        },
        file.type,
        quality // e.g., 0.8 for 80% quality
      );
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const utcDate = (localDate) => {
  if(localDate && localDate instanceof Date){
    return new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    ))
  }
}
