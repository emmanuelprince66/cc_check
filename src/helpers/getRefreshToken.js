import axios from "axios";
import Cookies from "js-cookie";
export const RefreshToken = async () => {
  let refreshToken = Cookies.get("refreshToken");

  const url = `https://check-server-api-staging.herokuapp.com/api/v1/auth/refresh`;

  try {
    const response = await axios.post(
      url,
      { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    Cookies.set("authToken", response.data?.access_token);
    Cookies.set("refreshToken", response.data?.refreshToken);
return response?.data

  } catch (error) {
    if (error?.response?.status === 401 ||  error?.response?.status === 403) {
      console.log(error)
    }
  }
};
