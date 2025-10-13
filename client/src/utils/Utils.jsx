import { useMemo } from "react";
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
    if(typeof value === 'object' && !(value instanceof Date) && Object.keys(value).length === 0) return false;
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
  let utc;
  if(localDate && localDate instanceof Date){
    utc = localDate
  }else{
    utc = new Date(localDate)
  }
  return new Date(Date.UTC(
    utc?.getFullYear(),
    utc?.getMonth(),
    utc?.getDate(),
    utc?.getHours(),
    utc?.getMinutes(),
    utc?.getSeconds()
  ))
}

export const filterDiscountOffers = (offersList, product, activeVariant) => {
  const bestPrice = product?.variants?.reduce((max, cur) => 
    max && max?.price > cur?.price ? max?.price : cur?.price, 0
  )
  const price = (bestPrice || activeVariant?.price || product?.price);

  return offersList?.filter(el => {
    const isGeneralOffer = !el?.applicableCategories?.length && !el?.applicableProducts?.length;
    const isCategoryMatch = el?.applicableCategories?.some(slug =>
      slug === product?.category?.slug || slug === product?.category?.parentId?.slug
    );
    const isProductMatch = el?.applicableProducts?.some(sku => sku === product?.sku || sku === activeVariant?.sku);
    const meetsMinPurchase = price >= el?.minPurchase;

      if(el?.type !== 'coupon'){
        //console.log(item?.name, isGeneralOffer, el?.applicableCategories)
        return (isGeneralOffer && meetsMinPurchase) || isCategoryMatch || isProductMatch;
      }

      return (isGeneralOffer || isCategoryMatch || isProductMatch) && meetsMinPurchase;
  });
}

export const calculateDiscount = (item, price) => {
  if (item?.discountType === 'percentage') {
    const calculated = price * (item.discountValue / 100);
    return item.maxDiscount ? Math.min(calculated, item.maxDiscount) : calculated;
  }
  return item?.discountValue || 0;
}

export  const findBestOffer = (offers, price) => {
    if (!offers?.length || !price) return null;

    return offers.reduce((best, current) => {
      const currentValue = calculateDiscount(current, price);
      if(currentValue > best.discount){
        return {
          discount: current.discountValue,
          value: currentValue,
          min: current?.minPurchase,
          max: current?.maxDiscount,
          endDate: current?.endDate,
          type: current?.type,
          discountType: current.discountType,
          title: current?.title,
          id: current._id
        }
      }
      return best
    }, {id: null,
        discount: 0,
        value: 0,
        min: 0,
        max: 0,
        endDate: null,
        type: null,
        discountType: null,
        title: null
      }
    );
}

export const findBestCouponValue = (coupons, price) => {
  if (!coupons?.length || !price) return 0;

  return coupons.reduce((max, current) => {
    const currentValue = calculateDiscount(current, price);
    return currentValue > max ? currentValue : max;
  }, 0);
}

export const getRatingDistribution = (reviews) =>{
  
  const total = reviews?.length;
  const counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews?.forEach((review) => {
    const r = Math.round(review.rating);
    if (r >= 1 && r <= 5) {
      counts[r]++;
    }
  });

  const percentages = Object.fromEntries(
    Object.entries(counts).map(([star, count]) => [
      star,
      total ? parseFloat(((count / total) * 100).toFixed(2)) : 0,
    ])
  );

  return percentages;
}

export const getMinPricedVariant = (variants) => {
  return variants?.reduce((min, current) =>
    !min || current?.price < min?.price ? current : min,
    null
  );
};

export const filterData = (searchQuery = null, filter = null, list = [], fields = []) => {
  return list?.filter(item =>{

    if(searchQuery){
      return fields.some(field => {

        if(item && item[field]){
          return item[field]?.includes(searchQuery?.toLowerCase())
        }
        return false

      })
    }else{

      if(!filter || !Object.keys(filter).length) return item;
      const [[key, value]] = Object.entries(filter)

      return item[key]?.includes(value)
    }

  });
}

export const sortData = (currentSort = null, list)=> {

  const field = currentSort?.field;

  if (!list || !field) return;

  return [...list]?.sort((a, b) => {
    const aVal = field?.includes('.') ? field.split('.').reduce((acc, key) => acc?.[key], a) :  a[field];
    const bVal = field?.includes('.') ? field.split('.').reduce((acc, key) => acc?.[key], b) : b[field];

    if(typeof aVal === 'string'){
      return currentSort?.ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    const res = currentSort?.ascending ? 
        (aVal > bVal ? 1 : aVal < bVal ? -1 : 0)
      : (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);


    return res

  })
        
}