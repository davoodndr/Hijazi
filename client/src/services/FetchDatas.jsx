import ApiBucket from "./ApiBucket"
import { Axios } from "../utils/AxiosSetup"

export const getUserDetail = async() => {

  try {
    
    const response = await Axios({
      ...ApiBucket.fatchUser
    })

    return response.data.user;

  } catch (error) {
    console.log(error.response.data)
    //return error.response.data // it will return the user data not null
  }

}

/* ------ user side -------- */

/* category */
export const getCategories = async() => {
  try {
    
    const response = await Axios({
      ...ApiBucket.getCategortList
    })

    return response.data.categories;

  } catch (error) {
    console.log(error.response.data)
    return error.response.data
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
    //return error.response.data
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

export const menus = [
    {label: 'home', href: '/'},
    {label: 'about', href: ''},
    {label: 'categories', href: '',
      submenu: [
        {label: 'clothing', href: '',
          items: [
            'Men Formals', 'Men Casuals',
            'Woman Formals', 'Woman Casuals'
          ]
        },
        {label: 'foot wears', href: '',
          items: [
            'slips','shoes','lightweight','washable'
          ]
        },
      ]
    },
    {label: 'policies', href: ''},
    {label: 'contact', href: ''},
  ]