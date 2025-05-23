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

export const uploadProductImages = async(product, product_id, remove_ids = []) => {

  try {
            
    const formData = new FormData();
    const slug = product.slug.replaceAll('-','_')
    

    product?.files?.forEach((file,i) => {
      if(file instanceof File){
        formData.append('productImages', file);
        formData.append('productImageIds[]', `product_${slug}_${i + 1}`);
      }
    });
    
    const variants = product?.variants;
    if(variants && variants.length){
      variants.forEach((item, i) => {
        if(item.image && item.image instanceof File){
          formData.append('variantImages', item.image);
          formData.append('variantImageIds[]', `@variant_${slug}_${item.sku}`)
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

