import Axios from "axios";
import { RefreshToken } from "./getRefreshToken";
import Cookies from "js-cookie";

export const AuthAxios = Axios.create({
  baseURL: "https://check-server-api-staging.herokuapp.com/api/v1",
  withCredentials: false,
});

AuthAxios.interceptors.request.use(
  function (config) {
    let token = Cookies.get("authToken");
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
  (res) => {
    return res;
  },
  async(error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return RefreshToken().then((res) => {
        Cookies.set("authToken", res.data?.access_token);
        Cookies.set("refreshToken", res.data?.refreshToken);
        console.log(res.data);
        AuthAxios.defaults.headers.common["Authorization"] =
          "Bearer " + res.data?.access_token;
        return AuthAxios(originalRequest);
      }).catch(err=>{
        if(err.response.status === 401 || err.response.status === 403 ){
          window.location.href = '/'
        }}
         )
    }

    return Promise.reject(error);
  }
);
