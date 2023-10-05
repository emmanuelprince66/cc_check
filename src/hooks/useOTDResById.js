import { useQuery } from "@tanstack/react-query";
import { getMenu } from "../helpers/getMenu";
import { getOTDResById } from "../helpers/getOTDRestaurantById";

export default function useOTDResById(id) {
  const fetcher = () => getOTDResById(id);
  const enabled = id !== undefined && id !== null;

  const response = useQuery(["OTDResById", id], fetcher, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: 50000,
  });

  return response;
}
