import { AuthAxios } from "./axiosInstance";
export const getSuperMarketP = async (eAN, companyName, companylocation) => {
  const superMarketP = await AuthAxios({
    url: `/supermarket/${eAN}/${companyName}/${companylocation}`,
    method:'GET'
  });

  return superMarketP.data;
};
