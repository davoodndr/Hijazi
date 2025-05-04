import React from 'react'
import toast from 'react-hot-toast'


const AxiosToast = (result, error = true) => {

  if(!result || (!result.response && error) || (!result.data && !error)){
    console.log(result)
    // some times result getting inside
    result = typeof result === 'object' ? result.message : result;
    return toast.error(result || "Unknown error occured");
  }

  return error ?
   toast.error(result?.response?.data?.message || response.message)
   :
   toast.success(result?.data?.message);
}

export default AxiosToast