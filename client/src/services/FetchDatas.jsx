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