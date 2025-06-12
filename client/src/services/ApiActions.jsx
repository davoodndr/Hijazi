import { removeItem } from "motion/react";
import { Axios } from "../utils/AxiosSetup";
import AxiosToast from "../utils/AxiosToast";
import ApiBucket from "./ApiBucket";


export const uploadAvatar = async(user_id, file, public_id= "") => {

  try {
            
    const imageData = new FormData();
    imageData.append('avatar', file)
    imageData.append('public_id', public_id)
    imageData.append('custom_user_id',user_id)

    const response = await Axios({
      ...ApiBucket.addProfileImage,
      data: imageData
    })

    return response.data.avatar;

  } catch (error) {
    return error
  }

}

export const uploadSingleImage = async(folder, fieldName, file, public_id= "") => {

  try {
            
    const imageData = new FormData();
    imageData.append(fieldName, file)
    imageData.append('public_id', public_id)
    imageData.append('folder',folder)

    const response = await Axios({
      ...ApiBucket.uploadSingleImage,
      data: imageData
    })

    return response.data.avatar;

  } catch (error) {
    return error
  }

}

export const uploadCategoryImage = async(category_id, folder, files, public_id) => {

  try {

    const imageData = new FormData();
    imageData.append('image', files.file)
    imageData.append('public_id', public_id.file)
    imageData.append('image', files.thumb)
    imageData.append('public_id', public_id.thumb)
    imageData.append('folder',folder)
    imageData.append('category_id',category_id)

    const response = await Axios({
      ...ApiBucket.uploadCategoryImage,
      data: imageData,
      /* params: {fieldName} */
    })

    return response.data;

  } catch (error) {
    return error
  }

}

export const uploadBrandLogo = async(brand_id, folder, file, public_id= "") => {

  try {
            
    const imageData = new FormData();
    imageData.append('image', file)
    imageData.append('public_id', public_id)
    imageData.append('folder',folder)
    imageData.append('brand_id',brand_id)

    const response = await Axios({
      ...ApiBucket.uploadBrandLogo,
      data: imageData,
      /* params: {fieldName} */
    })

    return response.data.logo;

  } catch (error) {
    return error
  }

}

// bloch or unblock user
export const blockUserAction = async(user_id, mode) => {

  try {

    let response;
    
    if(mode === 'block'){
      response = await Axios({
        ...ApiBucket.blockUser,
        data:{user_id}
      })
    }else{
      response = await Axios({
        ...ApiBucket.unblockUser,
        data:{user_id}
      })
    }

    return response

  } catch (error) {
    return error
  }
}

// bloch or unblock user
export const deleteUserAction = async(folder, user_id) => {

  try {

    const response = await Axios({
      ...ApiBucket.deleteUser,
      data: {
        user_id, 
        folder  // image containing folder
      }
    })

    return response

  } catch (error) {
    return error
  }
}

// delete category
export const deleteCategoryAction = async(folder, category_id) => {

  try {

    const response = await Axios({
      ...ApiBucket.deleteCategory,
      data: {
        category_id, 
        folder  // image containing folder
      }
    })

    return response

  } catch (error) {
    return error
  }
}

// delete brand
export const deleteBrandAction = async(folder, brand_id) => {

  try {

    const response = await Axios({
      ...ApiBucket.deleteBrand,
      data: {
        brand_id, 
        folder  // image containing folder
      }
    })

    return response

  } catch (error) {
    return error
  }
}

// products
export const uploadProductImages = async(product, product_id, remove_ids = []) => {

  try {
            
    const formData = new FormData();
    const slug = product.slug.replaceAll('-','_')
    

    product?.files?.forEach((item,i) => {
      if(item.file instanceof File){
        formData.append('productImages', item.file);
        formData.append('productImageIds[]', `product_${slug}_${i + 1}`);
        formData.append('productImages', item.thumb);
        formData.append('productImageIds[]', `product_${slug}_${i + 1}_thumb`);
      }
    });
    
    
    const variants = product?.variants;
    if(variants && variants.length){
      variants.forEach((item, i) => {
        if(item.files && item.files.file instanceof File){
          formData.append('variantImages', item.files.file);
          formData.append('variantImageIds[]', `@variant_${slug}_${item.sku}`)
          formData.append('variantImages', item.files.thumb);
          formData.append('variantImageIds[]', `@variant_${slug}_${item.sku}_thumb`)
        }
      })
    }

    if(remove_ids.length){
      remove_ids.forEach(id => {
        formData.append('remove_ids[]', id);
      })
    }

    formData.append('folder',`products/${slug}`)
    formData.append('product_id',product_id)

    const response = await Axios({
      ...ApiBucket.uploadProductImages,
      data: formData
    })


    console.log(response.data)

    return response.data;

  } catch (error) {
    console.log(error?.response?.data?.message || error)
    return error
  }

}

//cart
export const addToCartAction = async(item, type) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.addToCart,
      data: {
        product_id: item.product_id,
        quantity: item.quantity,
        variant_id: item.id === item.product_id ? null : item.id,
        attributes: item.attributes,
        type
      }
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const removeFromCartAction = async(item) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.removeFromCart,
      data: {
        product_id: item.product_id,
        variant_id: item.id === item.product_id ? null : item.id,
      }
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

//wishlsit
export const addToWishlistAction = async(item) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.addToWishlist,
      data: {
        product_id: item.product_id,
        variant_id: item.id === item.product_id ? null : item.id,
        attributes: item.attributes
      }
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const removeFromWishlistAction = async(item) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.removeFromWishlist,
      data: {
        product_id: item.product_id,
        variant_id: item.id === item.product_id ? null : item.id,
      }
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

// address
export const addNewAddressAction = async(data) => {

  console.log(data)

  try {
    
    const response = await Axios({
      ...ApiBucket.addNewAddress,
      data
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}