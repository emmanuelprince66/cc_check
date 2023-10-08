import React from "react";
import { useState ,useEffect} from "react";
import QrReader from "react-qr-scanner";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@mui/material";
import { Slide } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import useSuperMarket from "../hooks/useSuperMarket";
import useRestaurant from "../hooks/useRestaurant";
import WelcomeUser from "./WelcomeUser";
import { clearCart } from "../util/slice/CartSlice";
import { useSelector } from "react-redux";
import {
  clearMerchantState,
  populateMerchantDetails,
  initOTD,
  setIsScanned,
} from "../util/slice/merchantSlice";

import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Qrscanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {data:merchantDetails,isScanned} = useSelector(state=>state.merchantReducer)

  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(null);
  const handleClose = () => dispatch(setIsScanned(false));
  const [showProgress, setShowProgress] = useState(false);
console.log(key)
  const superMarket = useSuperMarket(key);
  const restaurant = useRestaurant(key);


  function isValidJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
  const welcomeUser = () => {
    setShowProgress(false);
    const val = localStorage.getItem("myData");

    if (val && isValidJSON(val)) {
    } else {
      notifyErr("Invalid Qr Code");
    }
    // setOpen(true);

    // setTimeout(() => {
    //   handleClose();
    // }, 3000);
  };

  const handleQrScan = (data) => {
    if (data) {
      // localStorage.setItem("myData", data.text);
        let res = JSON.parse(data?.text);
console.log(data,res)
 res.id ? setKey(res.id) : setKey(res);

      playNotificationSound();
      setShowProgress(true);
    }
  };



  let notificationSound;

  const playNotificationSound = () => {
    const audioFile = "/notification.mp3";
    notificationSound = new Audio(audioFile);
    notificationSound.onerror = () => {
      console.error("Failed to load audio:", audioFile);
    };
    notificationSound.play();
  };

  const handleError = (err) => {
    console.log(err);
  };

  const notifyErr = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };



  useEffect(() => {
    console.log(superMarket.data,restaurant.data,open)
    if (superMarket?.data) {
      dispatch(setIsScanned(true))
      dispatch(clearMerchantState());
      dispatch(clearCart());
      dispatch(populateMerchantDetails(superMarket?.data));
       setShowProgress(false);
       setTimeout(() => {
        handleClose();
                  navigate("/scan");
      }, 6000);
  
    } else if (restaurant?.data) {
      dispatch(clearMerchantState());
      dispatch(clearCart());
      dispatch(setIsScanned(true))
      setShowProgress(false);
console.log(isScanned)
      dispatch(populateMerchantDetails(restaurant?.data));
            setTimeout(() => {
      handleClose();
                navigate("/cart");
    }, 6000);

  
      // }
  }
  else {
    // notifyErr("No restaurant or supermarket found");
    console.log("No restaurant or supermarket found");
  }

}, [superMarket.data, navigate,merchantDetails,open, isScanned,dispatch,restaurant.data]);
console.log(open)

  return (
    <Box>
      <Box
        sx={{
          padding: "0.5rem",
        }}
      >
        {showProgress ? (
          <CircularProgress
            size="3.5rem"
            sx={{
              marginTop: "3rem",
            }}
            color="error"
          />
        ) : (
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleQrScan}
            style={{
              minWidth: "100%",
              minHeight: "100%",
              borderRadius: "20px",
            }}
            constraints={{
              video: { facingMode: "environment" },
            }}
          />
        )}
      </Box>

      {/* Dialouge full screen modal start */}
      <Dialog
        fullScreen
        open={isScanned}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <WelcomeUser />
      </Dialog>

      {/* Dialouge full screen modal end */}
      <ToastContainer />
    </Box>
  );
};

export default Qrscanner;
