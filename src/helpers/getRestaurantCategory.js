import { AuthAxios } from "./axiosInstance";
export const getRestaurantCategory = async (id) => {
  const category = await AuthAxios({
    url:`/category/restaurant/${id}?sortBy=ASC&limit=100`,
    method:"GET"
  })
  return category?.data
};
