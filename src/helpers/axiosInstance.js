import Axios from "axios";
import { RefreshToken } from "./getRefreshToken";
import Cookies from "js-cookie";

export const AuthAxios = Axios.create({
  baseURL: "https://check-server-api-staging.herokuapp.com/api/v1",
  withCredentials: false,
});
export const BaseAxios =  Axios.create({
  baseURL: "https://check-server-api-staging.herokuapp.com/api/v1",
  withCredentials: false,
})

AuthAxios.interceptors.request.use(
  async (config) => {
    // let data = await RefreshToken();
    // if (data){
    //   Cookies.set("authToken", data?.access_token);
    //   Cookies.set("refreshToken", data?.refreshToken);
    // }
    let token  = Cookies.get('authToken')


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

AuthAxios.interceptors.response.use(
 async (res) => {
    return res;
  },
  async(error) => {

    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
          let res  =  await RefreshToken()
          console.log(res)
        if (res) {
          Cookies.set('authToken', res?.access_token);
          Cookies.set('refreshToken', res?.refreshToken);
          AuthAxios.defaults.headers.common['Authorization'] = 'Bearer ' + res?.access_token;
          return AuthAxios(originalRequest);
        } 
        else {
          // If there is no new access token, redirect to login page
          window.location.href = '/'
          return Promise.reject(error);
        }
  }
  }
)
