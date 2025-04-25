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
Axios.interceptors.request.use(
  (response) => response,
  async(error) => {

    let originalReq = error.config;

    if(error.response.staus === 401 && !originalReq.retry){
      originalReq.retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if(refreshToken){
        const newToken = await refreshAccessToken(refreshToken);

        if(newToken){

          originalReq.headers.Authorization = `Bearer ${newToken}`;
          return Axios(originalReq);

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

    const token = response.data.data.accessToken;
    localStorage.setItem('accessToken',token);
    return token

  } catch (error) {
    console.log(error)
  }

}