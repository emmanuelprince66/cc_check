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
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [textFour, setTextFour] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNoError, setPhoneNoError] = useState(false);
  const navigate = useNavigate();
  const currentTheme = useTheme();

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
    } else if (!/^0([89][01]|70)\d{8}$/i.test(value)) {
      setTextFour(true);
      setPhoneNoError("Invalid phone number");
    } else {
      setTextFour(false);
      setPhoneNoError("");
    }
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
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          width: "90%",
          mx: "auto",
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
          }}
        />
        <Button
          onClick={() => handleClearCart()}
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
          Forgot Password
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
  );
};

export default ForgetPassword;
