
import { Axios } from "../utils/AxiosSetup";
import { loadRazorpay } from "../services/Payments";
import ApiBucket from "./ApiBucket";

//users
export const userLoginAction = async(data) => {
  try {
    
    const response = await Axios({
      ...ApiBucket.login,
      data
    })

    return response;

  } catch (error) {
    console.log(error?.response?.data);
    throw new Error(error?.response?.data?.message);
  }
}

export const googleAuthAction = async(tokenResponse, role) => {
  try {
    
    const response = await Axios({
      ...ApiBucket.google,
      data : {
        code: tokenResponse.code,
        role
      }
    })

    return response;

  } catch (error) {
    console.log(error?.response?.data);
    throw new Error(error?.response?.data?.message);
  }
}

export const userLogoutAction = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.logout
    })

    return response;

  } catch (error) {
    console.log(error?.response?.data);
    throw new Error(error?.response?.data?.message);
  }
}

export const addUserAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addUser,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateUserAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateUser,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

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

export const updateUserRole = async(role) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.updateUserRole,
      data: {role}
    })

    return response?.data?.user

  } catch (error) {
    //console.log(error?.response)
    throw new Error(error?.response?.data?.message)
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


// products
export const createProductAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addProduct,
      data
    })

    return response;
    
  } catch (error) {

    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateProductAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateProduct,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

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

    return response.data;

  } catch (error) {
    console.log(error?.response?.data?.message || error)
    return error
  }

}

export const changeProductStatusAction = async({product_id, status, visibility, archived}) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeProductStatus,
      data: {
        product_id,
        status,
        visibility,
        archived
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

// category
export const addCategoryAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addCategory,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateCategoryAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateCategory,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
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

export const changeCategoryStatusAction = async(category_id, status) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeCategoryStatus,
      data: {
        category_id,
        status,
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

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
    throw new Error(error?.response?.data?.message || error?.message)
  }
}

//brand
export const addBrandAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addBrand,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateBrandAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateBrand,
      data
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const changeBrandStatusAction = async(brand_id, status) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeBrandStatus,
      data: {
        brand_id,
        status,
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

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
    throw new Error(error?.response?.data?.message || error?.message)
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

//cart
export const addToCartAction = async(item) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.addToCart,
      data: item
    })

    return response;

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const removeFromCartAction = async(item_id) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.removeFromCart,
      data: { item_id }
    })

    return response;

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const emptyCartAction = async() => {

  try {
    
    const response = await Axios({
      ...ApiBucket.clearCart
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
      data: item
    })

    return response;

  } catch (error) {

    console.log(error?.response?.data)
    throw new Error(error?.response?.data?.message);
  }

}

export const removeFromWishlistAction = async(item_id) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.removeFromWishlist,
      data: { item_id }
    })

    return response

  } catch (error) {

    console.log(error?.response?.data)
    throw new Error(error?.response?.data?.message);
  }

}

// address
export const addNewAddressAction = async(data) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.addNewAddress,
      data
    })

    return response

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const makeDefaultAddressAction = async(data) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.makeAddressDefault,
      data
    })

    return response.data

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const removeAddressAction = async(id) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.removeAddress,
      data: {address_id: id}
    })

    return response.data

  } catch (error) {
    console.log(error)
    throw new Error(error?.response?.data?.message)
  }

}

// payment
export const createRazorpayOrder = async(amount, reciept_no) => {
  
  try {

    const response = await Axios({
      ...ApiBucket.createRazorpayOrder,
      data: {
        amount,
        receipt: reciept_no
      }
    })

    return response
    
  } catch (error) {
    console.log(error)
    return error
  }

}

export const processRazorpayAction = async(cash, prefill, reciept_no) => {

  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  try {

    const res = await loadRazorpay();
    if(!res){
      throw new Error("Razorpay SDK failed to load");
    }
    
    const orderResponse = await createRazorpayOrder(cash, reciept_no)

    const {id: order_id, currency, amount } = orderResponse?.data?.order;

    const paymentResponse = await new Promise((resolve, reject) => {

      const options = {
        key: RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Hijazi", // app name
        order_id,
        /* image: "logo", */
        handler: function(response) {
          resolve(response);
        },
        prefill,
        theme: {
          color: '#4cc4bb'
        },
        modal: {
          ondismiss: function() {
            reject(new Error("Payment popup closed by user"))
          }
        }
      }

      const paymentObj = new window.Razorpay(options);
      paymentObj.open();

    })

    return paymentResponse

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message || error.message);
  }

}

export const verifyRazorpayAction = async(res) => {
  try {

    const response = await Axios({
      ...ApiBucket.varifyRazorpay,
      data: {
        ...res
      }
    })

    return response.data.result
    
  } catch (error) {
    console.log(error)
    throw new Error(error?.response?.data?.message);
  }
}

// orders
export const placeOrderAction = async(order) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.placeOrder,
      data: { ...order }
    })

    return response;

  } catch (error) {

    console.log(error)
    throw new Error(error?.response?.data?.message);
  }

}

export const getOrder = async(id, user_id) => {

  try {

    const response = await Axios({
      ...ApiBucket.fetchOrder,
      params: {
        user_id,
        order_id: id
      }
    })

    return response?.data?.order
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message);
  }

}

export const changeOrderStatusAction = async(order_id, status) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeOrderStatus,
      data: {
        order_id,
        status,
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const cancelItem = async(order_id, item_id, reason) => {

  try {

    const response = await Axios({
      ...ApiBucket.cancelItem,
      data: {
        order_id,
        item_id,
        reason
      }
    })

    return response
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const cancelOrder = async(order_id, reason) => {

  try {

    const response = await Axios({
      ...ApiBucket.cancelOrder,
      data: {
        order_id,
        reason
      }
    })

    return response
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

// offers
export const createOfferAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addOffer,
      data
    })

    return response;
    
  } catch (error) {

    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateOfferAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateOffer,
      data
    })

    return response;
    
  } catch (error) {

    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const changeOfferStatusAction = async(offer_id, status) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeOfferStatus,
      data: {
        offer_id,
        status,
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const deleteOfferAction = async(offer_id) => {

  try {

    const response = await Axios({
      ...ApiBucket.deleteOffer,
      params: { offer_id },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

/* wallet */
export const addFundAction = async(data) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.addFund,
      data
    })

    return response;

  } catch (error) {
    console.log(error)
    throw new Error(error?.response?.data?.message)
  }

}

export const withdrawFundAction = async(data) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.withdrawFund,
      data
    })

    return response;

  } catch (error) {
    console.log(error)
    throw new Error(error?.response?.data?.message)
  }

}

/* review */
export const addReviewAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.addReview,
      data
    })

    return response?.data;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const updateReviewAction = async(data) => {

  try {

    const response = await Axios({
      ...ApiBucket.updateReview,
      data
    })

    return response?.data?.updated;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const changeReviewStatusAction = async(review_id, status) => {

  try {

    const response = await Axios({
      ...ApiBucket.changeReviewStatus,
      data: {
        review_id,
        status,
      },
    })

    return response;
    
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}