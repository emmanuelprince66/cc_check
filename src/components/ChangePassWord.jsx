import React from "react";
import { useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { Dialog } from "@mui/material";
import { Slide } from "@mui/material";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { getCookie } from "../util/cookieAuth";
import { useNavigate } from "react-router-dom";
import passwordLogo from "../images/passwordLogo.svg";
const ChangePassWord = () => {
  const [textSix, setTextSix] = useState(false);
  const [textSeven, setTextSeven] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const weakPassword = new RegExp("(?=.{3,})");
  const weakPasswordIcon = new RegExp("(?=.{7,})");
  const mediumPassword = new RegExp("(?=.*[A-Z])");
  const strongPassword = new RegExp("(?=.*[^A-Za-z0-9])");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const phoneNumber = useSelector((state) => state.phone.data);
  const currentTheme = useTheme();
  const navigate = useNavigate();

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;

    setConfirmPasswordInput(value);
    if (passwordInput === value) {
      setConfirmError("");
      setTextSeven(false);
    } else {
      setConfirmError("Password do not match");
      setTextSeven(true);
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPasswordInput(value);

    if (!value) {
      setPasswordError("Please enter your password");
      setTextSix(true);
    } else {
      if (weakPasswordIcon.test(passwordInput)) {
        //   meduim password

        if (mediumPassword.test(value)) {
          if (strongPassword.test(value || passwordInput)) {
            setTextSix(false);
            setPasswordError("");
          } else {
            setPasswordError("Must contain atleast one special character");
            setTextSix(true);
          }
        } else {
          setPasswordError("Must contain atleast one capital letter");
          setTextSix(true);
        }
        ///  meduim password ends
      } else {
        setPasswordError("Minimum of 8 characters");
        setTextSix(true);
      }
    }
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleConfirmPasswordBlur = () => {};

  const handlePasswordBlur = () => {
    if (!passwordInput) {
      setPasswordError("Please enter your password");
      setTextSix(true);
    } else {
      setPasswordError("");
      setTextSix(false);
    }
  };

  // reset password
  const sendResetPasswordToEndpoint = async () => {
    const token = getCookie("authToken");
    try {
      const response = await axios.post(
        "https://check-server-api.herokuapp.com/api/v1/auth/password-reset-confirm",
        {
          phone: phoneNumber,
          newPassword: passwordInput,
          confirmPassword: confirmPasswordInput,
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
  const mutationReset = useMutation(sendResetPasswordToEndpoint, {
    onSuccess: (response) => {
      notify(response.message);
      setDisableButton(false);
      navigate("/");
    },
    onError: (response) => {
      notifyErr(response.message);
      setDisableButton(false);
    },
  });
  const handleResetPassword = () => {
    setDisableButton(true);

    if (passwordInput === confirmPasswordInput) {
      mutationReset.mutate(passwordInput);
    } else {
      notifyErr("Password do not match");
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
            Set your new password
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "50%", lg: "100%" },
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
              width: { xs: "300px", sm: "100%", md: "327px" },
              mx: "auto",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: `${textSix ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
                },
                "&:hover fieldset": {
                  borderColor: `${textSix ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
                },
                "&.Mui-focused fieldset": {
                  borderColor: `${textSix ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
                },
              },
            }}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            value={passwordInput}
            required
            helperText={passwordError && <span>{passwordError}</span>}
            placeholder="Enter your Password"
            id="password-input"
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <img src={passwordLogo} alt="password-logo" /> &nbsp;&nbsp;
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
          />
          <TextField
            sx={{
              width: { xs: "300px", sm: "100%", md: "327px" },
              mx: "auto",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: `${textSeven ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
                },
                "&:hover fieldset": {
                  borderColor: `${textSeven ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
                },
                "&.Mui-focused fieldset": {
                  borderColor: `${textSeven ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
                },
              },
            }}
            onChange={handleConfirmPasswordChange}
            value={confirmPasswordInput}
            onBlur={handleConfirmPasswordBlur}
            required
            helperText={confirmError && <span>{confirmError}</span>}
            placeholder="Verify Password"
            id="password-input"
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <img src={passwordLogo} alt="password-logo" /> &nbsp;&nbsp;
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
          />
          <Button
            onClick={handleResetPassword}
            disabled={disableButton || mutationReset.isLoading}
            sx={{
              background:
                currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
              padding: "10px",
              borderRadius: "8px",
              width: { xs: "85%", sm: "100%", lg: "77%" },
              my: "1rem",
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
            {mutationReset.isLoading || disableButton ? (
              <CircularProgress size="1.2rem" sx={{ color: "white" }} />
            ) : (
              "Reset Password"
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
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default ChangePassWord;
