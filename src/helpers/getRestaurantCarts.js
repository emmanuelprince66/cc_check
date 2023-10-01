import { AuthAxios } from "./axiosInstance";
export const getRestaurantOrders = async () => {
  const orders = await AuthAxios({
    url:'/cart/user?limit=50',
    method:'GET'
  })
  return orders?.data;
};
