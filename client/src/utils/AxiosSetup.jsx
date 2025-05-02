import axios from 'axios'
import ApiBucket from '../services/ApiBucket';

const SERVER_URL = import.meta.env.VITE_BACK_END_URL;

export const Axios = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true
})

//to include the access token for every request
Axios.interceptors.request.use(
  async(config) => {
    
    const accesstoken = localStorage.getItem('accessToken');

    if(!typeof accesstoken === 'string') return Promise.reject(error);
    
    if(accesstoken){
      config.headers.Authorization = `Bearer ${accesstoken}`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

//extend the access token life (refresh token)
Axios.interceptors.response.use(
  
  (response) => response,

  async(error) => {

    let originalReq = error.config;
    
    // three conditions must, else it will loop request
    if(error.response?.status === 401 && !originalReq.retry && !originalReq.url.includes('/refresh-token')){
      originalReq.retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if(refreshToken){
        try {
          const newToken = await refreshAccessToken(refreshToken);

          if(newToken){
            localStorage.setItem('accessToken', newToken);
            originalReq.headers.Authorization = `Bearer ${newToken}`;
            return Axios(originalReq);
          }
        } catch (error) {
          console.error('Refresh token failed', err);
        }
      }
    }

    return Promise.reject(error);
  }
)

const refreshAccessToken = async(refreshToken) => {

  try {
    
    const response = await Axios({
      ...ApiBucket.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })

    const token = response.data.newAccessToken;
    console.log('token', token)
    localStorage.setItem('accessToken',token);
    return token

  } catch (error) {
    console.log(error)
  }

}