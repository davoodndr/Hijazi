import ApiBucket from "./ApiBucket"
import { Axios } from "../utils/AxiosSetup"

/* ------ shared actions -------- */

/* auth */
export const getUserDetail = async() => {

  try {
    
    const response = await Axios({
      ...ApiBucket.fatchUser
    })
    
    return response?.data?.user;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }

}

export const getWallet = async() => {
  
  try {
    

    const response = await Axios({
      ...ApiBucket.getWallet
    })

    return response?.data?.wallet
    
  } catch (error) {
    console.log(error);
    throw new Error(error?.response?.data?.message)
  }

}

export const getUserReviews = async(product_id) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.getProductReviews,
      params: { product_id }
    })

    return response?.data?.reviews

  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message)
  }

}

export const getCanRateProduct = async(user_id, product_id, variant_id) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.getCanRate,
      params: { user_id, product_id, variant_id }
    })

    return response?.data?.canRate

  } catch (error) {
    return error
  }

}


/* ------ user side -------- */

/* category */
export const getCategories = async() => {
  
  try {
    
    const response = await Axios({
      ...ApiBucket.getCategoryList
    })

    return response.data.categories;

  } catch (error) {
    console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* brand */
export const getBrands = async() => {
  
  try {
    
    const response = await Axios({
      ...ApiBucket.getBrandList
    })

    return response.data.brands;

  } catch (error) {
    console.log(error.response.data)
    return error.response.data
  }
}

/* product */
export const getSingleProduct = async(slug) => {
  try {
    
    const response = await Axios({
      ...ApiBucket.getProduct,
      params: {
        slug
      }
    })

    return response?.data?.product;

  } catch (error) {
    //console.log(error)
    return error;
  }
}

export const getProductList = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.getProductList
    })

    return response.data.products;

  } catch (error) {
    console.log(error.response.data)
    return error.response.data
  }
}

export const fetchRealtedItems = async(product) => {
  
  try {

    const response = await Axios({
      ...ApiBucket.getRelatedProducts,
      params:{
        product_id: product?._id,
        category: product?.category?._id
      }
    })

    return response?.data?.items

  } catch (error) {
    console.log(error)
  }

}

/* cart */
export const getCart = async() => {
  
  try {
    
    const response = await Axios({
      ...ApiBucket.getCart,
    })

    return response.data.cart.items;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* wishlist */
export const getWishlist = async() => {
  try {
    
    
    const response = await Axios({
      ...ApiBucket.getWishlist,
    })

    return response.data.wishlist;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* address */
export const getAddressList = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.getAddressList,
    })

    return response?.data?.addressList;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* orders */
export const getOrdersList = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.fetchOrders,
    })

    return response?.data?.orders;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* coupons */
export const getOffers = async() => {
  
  try {
    
    const response = await Axios({
      ...ApiBucket.getOffersList
    })

    return response.data.offers;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}
