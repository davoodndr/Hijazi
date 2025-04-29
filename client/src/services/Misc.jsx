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
    AxiosToast(error);
  }

}