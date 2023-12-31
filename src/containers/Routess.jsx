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
            <Route path="/home" element={<Home />} />

            <Route
              path="/profile"
              element={
                <Profile
                  darkMode={darkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                />
              }
            />

            <Route index path="/transactions" element={<Transaction />} />
            <Route index path="/scan" element={<Scan />} />
            <Route index path="/cart" element={<Cart />} />
            <Route path="/paybills" element={<PayBills />} />
            <Route index path="/mainScanner" element={<MainScanner />} />

            <Route path="/wallet" element={<Wallet />} />
            <Route path="/fwallet" element={<Fwallet />} />
            <Route path="/fwithdraw" element={<Fwithdraw />} />
            <Route path="/wtransfer" element={<Wtransfer />} />
            <Route path="/frecharge" element={<Frecharge />} />
            <Route path="/elect" element={<Elect />} />
            <Route path="/tvsub" element={<Tvsub />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/support" element={<Suport />} />
            <Route path="/cpass" element={<Cpass />} />
            <Route path="/rlocation" element={<Rlocation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurant/menu" element={<RestaurantMenu />} />
            <Route path="/order/:id" element={<OrderSummary />} />
            <Route path="/order-out" element={<OTDMainPage />} />
            <Route
              path="/restaurant-receipt/:id"
              element={<RestaurantReceipt />}
            />
            <Route
              path="/restaurant-checkout"
              element={<RestaurantCheckout />}
            />
            <Route path="/order-out" element={<OTDMainPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
          </Routes>

          {location.pathname !== "/" &&
          location.pathname !== "/restaurant/menu" ? (
            <Navbar />
          ) : null}
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
};

export default Routess;
