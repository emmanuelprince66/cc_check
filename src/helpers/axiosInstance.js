import Axios from "axios";
import { RefreshToken } from "./getRefreshToken";
import Cookies from "js-cookie";

export const AuthAxios = Axios.create({
  baseURL: "https://check-server-api-staging.herokuapp.com/api/v1",
  withCredentials: false,
});

AuthAxios.interceptors.request.use(
  async function (config) {
   let data = await RefreshToken()
    if (data) {
      config.headers.Authorization = `Bearer ${data.access_token}`;
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
    return Promise.reject(error);
  }
);
