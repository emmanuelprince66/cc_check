import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import BackArrow from "../../components/backArrow/BackArrow";
import { useNavigate } from "react-router-dom";
import InvalidPin from "../../components/InvalidPin";
import add from "../../assets/add-square.svg";
import {
  Card,
  Box,
  Typography,
  Stack,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import icircle from "../../images/info-circle.svg";
import searchLogo from "../../images/searchLogo.svg";
import dashdot from "../../images/practise/threedot.svg";
import res2 from "../../images/res2.svg";
import OTD1 from "../../images/OTD1.svg";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Modal } from "@mui/material";
import { AuthProvider } from "../../util/AuthContext";
import "./Cart.css";
import { useSelector } from "react-redux";
import NoResult from "../../components/NoResult";
import CartItem from "../../components/CartItem";
import { ToastContainer, toast } from "react-toastify";
import phoneLogo from "../../images/phoneLogo.svg";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../helpers/axiosInstance";
import { getCookie } from "../../util/cookieAuth";
import { queryClient } from "../../helpers/queryClient";
import useSuperMarket from "../../hooks/useSuperMarket";
import successGif from "../../images/successGif.gif";
import { clearCart } from "../../util/slice/CartSlice";
import { useDispatch } from "react-redux";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import { Dialog } from "@mui/material";
import { Slide } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CartReceipt from "../../components/CartReceipt";
import FormattedPrice from "../../components/FormattedPrice";
import { useRef } from "react";
import InsufficientFund from "../../components/InsufficientFund";
import checkLogo from "../../images/checkLogo.svg";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Restaurant from "../../components/restaurant";
import { resetState, initOTD } from "../../util/slice/merchantSlice";
import { useMyLocation } from "../../hooks/useLocation";
import { PlaceOrder } from "../../components/handlePlacingOrder/handlePlacingOrder";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Cart = () => {
  const { AuthAxios } = axiosInstance();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const supermarketCart = useSelector((state) => state.cart);

  const [text, setText] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [openLocationOptions, setOpenLocationOptions] = useState(false);
  const [deleteAllCart, setDeleteAllCart] = useState(false);

  const [phoneNoError, setPhoneNoError] = useState(false);
  const currentTheme = useTheme();

  const { data, orders, isOTD, takeAwayPrice, totalAmount } = useSelector(
    (state) => state?.merchantReducer
  );
  const merchantDetails = data;
  const navigate = useNavigate();
  function setOTD() {
    dispatch(initOTD(true));
    navigate("/order-out");
  }
  const handleClose6 = () => {
    setDeleteAllCart(false);
  };
  const handleClearCart = () => {
    dispatch(clearCart());
    handleClose6();
  };
  return (
    <AuthProvider>
      <Box
        sx={{
          maxWidth: "31%",
          mx: "auto",
          marginTop: "1rem",
          maxWidth: { xs: "100%", sm: "100%", md: "31%" },
        }}
      >
        {merchantDetails?.restaurant || isOTD ? (
          <Restaurant />
        ) : (
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              mx: "auto",
              width: { xs: "96%", sm: "70%", md: "100%" },
              minHeight: "100vh",
              maxHeight: "100vh",
              padding: 0,
              position: "relative",
            }}
          >
            <Box
              sx={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: "3rem",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
              >
                My Cart
              </Typography>

              {supermarketCart.length != 0 && (
                <Button
                  onClick={() => setDeleteAllCart(true)}
                  sx={{
                    width: "35%",
                    textTransform: "capitalize",
                    fontWeight: "1000",
                    background:
                      currentTheme.palette.type === "light"
                        ? "#dc0019"
                        : "#dc0019",
                    padding: "10px",
                    borderRadius: "8px",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor:
                        currentTheme.palette === "light"
                          ? "#dc0019"
                          : "#dc0019",
                    },
                    fontFamily: "raleWay",
                  }}
                >
                  Clear Cart
                </Button>
              )}
            </Box>

            {/*Card  */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                paddingY: "10px",
                maxHeight: "22rem",
                overflowY: supermarketCart.length !== 0 && "scroll",
              }}
            >
              {supermarketCart.length === 0 ? (
                <NoResult
                  notification="Your cart is empty!"
                  smallText="proceed to scan to start new order"
                  buttonText="Scan to add new order"
                  btn="true"
                  linkText="/mainScanner"
                />
              ) : (
                supermarketCart.map((item) => (
                  <CartItem item={item} key={item.id} />
                ))
              )}
              {merchantDetails.restaurant ? (
                <Button
                  onClick={() => setOTD()}
                  sx={{
                    backgroundColor: "var(--primary-red)",
                    color: "white",
                    width: "80%",
                    margin: "auto",
                    textTransform: "none",
                    padding: "10px 5px",
                  }}
                >
                  Make a Delivery Order or Pick-up{" "}
                </Button>
              ) : null}
            </Box>
            {/* Card end */}

            <ToastContainer />
          </Container>
        )}

        {merchantDetails.restaurant || supermarketCart.length !== 0 ? (
          <PlaceOrder
            restaurant={merchantDetails.restaurant}
            supermarketCart={supermarketCart}
          />
        ) : null}

        {/* NAVBAR */}

        {/* Modal 6* clear cart modal */}
        <Modal
          classetsName="scale-in-center"
          open={deleteAllCart}
          onClose={handleClose6}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card
            sx={{
              position: "absolute",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              bottom: 0,
              width: { xs: "100%", sm: "70%", lg: "31%" },
              left: { xs: "0", sm: "14%", lg: "34%" },
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 900,
                fontSize: "16px",
                lineHeight: "18.78px",
                marginY: "1rem",
                textAlign: "center",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
              id="modal-modal-title"
            >
              Are you sure you want to clear all items in your cart? This cannot
              be undone.
            </Typography>

            <Button
              onClick={() => handleClearCart()}
              sx={{
                background:
                  currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
                width: "95%",
                padding: "10px",
                borderRadius: "8px",
                color: "#fff",
                "&:hover": {
                  backgroundColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
                fontFamily: "raleWay",
                fontWeight: "700",
              }}
            >
              Yes, Clear Cart
            </Button>
            <Button
              onClick={() => handleClose6()}
              sx={{
                width: "95%",
                padding: "10px",
                borderRadius: "8px",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
                borderColor: "#dc0019",
                fontFamily: "raleWay",
                fontWeight: "700",

                "&:hover": {
                  borderColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
              }}
              variant="outlined"
            >
              No,Go back
            </Button>
          </Card>
        </Modal>
        {/* Modal 6  clear ends*/}
        <Navbar />
      </Box>
    </AuthProvider>
  );
};

export default Cart;
