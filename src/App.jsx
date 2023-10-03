import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Routess from "./containers/Routess";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./helpers/queryClient";
import { AuthProvider } from "./util/AuthContext";
import { Provider } from "react-redux";
import { getCookie } from "./util/cookieAuth";
import Cookies from "js-cookie";
import { RefreshToken } from "./helpers/getRefreshToken";

import "./App.css";

function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const getCookieValue = getCookie("authToken");
    if (!getCookieValue) {
      localStorage.clear();
    }

    const refreshInterval = setInterval(async () => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        try {
          let data = await RefreshToken();
          Cookies.set("authToken", data?.access_token);
          Cookies.set("refreshToken", data?.refreshToken);
        } finally {
          setIsRefreshing(false);
        }
      }
    }, 20000);

    return () => clearInterval(refreshInterval); // Clear interval on component unmount
  }, [isRefreshing]);
    return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routess />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
