import React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "../util/cookieAuth";
import { queryClient } from "../helpers/queryClient";
import { ToastContainer, toast } from "react-toastify";
import { Dialog } from "@mui/material";
import { Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { Box, Typography, Button, CircularProgress } from "@mui/material";
import BackArrow from "./backArrow/BackArrow";
import ChangePassWord from "./ChangePassWord";

const VerifyOTP = ({ phoneNo, setVerifyOTP }) => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const pinRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [resendText, setResendText] = useState(false);
  const currentTheme = useTheme();
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(true);

  const handleClose = () => {
    setVerifyOTP(false);
  };
  const handleChange = (index, value) => {
    // Ensure that the value is only one digit
    if (value.length > 1) return;

    if (!/^\d*$/.test(value)) return;

    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    // Automatically focus on the next TextField if not already at the last one
    if (index < pinRef.length - 1) {
      pinRef[index + 1].current.focus();
    }
  };

  const sendPhoneNumberToEndpoint = async (phone) => {
    const token = getCookie("authToken");
    try {
      const response = await axios.post(
        "https://check-server-api.herokuapp.com/api/v1/auth/request-otp",
        {
          phone: phone, // Replace with your phone data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      notifyErr("Error..Please Try Again.");
      throw new Error(error.response);
    }
  };
  const sendOTPToEndpoint = async (code) => {
    const phone = phoneNo;
    const token = getCookie("authToken");
    try {
      const response = await axios.post(
        "https://check-server-api.herokuapp.com/api/v1/auth/verify-otp",
        {
          code: code,
          phone: phone, // Replace with your phone data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      notifyErr(error.response.data.message);
      throw new Error(error.response);
    }
  };

  const mutationOTP = useMutation(sendPhoneNumberToEndpoint, {
    onSuccess: (response) => {
      console.log("sucess");
    },
    onError: (response) => {
      console.log("err");
    },
  });
  const mutationVerifyOTP = useMutation(sendOTPToEndpoint, {
    onSuccess: (response) => {
      notify(response.message);
      console.log(response);
      navigate("/change-password");
    },
    onError: (response) => {
      notifyErr(response.message);
      console.log(response);
    },
  });
  const handleGetOTP = () => {
    mutationOTP.mutate(phoneNo);
    setIsRunning(true);
    console.log(phoneNo);
  };

  const verifyGetOTP = () => {
    // Check if all the PINs have been entered
    const allPinsEntered = pins.every((pin) => pin !== "");

    if (allPinsEntered) {
      // api call
      const verifyPinsOTP = pins.join("");
      console.log(verifyPinsOTP);
      mutationVerifyOTP.mutate(verifyPinsOTP);
    } else {
      notifyErr("Please enter all six PIN digits.");
    }
  };
  const notifyErr = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const notify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleClose2 = () => {};

  useEffect(() => {
    let countdownInterval;

    if (isRunning) {
      countdownInterval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining((prevTime) => prevTime - 1);
        } else {
          clearInterval(countdownInterval);
          setIsRunning(false);
          // Optionally, you can call a function here when the countdown reaches zero.
        }
      }, 1000); // Update every 1 second (1000 milliseconds)
    }

    return () => clearInterval(countdownInterval);
  }, [timeRemaining, isRunning]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <Box
      sx={{
        maxWidth: "31%",
        mx: "auto",
        marginTop: "1rem",
        maxWidth: { xs: "90%", sm: "100%", md: "31%" },
      }}
    >
      <Box onClick={() => handleClose()}>
        <BackArrow />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "6rem",
        }}
      >
        <Box
          sx={{
            marginBottom: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Please enter the OTP sent to your phone here
          </Typography>
        </Box>
        {/* Imput boxes */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              background: "#eee",
              padding: "1rem 0",
              borderRadius: "10px",
            }}
          >
            {pins.map((pin, index) => (
              <TextField
                sx={{
                  width: "25px",
                  "& input": {
                    fontSize: "1rem",
                    padding: "6px 0",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                      borderBottom: "1px solid #000",
                      borderRadius: "0",
                    },

                    "&:hover fieldset": {
                      borderColor: "#CACACA", // Set the border color on hover here
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4990E2", // Set the border color on focus here
                    },
                  },
                }}
                key={index}
                variant="outlined"
                type="password"
                value={pin}
                onChange={(e) => handleChange(index, e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*", // Ensure only numeric input is allowed
                  maxLength: 1, // Limit input to one character
                  style: { textAlign: "center" }, // Center-align the input
                }}
                inputRef={pinRef[index]}
              />
            ))}
          </Box>

          {resendText || !isRunning ? (
            <Box
              sx={{
                display: "flex",
                my: "1rem",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "400",
                  fontSize: "20px",
                }}
              >
                Dont't get an OTP?
              </Typography>
              <Typography
                onClick={handleGetOTP}
                sx={{
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "20px",
                }}
              >
                Resend
              </Typography>
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "400",
                fontSize: "20px",
                my: "1rem",
              }}
            >
              Resend Code in 0{minutes} :{seconds}
            </Typography>
          )}
        </Box>
        <Button
          onClick={verifyGetOTP}
          disabled={mutationVerifyOTP.isLoading || disableButton}
          sx={{
            background:
              currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
            padding: "10px",
            borderRadius: "8px",
            width: { xs: "90%", sm: "41%", lg: "77%" },
            color: "#fff",
            "&:hover": {
              backgroundColor:
                currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
            },
            fontFamily: "raleWay",
            textTransform: "capitalize",
            fontWeight: "700",
          }}
        >
          {mutationVerifyOTP.isLoading || disableButton ? (
            <CircularProgress size="1.2rem" sx={{ color: "white" }} />
          ) : (
            "Verify   "
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyOTP;
