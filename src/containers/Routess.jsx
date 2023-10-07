import React, { useEffect } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Paths/home/Home";
import Transaction from "../Paths/transaction/Transaction";
import Scan from "../Paths/scan/Scan";
import Cart from "../Paths/cart/Cart";
import Profile from "../Paths/profile/Profile";
import PayBills from "../Paths/pay-bills/PayBills";
import Wallet from "../Paths/walllet/Wallet";
import Fwallet from "../Paths/fwallet/Fwallet";
import Wtransfer from "../Paths/wtransfer/Wtransfer";
import Frecharge from "../Paths/frecharge/Frecharge";
import Login from "../Paths/login/Login";
import Fwithdraw from "../Paths/fwithdraw/Fwithdraw";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Elect from "../Paths/electricity/Elect";
import Tvsub from "../Paths/tvsub/Tvsub";
import Referral from "../Paths/referral/Referral";
import Suport from "../Paths/support/Suport";
import Cpass from "../Paths/cpassword/Cpass";
import Rlocation from "../Paths/rlocation/Rlocation";
import Orders from "../Paths/orders/Orders";
import Navbar from "../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import RestaurantMenu from "../Paths/cartMenu";
import OrderSummary from "../Paths/orderSummary";
import RestaurantReceipt from "../Paths/restaurantOrderReceipt/restaurantReceipt";
import RestaurantCheckout from "../Paths/restaurantCheckout/restaurantCheckout";
import OTDMainPage from "../Paths/OTD/otd";
import RestaurantPage from "../Paths/otdRestaurant/otdrestaurant";
import MainScanner from "../components/MainScanner";
import ScrollToTop from "../components/scrollToTop";
import ForgetPassword from "../Paths/forgetp/ForgetPassword";
import ChangePassWord from "../components/ChangePassWord";
import { AuthProvider } from "../util/AuthContext";

const Routess = () => {
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Raleway, sans-serif", // Set your preferred font family here
    },
    palette: {
      type: darkMode ? "dark" : "light",
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <div>
      <ScrollToTop />
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <AuthProvider>
                  <Home />
                </AuthProvider>
              }
            />

            <Route
              path="/profile"
              element={
                <AuthProvider>
                  <Profile
                    darkMode={darkMode}
                    onToggleDarkMode={handleToggleDarkMode}
                  />
                </AuthProvider>
              }
            />

            <Route
              index
              path="/transactions"
              element={
                <AuthProvider>
                  <Transaction />
                </AuthProvider>
              }
            />
            <Route
              index
              path="/scan"
              element={
                <AuthProvider>
                  <Scan />
                </AuthProvider>
              }
            />
            <Route
              index
              path="/cart"
              element={
                <AuthProvider>
                  <Cart />
                </AuthProvider>
              }
            />
            <Route
              path="/paybills"
              element={
                <AuthProvider>
                  <PayBills />
                </AuthProvider>
              }
            />
            <Route
              index
              path="/mainScanner"
              element={
                <AuthProvider>
                  <MainScanner />
                </AuthProvider>
              }
            />
            <Route
              index
              path="/forget-password"
              element={
                <AuthProvider>
                  <ForgetPassword />
                </AuthProvider>
              }
            />

            <Route
              path="/wallet"
              element={
                <AuthProvider>
                  <Wallet />
                </AuthProvider>
              }
            />
            <Route
              path="/fwallet"
              element={
                <AuthProvider>
                  <Fwallet />
                </AuthProvider>
              }
            />
            <Route
              path="/fwithdraw"
              element={
                <AuthProvider>
                  <Fwithdraw />
                </AuthProvider>
              }
            />
            <Route
              path="/wtransfer"
              element={
                <AuthProvider>
                  <Wtransfer />
                </AuthProvider>
              }
            />
            <Route
              path="/frecharge"
              element={
                <AuthProvider>
                  <Frecharge />
                </AuthProvider>
              }
            />
            <Route
              path="/change-password"
              element={
                <AuthProvider>
                  <ChangePassWord />
                </AuthProvider>
              }
            />
            <Route
              path="/elect"
              element={
                <AuthProvider>
                  <Elect />
                </AuthProvider>
              }
            />
            <Route
              path="/tvsub"
              element={
                <AuthProvider>
                  <Tvsub />
                </AuthProvider>
              }
            />
            <Route
              path="/referral"
              element={
                <AuthProvider>
                  <Referral />
                </AuthProvider>
              }
            />
            <Route
              path="/support"
              element={
                <AuthProvider>
                  <Suport />
                </AuthProvider>
              }
            />
            <Route
              path="/cpass"
              element={
                <AuthProvider>
                  <Cpass />
                </AuthProvider>
              }
            />
            <Route
              path="/rlocation"
              element={
                <AuthProvider>
                  <Rlocation />
                </AuthProvider>
              }
            />
            <Route
              path="/orders"
              element={
                <AuthProvider>
                  <Orders />
                </AuthProvider>
              }
            />
            <Route
              path="/restaurant/menu"
              element={
                <AuthProvider>
                  <RestaurantMenu />
                </AuthProvider>
              }
            />
            <Route
              path="/order/:id"
              element={
                <AuthProvider>
                  <OrderSummary />
                </AuthProvider>
              }
            />
            <Route
              path="/order-out"
              element={
                <AuthProvider>
                  <OTDMainPage />
                </AuthProvider>
              }
            />
            <Route
              path="/restaurant-receipt/:id"
              element={
                <AuthProvider>
                  <RestaurantReceipt />
                </AuthProvider>
              }
            />
            <Route
              path="/restaurant-checkout"
              element={
                <AuthProvider>
                  <RestaurantCheckout />
                </AuthProvider>
              }
            />
            <Route
              path="/order-out"
              element={
                <AuthProvider>
                  <OTDMainPage />
                </AuthProvider>
              }
            />
            <Route
              path="/restaurant/:id"
              element={
                <AuthProvider>
                  <RestaurantPage />
                </AuthProvider>
              }
            />
          </Routes>
          {location.pathname !== "/" &&
          location.pathname !== "/restaurant/menu" &&
          location.pathname !== "/forget-password" &&
          location.pathname !== "/change-password" &&
          location.pathname !== "/support" ? (
            <Navbar />
          ) : null}
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
};

export default Routess;
