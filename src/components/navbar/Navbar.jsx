import React, { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import hutLogo from "../../images/hutNoColor.svg";
import sideArrow from "../../images/sideArrow.svg";
import scan from "../../images/scanIcon.svg";
import cart from "../../images/cartIcon.svg";
import user from "../../images/userIcon.svg";
import "./Navbar.css";
import { Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

const Navbar = () => {
  const currentTheme = useTheme();
  const cartItem = useSelector((state) => state.cart.data);
  const { orders } = useSelector((state) => state.merchantReducer);
  const [numOfItem, setNumOfItem] = useState("");
  const [noOfResItem, setNoOfResItem] = useState(0);

  const MyTypography = styled(Typography)(({ theme }) => ({
    color: currentTheme.palette.type === "light" ? "#373737" : "#fff",
    fontSize: "10px",
    fontFamily: "raleWay",
    fontWeight: 600,
  }));

  const homeMatch = useMatch("/home");
  const walletMatch = useMatch("/wallet");
  const fwalletMatch = useMatch("/fwallet");
  const transactionsMatch = useMatch("/transactions");
  const scanMatch = useMatch("/scan");
  const cartMatch = useMatch("/cart");
  const mainScanMatch = useMatch("/mainScanner");
  const profileMatch = useMatch("/profile");

  useEffect(() => {
    const val = Array.isArray(cartItem) && cartItem.length;
    const restaurantOrders = orders
      .filter((order) => order.items.length > 0)
      .map((item) => {
        const { menu, ...rest } = item;
        return rest;
      });
    setNoOfResItem(restaurantOrders.length);
    setNumOfItem(val);
  }, [cartItem, orders]);

  return (
    <div className="gpt3__nav">
      <Card
        sx={{
          boxShadow: "0px 2px 40px rgba(0, 0, 0, 0.1)",

          width: { md: "31%", sm: "100%", xs: "100%" },
          padding: "10px",
          position: "fixed",
          left: { xs: 0, sm: "0", md: "34.5%" },
          bottom: 0,
          fontSize: "10px",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            listStyleType: "none",
            display: "flex",
            justifyItems: "center",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Box>
            <Link
              to="/home"
              className={
                homeMatch || fwalletMatch || walletMatch ? "active-link" : ""
              }
              style={{ color: "black", textDecoration: "none" }}
            >
              <div className="gpt3__navbar" id="firstnav">
                <img src={hutLogo} alt="hut-logo" />
                <MyTypography>Home</MyTypography>
              </div>
            </Link>
          </Box>
          <Box>
            <Link
              to="/transactions"
              className={transactionsMatch ? "active-link" : ""}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div className="gpt3__navbar">
                <img src={sideArrow} alt="side-logo" />
                <MyTypography>Transaction</MyTypography>
              </div>
            </Link>
          </Box>

          <Box
            sx={{
              marginLeft: "-2em",
              width: { md: "20%", sm: "20%", xs: "15%" },
            }}
          >
            <Link
              sx={{
                fontWeight: scanMatch ? "1000" : ",",
              }}
              to="/mainScanner"
              className={mainScanMatch ? "active-link" : ""}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div className="gpt3__navbar">
                <img src={scan} alt="scan-logo" />
                <MyTypography>Scan</MyTypography>
              </div>
            </Link>
          </Box>

          <Box>
            <Box
              sx={{
                position: "absolute",
                left: "72%",
                color: "#fff",
                top: "0.6rem",
                fontWeight: "900",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px",
                fontSize: "9px",
                background:
                  orders.length > 0
                    ? noOfResItem === 0
                      ? ""
                      : "#dc0019"
                    : numOfItem === 0
                    ? ""
                    : "#dc0019",
                width: "15px",
                height: "15px",
                zIndex: "1",
              }}
            >
              {orders.length > 0
                ? noOfResItem === 0
                  ? ""
                  : noOfResItem
                : numOfItem === 0
                ? ""
                : numOfItem}
            </Box>
            <Link
              to="/cart"
              className={cartMatch ? "active-link" : ""}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div id="cart-nav" className="gpt3__navbar">
                <img src={cart} alt="cart-logo" />
                <MyTypography>Cart</MyTypography>
              </div>
            </Link>
          </Box>

          <Box>
            <Link
              to="/profile"
              className={profileMatch ? "active-link" : ""}
              style={{ color: "black", textDecoration: "none" }}
            >
              <div className="gpt3__navbar">
                <img src={user} alt="user-logo" />
                <MyTypography>Profile</MyTypography>
              </div>
            </Link>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default Navbar;
