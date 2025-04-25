import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import AxiosToast from "../utils/AxiosToast";
import ApiBucket from "./ApiBucket";
import { Axios } from "../utils/AxiosSetup";
import { logoutUser, setUser } from "../store/slices/UsersSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { getUserDetail } from "./FetchDatas";

export const useLogout = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async() => {
    try {
    
      const response = await Axios({
        ...ApiBucket.logout
      })
  
      if(response.data.success){
        dispatch(logoutUser());
        localStorage.clear();
        AxiosToast(response, false);
        navigate('/')
      }
  
    } catch (error) {
      console.log(error)
      AxiosToast(error);
    }
  }

  return logout;
}

export const useGoogleAuth = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goodleLogin = useGoogleLogin({
  
      flow: 'auth-code',
      onSuccess: async(tokenResponse) => {
  
        try {
  
          const response = await Axios({
            ...ApiBucket.google,
            data : {
              code: tokenResponse.code
            }
          })
  
          if(response.data.success){
            AxiosToast(response, false);
  
            localStorage.setItem('accessToken',response.data.accessToken);
            localStorage.setItem('refreshToken',response.data.refreshToken);
  
            const userData = await getUserDetail();
  
            dispatch(setUser({user: userData}));
            navigate('/');
          }
  
        } catch (error) {
          console.log(error)
          AxiosToast(error)
        }
  
      }
    })

  return goodleLogin;
}