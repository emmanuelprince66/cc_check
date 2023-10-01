import axios from "axios";
import { AuthAxios } from "./axiosInstance";
export const getUser = async (token) => {
  const url = `https://check-server-api-staging.herokuapp.com/api/v1/user`;
  const user =await AuthAxios({
    url:'/user',
    method:'GET',
  })
  return user?.data;
};
