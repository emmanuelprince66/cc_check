import React, { useEffect } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { setRefreshError } from "../util/slice/merchantSlice";

export const RefreshToken = async () => {
  let authToken = Cookies.get("authToken");
  let refreshToken = Cookies.get("refreshToken");

  const url = `https://check-server-api-staging.herokuapp.com/api/v1/auth/refresh`;

  try {
    const response = await axios.post(
      url,
      { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    if (!(error?.response?.status === 201 || error?.response?.status === 200)) {
      localStorage.clear();
      localStorage.setItem('wrongAuth', true);
      throw error; 
    }
  }
};


