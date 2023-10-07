import { useEffect, useRef } from "react";
import axios from "axios";
import { AuthAxios } from "../helpers/axiosInstance";
import { useNavigate,useLocation } from "react-router-dom";
import { RefreshToken } from "../helpers/getRefreshToken";
import Cookies from "js-cookie";

export  function ResponseInterceptor() {
  const interceptorId = useRef(null);
  const navigate = useNavigate();
  const location = useLocation()
  console.log(location)
  useEffect(() => {
    interceptorId.current = AuthAxios.interceptors.response.use(
      async (res) => {
        return res;
      },
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest._retry && error.response.status === 401) {
          originalRequest._retry = true;

          try {
            let res = await RefreshToken();

            if (res) {
              Cookies.set("authToken", res?.access_token, { expires: 7 });
              Cookies.set("refreshToken", res?.refreshToken, { expires: 7 });
              AuthAxios.defaults.headers.common["Authorization"] =
                "Bearer " + res?.access_token;
              return AuthAxios(originalRequest);
            } else {
              throw new Error("Error refreshing token"); // Throw an error if no new access token is obtained
            }
          } catch (error) {
            // Handle the error here (e.g., log it, show a message to the user, etc.)
            navigate("/", {state:{ prevUrl: location.pathname }} );
            localStorage.clear()
            console.log('logout')
            console.error("Error:", error);

            // You can re-throw the error or return a rejected Promise
            return Promise.reject(error);
          }
        }

        // If it's not a 401 error or if the request has already been retried, reject the error
        return Promise.reject(error);
      }
    );

    return () => {
      AuthAxios.interceptors.response.eject(interceptorId.current);
    };
  }, []);

  return null;
}
