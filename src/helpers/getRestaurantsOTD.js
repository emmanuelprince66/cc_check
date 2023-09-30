import { AuthAxios } from "./axiosInstance";
export const getOTDRestaurants = async () => {
  const response = await AuthAxios({
    url:'/otd'
  })

  return response?.data;
};
