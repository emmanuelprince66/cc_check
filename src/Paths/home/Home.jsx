import React from "react";
import "./Home.css";
import notiLogo from "../../images/notiLogo.svg";
import groupLogo from "../../images/groupLogo.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import plusLogo from "../../images/plusLogo.svg";
import HomeCard from "../../components/homecard/HomeCard";
import Qacess from "../../components/qaccess/Qacess";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import FormattedPrice from "../../components/FormattedPrice";

import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useLocation } from "react-router-dom";

import exclamgreen from "../../images/practise/exclamgreen.svg";
import { useMyLocation } from "../../hooks/useLocation";
import { useTheme } from "@mui/material";
import { AuthProvider } from "../../util/AuthContext";
import Scanner from "../../components/scanner/Scanner";
import Qrscanner from "../../components/Qrscanner";
import { fillUserDetails, setLocation } from "../../util/slice/merchantSlice";
import { Link } from "react-router-dom";
import Acctbox from "../../components/acctbox/Acctbox";
import { useDispatch } from "react-redux";
import useUser from "../../hooks/useUser";
import { getUser } from "../../helpers/getUser";
import { useSelector } from "react-redux";

const Home = () => {
  const currentTheme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  // const user = useUser();
  const { userDetails } = useSelector((state) => state.merchantReducer);
  const location = useLocation();
  const mylocation = useMyLocation();
  useEffect(() => {
    mylocation
      .then((res) => {
        dispatch(
          setLocation({ latitude: res.latitude, longitude: res.longitude })
        );
      })
      .catch((err) => console.log(err));
  }, [mylocation]);
  useEffect(() => {
    setTimeout(() => {
      setShowScanner(true);
    }, 4000);
  }, []);
//   useEffect(() => {
//     async function getData() {
//       const res = await getUser();
//       return res;
//     if (user) {
//       dispatch(fillUserDetails(user.data));
//     }
//   }
// getData()
// }, [user]);

  const handleShowAmount = () => {
    !isTextVisible
      ? setIsTextVisible(!isTextVisible)
      : setIsTextVisible(!isTextVisible);
  };
  console.log(history);

  return (
    <AuthProvider>
      <div className="gpt3__home">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <QrCodeRoundedIcon
              sx={{
                color: currentTheme.palette.type === "light" ? "#000" : "#eeee",
                fontSize: "2rem",
              }}
            />
            <Typography
              sx={{
                color:
                  currentTheme.palette.type === "light" ? "#1e1e1e" : "#ffff",
                fontFamily: "raleWay",
                fontWeight: "1000",
                fontSize: "16px",
              }}
            >
              {`${userDetails?.firstName || ""} ${
                userDetails?.lastName || ""
              }  `}
            </Typography>
          </Box>

          <Box>
            <NotificationsRoundedIcon
              sx={{
                color: currentTheme.palette.type === "light" ? "#000" : "#eeee",
                fontSize: "1.8rem",
              }}
            />
          </Box>
        </Box>

        {/* Account Box Card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card
            sx={{
              maxheight: "125px",
              height: "125px",
              width: { xs: "341px", sm: "341px" },
              borderRadius: "16px",
              marginY: "1rem",
              backgroundColor:
                currentTheme.palette.type === "light" ? "#FFEDED" : "#2C2C2E",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                padding: "1.2rem 0.7rem 0.4rem 0.7rem ",
              }}
            >
              <Box
                sx={{
                  flex: "1",
                  width: "100%",
                }}
              >
                {!isTextVisible ? (
                  <Typography
                    sx={{
                      fontFamily: "raleWay",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    ***********
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "raleWay",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    {userDetails ? (
                      <FormattedPrice amount={userDetails?.balance} />
                    ) : (
                      <CircularProgress />
                    )}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "end",
                }}
              >
                <Box
                  onClick={() => handleShowAmount()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "103px",
                    height: "28px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(220, 0, 25, 0.1)",
                    padding: "4px 8px 4px 8px",
                    cursor: "pointer",
                  }}
                >
                  {isTextVisible ? (
                    <Visibility sx={{ color: "#C57600", fontSize: "15px" }} />
                  ) : (
                    <VisibilityOff
                      sx={{ color: "#C57600", fontSize: "15px" }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "10px",
                      color:
                        currentTheme.palette.type === "light"
                          ? "#1e1e1e"
                          : "#ffff",
                      letterSpacing: "-0.24px",
                      fontFamily: "raleWay",
                      paddingTop: "1px",
                    }}
                  >
                    {isTextVisible ? "Hide Balance" : "Show Balance"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "space-evenly",
                  sm: "space-evenly",
                  md: "space-evenly",
                  lg: "space-evenly",
                },
                alignItems: "center",
                gap: { xs: "0.5rem" },
                paddingX: { xs: "0.5rem" },
                paddingBottom: "1rem",
              }}
            >
              <Box
                sx={{
                  height: "36px",
                  background:
                    "linear-gradient(180deg, #31DC61 0%, #19953C 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "145px",
                  marginTop: "1rem",
                }}
              >
                <img src={plusLogo} alt="plus-logo" />
                <Link to="/fwallet">
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "400px",
                      fontFamily: "raleWay",
                    }}
                  >
                    Fund Wallet
                  </Typography>
                </Link>
              </Box>

              <Box
                sx={{
                  height: "36px",
                  background: "#EB001B",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "156px",
                  marginTop: "1rem",
                }}
              >
                <Link to="">
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "400px",
                      fontFamily: "raleWay",
                    }}
                  >
                    Transfer
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Account Box Card end */}

        <Typography
          sx={{
            color: currentTheme.palette.type === "light" ? "#1e1e1e" : "#ffff",
            fontFamily: "raleWay",
            fontWeight: "1000",
            fontSize: "16px",
            marginBottom: "1rem",
          }}
        >
          Your Insights
        </Typography>

        <HomeCard />

        {/* Header */}

        {/* NAVBAR */}
        <Navbar />
      </div>
    </AuthProvider>
  );
};

export default Home;
