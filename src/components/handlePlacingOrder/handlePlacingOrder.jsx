import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvalidPin from "../InvalidPin";
import add from "../../assets/add-square.svg";
import {
  clearRestaurantCart,
  clearMerchantState,
} from "../../util/slice/merchantSlice";
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
import phoneLogo from "../../images/phoneLogo.svg";
import OTD1 from "../../images/OTD1.svg";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Modal } from "@mui/material";
import { AuthProvider } from "../../util/AuthContext";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthAxios } from "../../helpers/axiosInstance";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Restaurant from "../../components/restaurant";
import { getLandmarks } from "../../hooks/useGetLandMarks";
import {
  resetState,
  setLandmarks,
  setLocation,
  setLandmarkCost,
} from "../../util/slice/merchantSlice";
import { useMyLocation } from "../../hooks/useLocation";
import { useLocation } from "react-router-dom";
import LandmarkModal from "../landmarksModal";
export const PlaceOrder = ({ supermarketCart, restaurant }) => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const dispatch = useDispatch();

  const [text, setText] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [openLocationOptions, setOpenLocationOptions] = useState(false);
  const { userDetails } = useSelector((state) => state.merchantReducer);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const handlePhoneNoBlur = () => {
    if (!phoneNo) {
      setPhoneNoError("Please enter your phone number");
      setText(true);
    }
  };
  const handlePhoneNoChange = (event) => {
    const value = event.target.value;
    setPhoneNo(value);
    if (!value) {
      setPhoneNoError("Please enter your phone number");
      setText(true);
    } else if (!/^0([89][01]|70)\d{8}$/i.test(value)) {
      setText(true);
      setPhoneNoError("Invalid phone number");
    } else {
      setText(false);
      setPhoneNoError("");
    }
  };

  const [pins, setPins] = useState(["", "", "", ""]);
  const [newPins, setNewPins] = useState(["", "", "", ""]);
  const [confirmNewPins, setConfirmNewPins] = useState(["", "", "", ""]);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [superMarketKey, setSuperMarketKey] = useState("");
  const [successResponse, setSuccessResponse] = useState(false);
  const [superMarketSuccessResponse, setSuperMarketSuccessResponse] =
    useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [orderData, setOrderData] = useState();
  const pinRef = [useRef(), useRef(), useRef(), useRef()];
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const pinReffs = [useRef(), useRef(), useRef(), useRef()];
  const [showInvalidPin, setShowInvalidPin] = useState(false);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [showOrderText, setShowOrderText] = useState(true);
  const [openCreatePinSuccessModal, setOpenCreatePinSuccessModal] =
    useState(false);
  const superMarket = useSuperMarket(superMarketKey);
  const notify = (message) => {
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

  const handleShowOrderText = () => {
    setShowInsufficientBalance(false);
    setShowInvalidPin(false);
    setShowOrderText(true);
  };

  const calculateTotalPrice = () => {
    if (supermarketCart?.length === 0) {
      return 0;
    }

    let totalPrice = 0;

    supermarketCart?.forEach((cartItem) => {
      totalPrice += cartItem.price;
    });

    return totalPrice;
  };
  const {
    orders,
    data: merchantDetails,
    takeAwayPrice,
    myLocation,
    landmarkCost,
    OTDOrderOnClickId,
    OTDRestaurantId,
    OTDRestaurants,
    isOTD,
    landmarks,
    deliveryDetails,
    totalAmount,
  } = useSelector((state) => state.merchantReducer);

  const ordersDelivery = orders.filter(
    (order) => order.orderType === "delivery"
  );
  const ordersPickUp = orders.filter((order) => order.orderType === "pick-up");
  const ordersEatIn = orders.filter((order) => order.orderType === "eat-in");
  const ordersTakeaway = orders.filter(
    (order) => order.orderType === "eat-out"
  );
  const itemInCart = orders?.some((order) => order.items.length > 0);

  const handleOpen = () => {
    // calling the modals if its restaurant or supermarket...
    // chechandleOpendisabledking if there are any items in cart...
    if (restaurant || isOTD) {
      if (location.pathname === "/cart") {
        !itemInCart
          ? notify("No Item in Cart!")
          : ordersDelivery.length > 0 && landmarkCost?.amount !== undefined
          ? navigate("/restaurant-checkout")
          : landmarkCost?.amount === undefined && ordersDelivery.length > 0
          ? notify("Choose a Landmark!")
          : itemInCart
          ? setOpen(true)
          : notify("No items in your cart!");
      } else {
        setOpen(true);
      }
    } else {
      supermarketCart?.length !== 0
        ? setOpen(true)
        : notify("you have no item in your cart");
    }
  };
  const handleOpen2 = () => setOpen2(true);
  const handleOpen3 = () => {
    setOpen3(true);
  };
  const handleOpen4 = () => {
    setOpen4(true);
  };
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleClose3 = () => setOpen3(false);
  const handleClose4 = () => setOpen4(false);

  const handleClose5 = () => {
    setSuccessResponse(false);
    setOpen2(false);
    setOpen(false);
    dispatch(resetState());
    dispatch(clearRestaurantCart());
    dispatch(clearMerchantState());
    navigate("/orders");
  };
  const handleClose8 = () => {
    superMarketSuccessResponse(false);
    setOpen2(false);
    setOpen(false);
  };

  const handleNavigateToOrders = () => {
    dispatch(resetState());
    dispatch(clearRestaurantCart());
    dispatch(clearMerchantState());

    navigate("/orders");
  };

  const handleClose7 = () => {
    setOpenReceipt(false);
  };
  const closeLocationOptions = () => {
    setOpenLocationOptions(false);
  };
  function handleOpenLocationOptions() {
    setOpenLocationOptions(true);
  }

  const handlePinKeyDown = (index, e) => {
    if (index > 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
      pinRef[index - 1].current.focus();
    } else if (index === 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed in the first field and it's empty, focus remains in the first field
      e.preventDefault(); // Prevent the Backspace key from navigating away
    } else if (e.key === "Backspace" && e.target.selectionStart === 0) {
      // If Backspace is pressed at the beginning of the field, move focus to the previous input field and set cursor position to the end
      pinRef[index - 1].current.focus();

      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        pinRef[index - 1].current.setSelectionRange(1, 1);
      });
    }
  };
  const handleNewPinKeyDown = (index, e) => {
    if (index > 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
      pinRefs[index - 1].current.focus();
    } else if (index === 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed in the first field and it's empty, focus remains in the first field
      e.preventDefault(); // Prevent the Backspace key from navigating away
    } else if (e.key === "Backspace" && e.target.selectionStart === 0) {
      // If Backspace is pressed at the beginning of the field, move focus to the previous input field and set cursor position to the end
      pinRefs[index - 1].current.focus();

      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        pinRefs[index - 1].current.setSelectionRange(1, 1);
      });
    }
  };
  const handleConfirmNewPinsKeyDown = (index, e) => {
    if (index > 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
      pinReffs[index - 1].current.focus();
    } else if (index === 0 && e.key === "Backspace" && e.target.value === "") {
      // If Backspace is pressed in the first field and it's empty, focus remains in the first field
      e.preventDefault(); // Prevent the Backspace key from navigating away
    } else if (e.key === "Backspace" && e.target.selectionStart === 0) {
      // If Backspace is pressed at the beginning of the field, move focus to the previous input field and set cursor position to the end
      pinReffs[index - 1].current.focus();

      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        pinReffs[index - 1].current.setSelectionRange(1, 1);
      });
    }
  };

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);

      if (value.length === 0 && index > 0) {
        // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
        pinRef[index - 1].current.focus();
      } else if (index < pinRef.length - 1 && value.length === 1) {
        // If a digit is entered and it's not the last field, move focus to the next input field
        pinRef[index + 1].current.focus();
      }
    }
  };
  const handleNewPinChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const firstNewPins = [...newPins];
      firstNewPins[index] = value;
      setNewPins(firstNewPins);

      if (value.length === 0 && index > 0) {
        // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
        pinRefs[index - 1].current.focus();
      } else if (index < pinRefs.length - 1 && value.length === 1) {
        // If a digit is entered and it's not the last field, move focus to the next input field
        pinRefs[index + 1].current.focus();
      }
    }
  };
  const handleConfirmNewPins = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newPins = [...confirmNewPins];
      newPins[index] = value;
      setConfirmNewPins(newPins);

      if (value.length === 0 && index > 0) {
        // If Backspace is pressed and the field is empty (not the first field), move focus to the previous input field
        pinReffs[index - 1].current.focus();
      } else if (index < pinReffs.length - 1 && value.length === 1) {
        // If a digit is entered and it's not the last field, move focus to the next input field
        pinReffs[index + 1].current.focus();
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    handleClose6();
  };

  // handle create pin starts

  const sendPasswordToEndpoint = async (pin) => {
    const token = getCookie("authToken");
    try {
      const response = await AuthAxios({
        url: "/transaction/create-pin",
        method: "POST",
        data: { pin },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const noti = error.response.data.message;
      setTimeout(() => {
        notify(noti);
      }, 1000);
      throw new Error(error.response);
    }
  };

  const mutation = useMutation(sendPasswordToEndpoint, {
    onSuccess: (response) => {
      setOpenCreatePinSuccessModal(true);
      setTimeout(() => {
        setOpenCreatePinSuccessModal(false);
        setOpen4(false);
      }, 3000);
      queryClient.invalidateQueries("passwords"); // Optionally, invalidate relevant queries after the mutation
    },
    onError: (response) => {
      setNewPins(["", "", "", ""]);
      setConfirmNewPins(["", "", "", ""]);
    },
  });

  const handleCreatePin = () => {
    // Check if all the PINs have been entered
    const allPinsEntered = newPins.every((pin) => pin !== "");
    const allConfirmedPinsEntered = confirmNewPins.every((pin) => pin !== "");

    if (allPinsEntered || allConfirmedPinsEntered) {
      if (JSON.stringify(newPins) === JSON.stringify(confirmNewPins)) {
        // api call
        const matchedPasswordString = newPins.join("");
        mutation.mutate(matchedPasswordString);
      } else {
        notify("Pins do not match! try again");
      }
    } else {
      notify("Please enter all four PIN digits.");
    }
  };

  // Handle create pin ends

  // complete order starts

  const sendPinToEndpoint = async (pin) => {
    const token = getCookie("authToken");
    try {
      const response = await AuthAxios({
        url: "/transaction/verify-pin",
        method: "POST",
        data: { pin },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      const noti = error.response.data.message;

      setTimeout(() => {
        if (noti === "Invalid pin") {
          setShowInvalidPin(true);
          setButtonDisabled(false);
          setShowOrderText(false);
        } else {
          notify(error.response.data.message);
        }
      }, 1000);
      throw new Error(error.response);
    }
  };
  const sendDataToEndpoint = async (payLoad) => {
    const result = JSON.stringify(payLoad, null, 2);

    const objData = { payload: result };
    const token = getCookie("authToken");
    try {
      const response = await AuthAxios({
        url: "/cart-supermarket",
        method: "POST",
        data: objData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const noti = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;

      setTimeout(() => {
        if (noti === "Insufficient Funds") {
          setButtonDisabled(false);
          setShowInsufficientBalance(true);
          setShowOrderText(false);
          setPins(["", "", "", ""]);
        }
      }, 1000);
      throw new Error(error.response);
    }
  };
  const ordersToSend = orders
    .filter((order) => order.items.length > 0)
    .map((item) => {
      const { menu, ...rest } = item;
      return rest;
    });

  const sendRestaurantDataToEndpoint = async (payLoad) => {
    // const result = JSON.stringify(payLoad, null, 2);
    const result = JSON.stringify(payLoad, null, 2);
    const objData = { payload: result };
    const token = getCookie("authToken");
    try {
      const response = await AuthAxios({
        url: "/cart",
        method: "POST",
        data: objData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const noti = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;
      console.log(noti);

      setTimeout(() => {
        if (noti === "Insufficient Funds") {
          setShowInsufficientBalance(true);
          setShowOrderText(false);
          setButtonDisabled(false);
          setPins(["", "", "", ""]);
        }
      }, 1000);
      throw new Error(error.response);
    }
  };
  let packCost =
    ordersDelivery.length > 0
      ? takeAwayPrice * ordersDelivery.length
      : ordersPickUp.length > 0
      ? takeAwayPrice * ordersPickUp.length
      : takeAwayPrice * ordersTakeaway.length;

  let restaurantAmount =
    ordersDelivery.length > 0
      ? totalAmount + Number(packCost) + (Number(landmarkCost?.amount) || 0)
      : ordersEatIn.length > 0
      ? totalAmount
      : totalAmount + Number(packCost);

  let restaurantCommission =
    Number(((1 / 100) * restaurantAmount).toFixed(2)) || 0;
  const totalPrice =
    restaurant || isOTD
      ? restaurantAmount + restaurantCommission
      : calculateTotalPrice();
  const commissionCal = (1 / 100) * totalPrice;
  const commission = commissionCal.toFixed(2);
  const superMarketId = superMarket?.data ? superMarket?.data?.id : "";

  const restaurantPayLoad = {
    commission: restaurantCommission,
    category: "restaurant",
    restaurantId: merchantDetails?.restaurant?.id,
    totalAmount: totalPrice,
    paymentType: "WALLET",
    orders: ordersToSend,
  };

  const deliveryPayload = {
    commission: restaurantCommission,
    isHomeDelivery: true,
    phoneNumber: deliveryDetails.phoneNumber,
    address: deliveryDetails.deliveryAddress,
    category: "restaurant",
    deliveryFee: `${landmarkCost?.amount} `,
    restaurantId: OTDOrderOnClickId,
    totalAmount: totalPrice,
    paymentType: "WALLET",
    orders: ordersToSend,
  };

  const pickUpPayload = {
    commission: restaurantCommission,
    isHomeDelivery: true,
    category: "restaurant",
    restaurantId: OTDOrderOnClickId,
    totalAmount: totalPrice,
    paymentType: "WALLET",
    orders: ordersToSend,
  };

  const mutationOrder = useMutation(sendPinToEndpoint, {
    onSuccess: (response) => {
      // api to save cart
      restaurant
        ? mutationRestaurantData.mutate(restaurantPayLoad)
        : ordersDelivery.length > 0
        ? mutationRestaurantData.mutate(deliveryPayload)
        : ordersPickUp.length > 0
        ? mutationRestaurantData.mutate(pickUpPayload)
        : mutationData.mutate(payLoad);
      queryClient.invalidateQueries("pins"); // Optionally, invalidate relevant queries after the mutation
    },
    onError: (response) => {
      console.log(response);

      setPins(["", "", "", ""]);
    },
  });
  const mutationData = useMutation(sendDataToEndpoint, {
    onSuccess: (response) => {
      setOrderData(response);
      setSuperMarketSuccessResponse(true);
      setButtonDisabled(false);
      setTimeout(() => {
        setSuperMarketSuccessResponse(false);
        setOpenReceipt(true);
      }, 3000);
    },
    onError: (response) => {
      setButtonDisabled(false);

      setNewPins(["", "", "", ""]);
      setConfirmNewPins(["", "", "", ""]);
    },
  });
  const mutationRestaurantData = useMutation(sendRestaurantDataToEndpoint, {
    onSuccess: (response) => {
      console.log(response);
      setOrderData(response);
      setSuccessResponse(true);
    },
    onError: (response) => {
      console.log(response);

      setNewPins(["", "", "", ""]);
      setConfirmNewPins(["", "", "", ""]);
    },
  });

  const handleSubmit = () => {
    setButtonDisabled(true);
    // Check if all the PINs have been entered
    const allPinsEntered = pins.every((pin) => pin !== "");

    if (allPinsEntered) {
      setButtonDisabled(true);
      const matchedPins = pins.join("");
      // Api for verify pin
      mutationOrder.mutate(matchedPins);
    } else {
      notify("Please enter all four PIN digits.");
      setButtonDisabled(false);
    }
  };

  // Dara to send to complete order endpoint start

  const productId = supermarketCart?.map((item) => {
    return {
      EAN: item.EAN,
      quantity: item.quantity,
      price: item.price,
    };
  });

  // const commissionCal = (0.5 / 100) * totalPrice;
  // const commission = commissionCal.toFixed(2);
  // const superMarketId = superMarket.data ? superMarket.data.id : "";
  // test

  const payLoad = {
    commission: commission,
    supermarketId: superMarketId,
    category: "supermarket",
    totalAmount: totalPrice,
    paymentType: "WALLET",
    orders: productId,
  };

  const orderItemsList = supermarketCart?.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      productName: item.description,
      productImage: item.image,
      size: item.weight.toString(),
    };
  });

  const orderLoad = [
    {
      id: orderData ? orderData?.orderInfo?.id : "",
      commission: commission,
      supermarketId: superMarketId,
      total: totalPrice.toString(),
      order: orderItemsList,
      customerName: orderData
        ? orderData?.orderInfo?.user?.firstName +
          " " +
          orderData?.orderInfo?.user?.lastName
        : "",
    },
  ];

  // end test

  // data to send to complete order endpoint end
  // complete order ends

  const navigate = useNavigate();
  const currentTheme = useTheme();
  const location = useLocation();
  const locationData = useMyLocation();
  locationData
    .then((coords) => {
      dispatch(
        setLocation({ latitude: coords.latitude, longitude: coords.longitude })
      );
    })
    .catch((err) => console.log(err));

  useEffect(() => {
    const val = localStorage.getItem("myData");
    if (val) {
      setSuperMarketKey(val);
    }
  }, []);
  const OTDLandmarks = OTDRestaurants?.find(
    (item) => item.restaurant.id == OTDOrderOnClickId
  );
  function handleSaveDeliveryCost(amount, location) {
    dispatch(setLandmarkCost({ amount, location }));
    setOpenLocationOptions(false);
  }
  return (
    <>
      <ToastContainer />
      {merchantDetails?.restaurant !== undefined || isOTD ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            bottom: "-5px",
            width: { xs: "100%", sm: "60%", md: "30%", lg: "30%" },
            padding: "1.5rem",
            gap: ".5rem",
            justifyContent: "start",
            backgroundColor: "white",
            right: { xs: "1px", sm: "19%", lg: "35%" },
            // background:
            //   currentTheme.palette.type === "light" ? "" : "#2C2C2E",
            borderRadius: currentTheme.palette.type === "light" ? "" : "10px",
            textAlign: "center",
            background: currentTheme.palette.type === "light" ? "" : "#3E3E3E",
            boxShadow:
              currentTheme.palette.type === "light"
                ? " 2px -18px 93px -5px rgba(0,0,0,0.1) inset"
                : "",
            marginBottom: "5rem",
          }}
        >
          <Box>
            {(restaurant && ordersTakeaway.length > 0) || isOTD ? (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography> Take-Away Pack(+1) </Typography>
                <Typography>
                  {" "}
                  {(takeAwayPrice || 0) +
                    " " +
                    "x" +
                    " " +
                    (ordersDelivery.length > 0
                      ? ordersDelivery.length
                      : ordersPickUp.length > 0
                      ? ordersPickUp.length
                      : ordersTakeaway.length > 0
                      ? ordersTakeaway.length
                      : 0)}
                </Typography>
              </Box>
            ) : null}
            {ordersDelivery.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  gap: ".4em",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ whiteSpace: "nowrap", fontSize: ".9em" }}>
                  {" "}
                  Delivery Fee{" "}
                </Typography>
                {!landmarkCost?.amount ? (
                  <Button
                    onClick={() => handleOpenLocationOptions()}
                    sx={{
                      color: "var(--currency-green)",
                      minWidth: "30px",
                      padding: "0",
                      cursor: "pointer",
                      textTransform: "none",
                      fontSize: ".75em",
                      fontWeight: "600",
                      textAlign: "right",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {" "}
                    Tap to Select your nearest location
                  </Button>
                ) : (
                  <Typography
                    onClick={() => setOpenLocationOptions(true)}
                    sx={{
                      color: "var(--currency-green)",
                      fontSize: "1em",
                      fontWeight: "600",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    {landmarkCost?.location +
                      " " +
                      "|" +
                      " " +
                      landmarkCost?.amount}{" "}
                  </Typography>
                )}{" "}
              </Box>
            ) : null}{" "}
            {itemInCart ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography> Service Charge </Typography>
                <Typography> ₦{restaurantCommission} </Typography>
              </Box>
            ) : null}{" "}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "raleWay",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
                fomtWeight: "900",
                fontSize: "16px",
              }}
            >
              Grand Total
            </Typography>
            <Typography
              sx={{
                fontFamily: "raleWay",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
                fomtWeight: "900",
                fontSize: "16px",
              }}
            >
              <FormattedPrice amount={totalPrice || 0} />
            </Typography>
          </Box>

          <Box>
            <Button
              onClick={handleOpen}
              sx={{
                background:
                  currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
                padding: "10px",
                fontWeight: "1000",
                width: "100%",
                textTransform: "capitalize",
                borderRadius: "8px",
                color: "#fff",
                "&:hover": {
                  backgroundColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
                fontFamily: "raleWay",
              }}
            >
              {ordersDelivery.length > 0 && location.pathname === "/cart"
                ? "Checkout"
                : "Proceed to payment"}
            </Button>
          </Box>
        </Box>
      ) : null}
      {!isOTD &&
        !merchantDetails.restaurant &&
        supermarketCart?.length !== 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              bottom: "10px",
              width: { xs: "100%", sm: "60%", md: "30%", lg: "30%" },
              padding: "1.5rem",
              gap: "2rem",
              justifyContent: "start",
              right: { xs: "1px", sm: "19%", lg: "35%" },
              background:
                currentTheme.palette.type === "light" ? "" : "#2C2C2E",
              borderRadius: currentTheme.palette.type === "light" ? "" : "10px",
              textAlign: "center",
              boxShadow:
                currentTheme.palette.type === "light"
                  ? " 2px -18px 93px -5px rgba(0,0,0,0.1) inset"
                  : "#2C2C2E",
              marginBottom: "5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                  fomtWeight: "900",
                  fontSize: "16px",
                }}
              >
                Grand Total
              </Typography>
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                  fomtWeight: "900",
                  fontSize: "16px",
                }}
              >
                <FormattedPrice amount={totalPrice} />
              </Typography>
            </Box>

            <Box>
              <Button
                onClick={handleOpen}
                sx={{
                  background:
                    currentTheme.palette.type === "light"
                      ? "#dc0019"
                      : "#dc0019",
                  padding: "10px",
                  fontWeight: "1000",
                  width: "100%",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor:
                      currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                  },
                  fontFamily: "raleWay",
                }}
              >
                {ordersDelivery?.length > 0 && location.pathname === "/cart"
                  ? "Checkout"
                  : "Proceed to payment"}
              </Button>
            </Box>
          </Box>
        )}
      {/* Modal 1  modal for purchase*/}
      <Modal
        className="scale-in-center"
        open={open}
        onClose={handleClose}
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
              fontWeight: 600,
              fontSize: "13px",
              lineHeight: "18.78px",
              marginY: "1rem",
              color: currentTheme.palette.type === "light" ? "#000" : "#fff",
            }}
            id="modal-modal-title"
          >
            Sure to Purchase?
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 900,
                fontSize: "13px",
                lineHeight: "18.78px",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
            >
              Are you sure want to purchse these items for{" "}
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  fontWeight: 600,
                  fontSize: "13px",
                  lineHeight: "18.78px",
                  color:
                    currentTheme.palette.type === "light"
                      ? "#C57600"
                      : "#C57600",
                }}
              >
                &#8358;{totalPrice}?{" "}
              </Typography>
            </Typography>
          </Box>

          <Button
            onClick={handleOpen2}
            sx={{
              background:
                currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
              padding: "10px, 16px, 10px, 16px",
              width: { xs: "300px", sm: "333px", md: "333px", lg: "333px" },
              height: "48px",
              fontSize: "16px",
              borderRadius: "8px",
              textTransform: "capitalize",
              fontWeight: "1000",
              color: "#fff",
              "&:hover": {
                backgroundColor:
                  currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
              },
              fontFamily: "raleWay",
            }}
          >
            Yes, Purchase
          </Button>
          <Button
            onClick={() => handleClose()}
            sx={{
              width: "95%",
              padding: "10px, 16px, 10px, 16px",
              width: { xs: "300px", sm: "333px", md: "333px", lg: "333px" },
              height: "48px",
              fontSize: "16px",
              borderRadius: "8px",

              textTransform: "capitalize",
              fontWeight: "1000",
              color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              borderColor: "#dc0019",
              fontFamily: "raleWay",
              "&:hover": {
                borderColor:
                  currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
              },
            }}
            variant="outlined"
          >
            No, Go back
          </Button>
        </Card>
      </Modal>
      {/* Modal 1 ends*/}
      {/* Modal 2*  modal for complete order */}
      <Modal
        className="scale-in-center"
        open={open2}
        onClose={handleClose2}
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
          {showOrderText && (
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "18.78px",
                textAlign: "center",
                marginY: "1rem",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
              id="modal-modal-title"
            >
              Enter your transaction pin to complete your order.
            </Typography>
          )}

          {/* invalid pin info starts  */}

          {showInvalidPin && <InvalidPin />}

          {/* invalid pin info ends   */}

          <Box
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                margin: "auto",
                width: "100%",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {pins.map((pin, index) => (
                  <TextField
                    onFocus={() => handleShowOrderText()}
                    sx={{
                      "& input": {
                        fontSize: "3rem",
                        padding: "0",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#CACACA",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CACACA", // Set the border color on hover here
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#C57600", // Set the border color on focus here
                        },
                      },
                    }}
                    key={index}
                    variant="outlined"
                    type="password"
                    value={pin}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
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

              <Button
                onClick={handleSubmit}
                disabled={mutationData.isLoading || buttonDisabled}
                sx={{
                  background:
                    currentTheme.palette.type === "light"
                      ? "#dc0019"
                      : "#dc0019",
                  width: "100%",
                  padding: "10px, 16px, 10px, 16px",
                  textTransform: "capitalize",
                  fontWeight: "1000",
                  width: {
                    xs: "300px",
                    sm: "333px",
                    md: "333px",
                    lg: "333px",
                  },
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor:
                      currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                  },
                  fontFamily: "raleWay",
                }}
              >
                {mutationData.isLoading || buttonDisabled ? (
                  <CircularProgress size="1.2rem" sx={{ color: "white" }} />
                ) : (
                  "Complete Order"
                )}
              </Button>
              <Button
                onClick={() => handleClose2()}
                sx={{
                  width: "100%",
                  marginTop: "-0.9rem",
                  padding: "10px, 16px, 10px, 16px",
                  textTransform: "capitalize",
                  fontWeight: "1000",
                  width: {
                    xs: "300px",
                    sm: "333px",
                    md: "333px",
                    lg: "333px",
                  },
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                  borderColor: "#dc0019",
                  fontFamily: "raleWay",
                  "&:hover": {
                    borderColor:
                      currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                  },
                }}
                variant="outlined"
              >
                Go back
              </Button>

              <Box>
                <Button
                  onClick={() => handleOpen3()}
                  sx={{
                    fontFamily: "raleWay",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#DC0019",
                  }}
                >
                  Forget PIN
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    my: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "raleWay",
                      fontSize: "13px",
                      fontWeight: 1000,
                      color:
                        currentTheme.palette.type === "light"
                          ? "#000"
                          : "#eeee",
                    }}
                  >
                    Don't have a pin yet?
                  </Typography>

                  <Typography
                    onClick={() => handleOpen4()}
                    sx={{
                      fontFamily: "raleWay",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#dc0019",
                    }}
                  >
                    Create one
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Modal>
      {/* Modal 2 ends*/}
      {/* Modal 3   modal for forget pin*/}
      <Modal
        className="scale-in-center"
        open={open3}
        onClose={handleClose3}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 900,
                fontSize: "16px",
                lineHeight: "18.78px",
                marginY: "1rem",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
              id="modal-modal-title"
            >
              Reset PIN
            </Typography>
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "18.78px",
                marginY: "1rem",
                color:
                  currentTheme.palette.type === "light" ? "#C57600" : "#C57600",
              }}
              id="modal-modal-title"
            >
              (1/3)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "18.78px",
                textAlign: "center",
                color:
                  currentTheme.palette.type === "light" ? "#000" : "#d7d7d7",
              }}
              id="modal-modal-title"
            >
              Please enter the phone number you registered with Check
            </Typography>

            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 900,
                fontSize: "14px",
                lineHeight: "18.78px",
                marginLeft: "1em",
                color:
                  currentTheme.palette.type === "light" ? "#000" : "#d7d7d7",
              }}
              id="modal-modal-title"
            >
              Phone Number
            </Typography>

            <TextField
              sx={{
                width: { xs: "300px", sm: "100%", md: "327px" },
                mx: "auto",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: `${text ? "#DC0019" : "#CACACA"}`, // Set the desired border color here
                  },
                  "&:hover fieldset": {
                    borderColor: `${text ? "#DC0019" : "#CACACA"}`, // Set the border color on hover here
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: `${text ? "#DC0019 " : "#C57600"}`, // Set the border color on focus here
                  },
                },
              }}
              onChange={handlePhoneNoChange}
              onBlur={handlePhoneNoBlur}
              value={phoneNo}
              required
              helperText={phoneNoError && <span>{phoneNoError}</span>}
              placeholder="Enter your phone number"
              variant="outlined"
              id="phone-number"
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <img src={phoneLogo} alt="e-logo" />
                    &nbsp;&nbsp;
                  </InputAdornment>
                ),
              }}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </Box>

          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              minWidth: "100%",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              sx={{
                background:
                  currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
                width: {
                  xs: "300px",
                  sm: "333px",
                  md: "333px",
                  lg: "333px",
                },
                padding: "10px, 16px, 10px, 16px",
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  backgroundColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
                fontFamily: "raleWay",
              }}
            >
              Proceed
            </Button>
            <Button
              onClick={() => handleClose3()}
              sx={{
                width: {
                  xs: "300px",
                  sm: "333px",
                  md: "333px",
                  lg: "333px",
                },
                padding: "10px, 16px, 10px, 16px",
                textTransform: "capitalize",
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
                borderColor: "#dc0019",
                fontFamily: "raleWay",
                "&:hover": {
                  borderColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
              }}
              variant="outlined"
            >
              Go back
            </Button>
          </Box>
        </Card>
      </Modal>
      {/* Modal 3 ends*/}
      {/* Modal 4*   modal for create pin */}
      <Modal
        className="scale-in-center"
        open={open4}
        onClose={handleClose4}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 900,
                fontSize: "16px",
                lineHeight: "18.78px",
                textAlign: "center",
                marginY: "1rem",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
              id="modal-modal-title"
            >
              You are almost set!, just your transaction Pin
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: "0.8rem",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  fontWeight: 900,
                  fontSize: "16px",
                  lineHeight: "18.78px",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                }}
                id="modal-modal-title"
              >
                New Pin
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {newPins.map((pin, index) => (
                  <TextField
                    sx={{
                      "& input": {
                        fontSize: "3rem",
                        padding: "0",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#CACACA",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CACACA", // Set the border color on hover here
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#C57600", // Set the border color on focus here
                        },
                      },
                    }}
                    key={index}
                    variant="outlined"
                    type="password"
                    value={pin}
                    onChange={(e) => handleNewPinChange(index, e.target.value)}
                    onKeyDown={(e) => handleNewPinKeyDown(index, e)}
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 1, // Limit input to one character
                      style: { textAlign: "center" }, // Center-align the input
                    }}
                    inputRef={pinRefs[index]}
                  />
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: "0.8rem",
                my: "1rem",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "raleWay",
                  fontWeight: 900,
                  fontSize: "16px",
                  lineHeight: "18.78px",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                }}
                id="modal-modal-title"
              >
                Re-enter New Pin
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {confirmNewPins.map((pin, index) => (
                  <TextField
                    sx={{
                      "& input": {
                        fontSize: "3rem",
                        padding: "0",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#CACACA",
                        },
                        "&:hover fieldset": {
                          borderColor: "#CACACA", // Set the border color on hover here
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#C57600", // Set the border color on focus here
                        },
                      },
                    }}
                    key={index}
                    variant="outlined"
                    type="password"
                    value={pin}
                    onChange={(e) =>
                      handleConfirmNewPins(index, e.target.value)
                    }
                    onKeyDown={(e) => handleConfirmNewPinsKeyDown(index, e)}
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 1, // Limit input to one character
                      style: { textAlign: "center" }, // Center-align the input
                    }}
                    inputRef={pinReffs[index]}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              minWidth: "100%",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={handleCreatePin}
              disabled={mutation.isLoading}
              sx={{
                background:
                  currentTheme.palette.type === "light" ? "#dc0019" : "#dc0019",
                width: {
                  xs: "300px",
                  sm: "333px",
                  md: "333px",
                  lg: "333px",
                },
                padding: "10px, 16px, 10px, 16px",
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                color: "#fff",
                "&:hover": {
                  backgroundColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
                fontFamily: "raleWay",
              }}
            >
              {mutation.isLoading ? (
                <CircularProgress size="1.2rem" sx={{ color: "white" }} />
              ) : (
                "Proceed"
              )}
            </Button>
            <Button
              onClick={() => handleClose4()}
              sx={{
                width: "95%",
                padding: "10px, 16px, 10px, 16px",
                width: "333px",
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                width: {
                  xs: "300px",
                  sm: "333px",
                  md: "333px",
                  lg: "333px",
                },
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
                borderColor: "#dc0019",
                fontFamily: "raleWay",
                "&:hover": {
                  borderColor:
                    currentTheme.palette === "light" ? "#dc0019" : "#dc0019",
                },
              }}
              variant="outlined"
            >
              Go back
            </Button>
          </Box>
        </Card>
      </Modal>
      {/* Modal 4 ends*/}
      {/* Modal 5* success response for restaurant & supermarket*/}
      {isOTD || supermarketCart?.length === 0 ? (
        <Modal
          className="scale-in-center"
          open={successResponse}
          onClose={handleClose5}
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
              minHeight: "60%",
            }}
          >
            <Box
              sx={{
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100% ",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  margin: "auto",
                  marginTop: "-6rem",
                }}
              >
                <img className="gif-img" src={successGif} alt="gif" />
              </Box>

              <Typography
                sx={{
                  fontFamily: "raleWay",
                  fontWeight: 600,
                  fontSize: "20px",
                  textAlign: "center",
                  color:
                    currentTheme.palette.type === "light" ? "#000" : "#fff",
                  marginTop: "-2rem",
                  marginBottom: "2rem",
                }}
                id="modal-modal-title"
              >
                Your Order has been placed sucessfully
              </Typography>

              <Button
                onClick={() => handleNavigateToOrders()}
                sx={{
                  background: "#dc0019",
                  padding: "10px",
                  fontWeight: "1000",
                  width: "100%",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#dc0019",
                  },
                  fontFamily: "raleWay",
                }}
              >
                Okay
              </Button>
            </Box>
          </Card>
        </Modal>
      ) : (
        <Dialog
          fullScreen
          open={superMarketSuccessResponse}
          onClose={handleClose8}
          TransitionComponent={Transition}
        >
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100% ",
            }}
          >
            {/* <img className="gif-img" src={successGif} alt="gif" /> */}
            <CheckRoundedIcon
              sx={{
                fontSize: "4rem",
                background: "#008000",
                borderRadius: "50% ",
                padding: "1rem",
                color: "white",
                marginBottom: "1.7rem",
              }}
            />
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
              Payment Successful!
            </Typography>
            <Typography
              sx={{
                fontFamily: "raleWay",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "18.78px",
                textAlign: "center",
                color: currentTheme.palette.type === "light" ? "#000" : "#fff",
              }}
              id="modal-modal-title"
            >
              Generating Receipt.....
            </Typography>
          </Box>
        </Dialog>
      )}
      {/* Modal 5  ends*/}
      {/* Modal 7 receipt dialog */}
      <Dialog
        fullScreen
        open={openReceipt}
        onClose={handleClose7}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            width: "100%",
            height: "100% ",
          }}
        >
          <CartReceipt
            orderData={orderData ? orderData : ""}
            orderLoad={orderLoad ? orderLoad : []}
            // cart={supermarketCart ? supermarketCart : []}
            cart={supermarketCart ? supermarketCart : ordersToSend}
          />
        </Box>
      </Dialog>
      {/* Modal 7 receipt dialog  ends*/}
      {/* Modal 9 create pin success */}
      <Dialog
        fullScreen
        open={openCreatePinSuccessModal}
        onClose={setOpenCreatePinSuccessModal}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <CheckRoundedIcon
            sx={{
              fontSize: "4rem",
              background: "#008000",
              borderRadius: "50% ",
              padding: "1rem",
              color: "white",
              marginBottom: "1.7rem",
            }}
          />
          <Box
            sx={{
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "raleWay",
                letterSpacing: "0.2em",
                lineHeight: "2em",
                textAlign: "center",
                color:
                  currentTheme.palette.type === "light" ? "#000000" : "#EEEEEE",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Your PIN has been created successfully...
            </Typography>
          </Box>
        </Box>
      </Dialog>
      {/* Modal 9  create pin success  ends*/}
      {/* Dialog for Location Options   */}
      {openLocationOptions ? (
        <LandmarkModal
          handleCost={handleSaveDeliveryCost}
          OTDLandmarks={OTDLandmarks?.landmarks}
          close={closeLocationOptions}
        />
      ) : null}{" "}
      {/* insufficient funds modal 8  start */}
      <InsufficientFund
        totalPrice={totalPrice}
        showInsufficientBalance={showInsufficientBalance}
        setShowInsufficientBalance={setShowInsufficientBalance}
      />
      {/* insufficient funds ends */}
    </>
  );
};
