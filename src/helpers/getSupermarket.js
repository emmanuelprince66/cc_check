import { AuthAxios } from "./axiosInstance";
export const getSuperMarket = async (superMarketId) => {
  const superMarket = await AuthAxios({
    url:`/supermarket/${superMarketId}`
  })

  return superMarket.data;
};
