import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Button } from "@mui/material";
import line from "../../images/practise/line.svg";
import { useTheme } from "@mui/material";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthAxios } from "../../helpers/axiosInstance";
import { getCookie } from "../../util/cookieAuth";
import { queryClient } from "../../helpers/queryClient";
import axios from "axios";
import { Slide } from "@mui/material";

import { Dialog } from "@mui/material";
import VerifyOTP from "../../components/VerifyOTP";
import { addNumber } from "../../util/slice/PhoneSlice";

const ForgetPassword = () => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const [textFour, setTextFour] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentTheme = useTheme();

  const handleClose = () => {};
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
      setDisableButton(false);
      notifyErr(error.response.data.message);
      throw new Error(error.response);
    }
  };

  const mutationOTP = useMutation(sendPhoneNumberToEndpoint, {
    onSuccess: (response) => {
      notify(response.message);
      setVerifyOTP(true);
      setDisableButton(false);
    },
    onError: (response) => {
      notifyErr(response.message);
      setDisableButton(false);
    },
  });

  const handleGetOTP = () => {
    setDisableButton(true);
    if (phoneNo && phoneNo.length === 10) {
      mutationOTP.mutate(phoneNo);
      dispatch(addNumber(phoneNo));
    } else {
      notifyErr("Phone number is too short");
      setDisableButton(false);
    }
  };

  const handlePhoneNoBlur = () => {
    if (!phoneNo) {
      setPhoneNoError("Please enter your phone number");
      setTextFour(true);
    }
  };

  const handlePhoneNoChange = (event) => {
    const value = event.target.value;
    setPhoneNo(value);
    if (!value) {
      setPhoneNoError("Please enter your phone number");
      setTextFour(true);
    } else if (!/^\d+$/.test(value)) {
      setTextFour(true);
      setPhoneNoError("Invalid phone number");
    } else {
      setTextFour(false);
      setPhoneNoError("");
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

  return (
    <Box
      sx={{
        maxWidth: "31%",
        mx: "auto",
        marginTop: "1rem",
        maxWidth: { xs: "100%", sm: "100%", md: "31%" },
      }}
    >
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          marginTop: " 5rem ",
          marginBottom: "2rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Enter your registered phone number to reset your password
        </Typography>
      </Box>

      <Box
        sx={{
          width: "90%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        {" "}
        <TextField
          sx={{
            maxWidth: { xs: "100%", sm: "100%", md: "327px" },
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: `${textFour ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
              },
              "&:hover fieldset": {
                borderColor: `${textFour ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
              },
              "&.Mui-focused fieldset": {
                borderColor: `${textFour ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
              },
            },
          }}
          onChange={handlePhoneNoChange}
          onBlur={handlePhoneNoBlur}
          value={phoneNo}
          required
          helperText={phoneNoError && <span>{phoneNoError}</span>}
          placeholder="Phone Number"
          variant="outlined"
          id="phone-number"
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <LocalPhoneRoundedIcon />
                &nbsp;&nbsp; +234&nbsp;&nbsp;
                <img src={line} alt="line" />
                &nbsp;&nbsp;
              </InputAdornment>
            ),
          }}
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "weight",
            maxLength: "10",
          }}
        />
        <Button
          disabled={disableButton || mutationOTP.isLoading}
          onClick={handleGetOTP}
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
          {mutationOTP.isLoading || disableButton ? (
            <CircularProgress size="1.2rem" sx={{ color: "white" }} />
          ) : (
            "Forgot Password"
          )}
        </Button>
        <Box onClick={() => navigate("/")}>
          <Typography
            sx={{
              color: currentTheme.palette.type === "light" ? "#000" : "#eeee",
            }}
          >
            Back to login
          </Typography>
        </Box>
      </Box>

      {/* verify otp page */}
      <Dialog
        fullScreen
        open={verifyOTP}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <VerifyOTP phoneNo={phoneNo} setVerifyOTP={setVerifyOTP} />
        </Box>
      </Dialog>
      {/* verify otp page ends */}
      <ToastContainer />
    </Box>
  );
};

export default ForgetPassword;
