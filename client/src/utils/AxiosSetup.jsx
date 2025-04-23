import axios from 'axios'

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

// /extend the access token life (refresh token)
Axios.interceptors.request.use(
  (response) => response,
  async(error) => {



    return Promise.reject(error)
  }
)