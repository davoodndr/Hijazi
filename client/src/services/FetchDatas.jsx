import ApiBucket from "./ApiBucket"
import { Axios } from "../utils/AxiosSetup"

/* auth */
export const getUserDetail = async() => {

  try {
    
    const response = await Axios({
      ...ApiBucket.fatchUser
    })
    
    return response.data.user;

  } catch (error) {
    //console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
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

    return response.data.product;

  } catch (error) {
    console.log(error.response.data)
    return error.response.data
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

/* cart */
export const getCart = async() => {
  
  try {
    
    const response = await Axios({
      ...ApiBucket.getCart,
    })

    return response.data.cart.items;

  } catch (error) {
    console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* wishlist */
export const getWishlist = async() => {
  try {
    
    
    const response = await Axios({
      ...ApiBucket.getWishlist,
    })

    return response.data.wishlist.list;

  } catch (error) {
    console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* address */
export const getAddressList = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.getAddressList,
    })

    return response.data.addressList;

  } catch (error) {
    console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}

/* orders */
export const getOrdersList = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.fetchOrders,
    })

    return response.data.orders;

  } catch (error) {
    console.log(error.response.data)
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
    console.log(error.response.data)
    throw new Error(error?.response?.data?.message)
  }
}
