import React from "react";
import { Card, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import checkLogo from "../images/checkLogo.svg";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSuperMarket from "../hooks/useSuperMarket";
import useRestaurant from "../hooks/useRestaurant";
import {
  clearMerchantState,
  populateMerchantDetails,
  initOTD,
} from "../util/slice/merchantSlice";
import { ToastContainer, toast } from "react-toastify";
import { clearCart } from "../util/slice/CartSlice";

const WelcomeUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentTheme = useTheme();
  // const [key, setKey] = useState("");
  const [info, setInfo] = useState(null);
  const {data:merchantDetails} = useSelector(state=>state.merchantReducer)
//   const val = localStorage.getItem("myData");
//   let data = JSON.parse(val);

//  const key = data.id ? (data.id) : (val);

  // const superMarket = useSuperMarket(key);
  // const restaurant = useRestaurant(key);
  // const notifyErr = (message) => {
  //   toast.error(message, {
  //     position: "top-center",
  //     autoClose: 2000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // };
  // useEffect(() => {
  //   if (superMarket.data) {
  //     setInfo(superMarket?.data);
  //     dispatch(clearMerchantState());
  //     dispatch(clearMerchantState());
  //     dispatch(populateMerchantDetails(superMarket?.data));
  //     if (info){
  //       setTimeout(() => {
  //         navigate("/scan");
  //       }, 4000);
  
  //     }
  //   } else if (restaurant.data) {
  //     setInfo(restaurant?.data);
  //     dispatch(clearMerchantState());
  //     dispatch(clearCart());
  //     dispatch(populateMerchantDetails(restaurant?.data));
  //     if (info){
  //       setTimeout(() => {
  //         navigate("/cart");
  //       }, 4000);
  
  //     }
  //   } else {
  //     // notifyErr("No restaurant or supermarket found");
  //     console.log("No restaurant or supermarket found");
  //   }
  // }, [superMarket.data, navigate,info, dispatch,restaurant.data]);

  useEffect(() => {
    const val = localStorage.getItem("myData");
    let data = JSON.parse(val);

    // data.id ? setKey(data.id) : setKey(val);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: "-20rem",
          }}
        >
          <img src={checkLogo} className="checkLogo" alt="check-retail-logo" />
        </Box>

        <Typography
          variant="h2"
          sx={{
            marginTop: "-2.4rem",
            fontFamily: "raleWay",
            letterSpacing: "0.2em",
            color:
              currentTheme.palette.type === "light" ? "#000000" : "#EEEEEE",
            fontSize: "10px",
          }}
        >
          RETAIL
        </Typography>
      </Box>

      <Box
        sx={{
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "raleWay",
            letterSpacing: "0.2em",
            color:
              currentTheme.palette.type === "light" ? "#000000" : "#EEEEEE",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          Welcome to
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "raleWay",
            letterSpacing: "0.2em",
            color:
              currentTheme.palette.type === "light" ? "#000000" : "#EEEEEE",
            fontSize: "19px",
            fontWeight: "1000",
          }}
        >
          {(
            merchantDetails?.restaurant ? (
              merchantDetails?.restaurant?.companyName
            ) : (
              merchantDetails?.companyName
            )
          ) }
        </Typography>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default WelcomeUser;
