// AuthContext.js
import React,{useEffect} from "react";
import useUser from "../hooks/useUser";
import { useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { isCookieExpired } from "./cookieAuth";
import { useDispatch } from "react-redux";
import { fillUserDetails } from "./slice/merchantSlice";
import { getCookie } from "./cookieAuth";
import { useSelector } from "react-redux";

export function AuthProvider({ children }) {
  const user = useUser();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const authPages = ["/"];
  const isAuthPage = authPages.includes(pathname);
  const getCookieValue = getCookie("authToken");
  const {userDetails} =  useSelector(state=>state.merchantReducer)
  useEffect(() => {

    if ( !userDetails ){
      dispatch(fillUserDetails(user.data));
    }
  }, [user, dispatch]);


  if (!userDetails) {
    return (
      <Box
        sx={{
          maxWidth: "31%",
          margin: "auto",
          marginTop: "1rem",
          maxWidth: { xs: "100%", sm: "100%", md: "31%" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10rem",
          }}
        >
          <CircularProgress size="4rem" color="error" />
        </Box>
      </Box>
    );
  }

  if (isAuthPage && userDetails) {
    return <Navigate to="/home" />;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  // if (!getCookieValue) {
  //   localStorage.clear();
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
}
