import React from "react";
import Navbar from "./navbar/Navbar";
import MainQrscanner from "./MainQrscanner";
import { useTheme } from "@mui/material";

import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";
import BackArrow from "./backArrow/BackArrow";

const MainScanner = () => {
  const currentTheme = useTheme();
  return (
    <Box
      sx={{
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: "100%", md: "31%", lg: "31%" },
          margin: "auto",
        }}
      >
        <BackArrow />
      </Box>

      <Box
        sx={{
          maxWidth: "31%",
          mx: "auto",
          marginTop: "4rem",
          maxWidth: { xs: "100%", sm: "80%", md: "31%" },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            my: "1rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              color: currentTheme.palette.type === "light" ? "#000" : "#eee",
              fontSize: "20px",
              fontFamily: "raleWay",
            }}
          >
            Scan a Qr code.
          </Typography>
        </Box>
        <Box>
          <MainQrscanner />
        </Box>
        <Navbar />
      </Box>
    </Box>
  );
};

export default MainScanner;
