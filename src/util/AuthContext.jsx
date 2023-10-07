// AuthContext.js
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { isCookieExpired } from "./cookieAuth";
import { useDispatch } from "react-redux";
import { fillUserDetails } from "./slice/merchantSlice";
import { getCookie } from "./cookieAuth";
import { useSelector } from "react-redux";
import { getUser } from "../helpers/getUser";
import { RefreshToken } from "../helpers/getRefreshToken";
import useUser from "../hooks/useUser";
import Cookies from "js-cookie";
export function AuthProvider({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const authPages = ["/"];
  const isAuthPage = authPages.includes(pathname);
  const getCookieValue = getCookie("authToken");
  const wrongAuth = getCookie("wrongAuth");
  const {userDetails} =  useSelector(state=>state.merchantReducer)
const location = useLocation()

useEffect(() => {
  
  async function fetchUser (){
const user   = await getUser()
console.log(user)
if (user){
  dispatch(fillUserDetails(user))
}

  }
  if (!userDetails){
    fetchUser()
  }


}, [])


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
    return <Navigate to="/home"  state={{prevUrl:location.pathname}}/>;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!getCookieValue || wrongAuth) {
    localStorage.clear();
    return <Navigate to="/" state={{ prevUrl: location.pathname }} />;
  }

  return <>{children}</>;
}
