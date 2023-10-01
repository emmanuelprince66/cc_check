import axios from "axios";
import Cookies from "js-cookie";
export const RefreshToken = async () => {
  let refreshToken = Cookies.get("refreshToken");

  const url = `https://check-server-api-staging.herokuapp.com/api/v1/auth/refresh`;
  const response = axios.post(
    url,
    { refreshToken: refreshToken },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return response;
};
