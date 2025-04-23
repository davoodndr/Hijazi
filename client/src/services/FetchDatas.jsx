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