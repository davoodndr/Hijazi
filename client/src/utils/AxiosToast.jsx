import React from 'react'
import toast from 'react-hot-toast'


const AxiosToast = (result, error = true) => {
  //console.log(result)
  return error ?
   toast.error(result?.response?.data?.message || response.message)
   :
   toast.success(result?.data?.message);
}

export default AxiosToast