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
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retry && error.response.status === 401 ) {
      originalRequest._retry = true;

      try {
        let res = await RefreshToken();
        
        if (res) {
          Cookies.set('authToken', res?.access_token, { expires: 7 });
          Cookies.set('refreshToken', res?.refreshToken, { expires: 7 });
          AuthAxios.defaults.headers.common['Authorization'] = 'Bearer ' + res?.access_token;
          return AuthAxios(originalRequest);
        } else {
          throw new Error('Error refreshing token'); // Throw an error if no new access token is obtained
        }
      } catch (error) {
        // Handle the error here (e.g., log it, show a message to the user, etc.)
        console.error('Error:', error);

        // You can re-throw the error or return a rejected Promise
        return Promise.reject(error);
      }
    }

    // If it's not a 401 error or if the request has already been retried, reject the error
    return Promise.reject(error);
  }
);
