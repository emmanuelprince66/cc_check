import React from "react";
import { useState } from "react";
import QrReader from "react-qr-scanner";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@mui/material";
import { Slide } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

import WelcomeUser from "./WelcomeUser";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Qrscanner = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [showProgress, setShowProgress] = useState(false);

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
      setOpen(true);
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
      localStorage.setItem("myData", data.text);
      playNotificationSound();
      setShowProgress(true);
      setTimeout(() => {
        welcomeUser();
      }, 3000);
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
        open={open}
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
