import axios from "axios";
import Cookies from "js-cookie";
export const RefreshToken = async () => {
  let authToken = Cookies.get("authToken");
  let refreshToken = Cookies.get("refreshToken");

  const url = `https://check-server-api-staging.herokuapp.com/api/v1/auth/refresh`;

  try {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTJkNGNiYy1hNDg5LTQ2MjQtOTYwZS0xNjQ1NmJiNTEyODMiLCJlbWFpbCI6InV3ZWRlLnJpY2hpZUBnbWFpbC5jb20iLCJwaG9uZSI6IisyMzQ4MTY1MTE3NzIwIiwiZmlyc3ROYW1lIjoiRWZlb2doZW5lIiwibGFzdE5hbWUiOiJVd2VkZSIsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAyMy0wMS0xM1QwODowMToyNi44NjZaIiwidXBkYXRlZEF0IjoiMjAyMy0xMC0wNFQyMTozNzo0OC41MjdaIiwiZGV2aWNlVG9rZW4iOiJlNF9TWjhOWXhFazJuY2Iza0g4b0RkOkFQQTkxYkYwcHQyMjhyVWY0VEE2M0ZmZWhlbHJ5ZWp4MVM4ZWxZbXJQSF9XN1Vkb2R3NmNaNXJmdWJ5RnRwdmdEcThmYnRtVGUySTBhaWJwTjVndnFwQzY2Xzc5Q1RZVXpMSEx0b2luanNCWlZfUzVYVG5oRzcxMWJHWDJGVkp1RFdxeUNOaFNKaEFlIiwiaWF0IjoxNjk2NDg5NTE2LCJleHAiOjE2OTY1MzI3MTZ9.pbhcjtPzSZrWU7IJ8MPJ-KjdNU5ZrILF0pyftxJNAN'
    const response = await axios.post(
      url,
      { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
return response?.data

  } catch (error) {
    if ( !(error?.response?.status === 201 ||  error?.response?.status === 200)) {
      // window.location.href = '/'; 
      console.log(error)
    }
  }
};
