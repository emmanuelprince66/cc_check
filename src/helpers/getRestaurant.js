import { AuthAxios } from "./axiosInstance";

export const getRestaurant = async (restaurantId) => {
  try {
    const restaurant = await AuthAxios({
      url: `/table/${restaurantId}`,
      method: "GET",
    });
    return restaurant?.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error; // Re-throw the error to handle it higher up in the call stack
  }
};
