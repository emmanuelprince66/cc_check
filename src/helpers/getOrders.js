import axios from "axios";
import { AuthAxios } from "./axiosInstance";
export const getOrders = async (token) => {
  const url = `https://check-server-api-staging.herokuapp.com/api/v1/cart-supermarket/user`;
  const orders = await AuthAxios({
    url:'/cart-supermarket/user',
    method:'GET'
  })

  return orders?.data;
};
