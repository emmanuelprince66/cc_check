import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Routess from "./containers/Routess";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./helpers/queryClient";
import { AuthProvider } from "./util/AuthContext";
import { Provider } from "react-redux";
import { getCookie } from "./util/cookieAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fillUserDetails } from "./util/slice/merchantSlice";
import { RefreshToken } from "./helpers/getRefreshToken";
import Cookies from "js-cookie";
import { getUser } from "./helpers/getUser";
import "./App.css";

function App() {
  // const [isRefreshing, setIsRefreshing] = useState(false);
const dispatch = useDispatch()
const {userDetails} = useSelector(state=>state.merchantReducer)
const [res, setRes] = useState(null);
  useEffect(() => {
    const getCookieValue = getCookie("authToken");
    if (!getCookieValue) {
      // localStorage.clear();
    }
  },[] )
  // useEffect(() => {
  //   const refreshTokenInterval = setInterval(async () => {
  //     const refreshedToken = await RefreshToken();
  //     if (refreshedToken) {
  //       setRes(refreshedToken);
  //       Cookies.set('authToken', refreshedToken?.access_token,{expires:7});
  //       Cookies.set('refreshToken', refreshedToken?.refreshToken,{expires:7});
  //     }
  //   }, 30000);

  //   return () => {
  //     clearInterval(refreshTokenInterval); // Clear interval on component unmount
  //   };
  // }, [res])


    return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routess />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
