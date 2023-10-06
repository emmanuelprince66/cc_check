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

