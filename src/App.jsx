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
import { getUser } from "./helpers/getUser";
import "./App.css";

function App() {
  // const [isRefreshing, setIsRefreshing] = useState(false);
const dispatch = useDispatch()
const {userDetails} = useSelector(state=>state.merchantReducer)
  useEffect(() => {
    const getCookieValue = getCookie("authToken");
    if (!getCookieValue) {
      localStorage.clear();
    }
  },[] )
  useEffect( () => {

    async function getData (){
      const res = await getUser()
      return (res)

    }
    if ( !userDetails ){
      getData().then(res=>{
        console.log(res)
        dispatch(fillUserDetails(res));
      }).catch(err=>console.log(err))
    }
  }, [userDetails ]);

    return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routess />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
