import { AuthAxios } from "./axiosInstance";
export const getTransactions = async () => {
  const transaction = await AuthAxios({
    url:'/transaction/user',
    method: 'GET'
  })

  return transaction.data;
};
