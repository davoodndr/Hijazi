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