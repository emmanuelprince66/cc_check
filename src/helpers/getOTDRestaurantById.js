
import { AuthAxios } from "./axiosInstance";
export const getOTDResById = async (id) => {

  const orders = await AuthAxios({
      url:`/otd/${id}?category=restaurant`,
    method:'GET'
  })

  return orders?.data;
};
