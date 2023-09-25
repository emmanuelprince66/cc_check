import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import arrowleft from "../../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import "./restaurant.css";
import add from "../../assets/add-square.svg";
import { Box, Button, Container } from "@mui/material";
import useMenu from "../../hooks/useMenu";
import useRestaurantCategory from "../../hooks/useRestaurantCategory";
import { useDispatch } from "react-redux";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  addOrders,
  setOTDOrderOnClickId,
  removeOrder,
  clearRestaurantCart,
  setOrderInView,
  setOTDtype,
} from "../../util/slice/merchantSlice";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import options from "../../assets/MoreOptions.svg";
import BackArrow from "../backArrow/BackArrow";
import RestaurantOrderModal from "../restaurantOrderModal";
import { useParams, useLocation } from "react-router-dom";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { useTheme } from "@mui/material";

const Restaurant = () => {
  const {
    orders,
    orderCart,
    data: merchantDetails,
    isOTD,
    OTDtype,
  } = useSelector((state) => state.merchantReducer);
  // console.log(merchantDetails)
  const navigate = useNavigate();

  const params = useParams();
  const currentTheme = useTheme();

  const location = useLocation();
  const dispatch = useDispatch();
  const [openOrderOptions, setOpenOrderOptions] = useState({
    id: null,
    status: false,
  });

  const [allCartOptions, setAllCartOptions] = useState(false);

  useEffect(() => {
    let firstOrder = {
      id: 1,
      amount: 0.0,
      orderType: isOTD ? "delivery" : "eat-in",
      items: [],
    };
    dispatch(addOrders(firstOrder));
  }, [orderCart, orders]);

  function handleNewOrders() {
    const maxId = orders.length + 1;
    let newOrder = {
      id: maxId,
      amount: 0.0,
      orderType: isOTD ? "delivery" : "eat-in",
      items: [],
    };
    dispatch(addOrders(newOrder));
  }
  function clearCart() {
    dispatch(clearRestaurantCart());
    setAllCartOptions(false);
  }
  function handleClickMenu(id) {
    dispatch(setOrderInView(id));
    navigate("/restaurant/menu");
  }
  function handleRemoveOrder(id) {
    dispatch(removeOrder(id));
    setOpenOrderOptions({ id: null, status: false });
  }
  function handleViewOptions(id) {
    setOpenOrderOptions({ id: id, status: true });
  }
  function handleOrderType(type) {
    dispatch(setOTDtype(type));
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        gap: "1em",
        flex: "1",
        marginBottom: "15em",
      }}
    >
      {(isOTD && location.pathname === "/cart") || !isOTD ? (
        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BackArrow />
          <Button
            sx={{
              border: "1px solid #CDCDCD",
              padding: ".7em",
              minWidth: "44px",
            }}
            onClick={() => setAllCartOptions(true)}
          >
            <MoreVertRoundedIcon
              sx={{
                color: currentTheme.palette.type === "light" ? "#000" : "#eeee",
              }}
            />
          </Button>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        {( location.pathname === "/cart") ? (
          <h1 className="h1-text">My Cart</h1>
        ) : null}

        {(isOTD && location.pathname === "/cart")  ? (
          <Box>
            <span
              style={{
                cursor: "pointer",
                backgroundColor:
                  OTDtype === "delivery" ? "var(--cart-deep-red)" : "#EDEDED",
                color: OTDtype === "delivery" ? "white" : "black",
                padding: ".5em .8em",
                borderRadius: " .5em ",
              }}
              onClick={() => handleOrderType("delivery")}
            >
              {" "}
              Delivery
            </span>
            <span
              style={{
                cursor: "pointer",
                backgroundColor:
                  OTDtype === "pick-up" ? "var(--cart-deep-red)" : "#EDEDED",
                color: OTDtype === "pick-up" ? "white" : "black",
                padding: ".5em .8em",
                borderRadius: "0em .5em .5em 0",
              }}
              onClick={() => handleOrderType("pick-up")}
            >
              {" "}
              Pick-Up
            </span>
          </Box>
        ) : null}
      </Box>

      <div
        style={{
          overflowY: "auto",
          marginBottom: "100px",
          flex: "1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          {orders.map((order, i) => {
            return (
              <Box
                key={i}
                sx={{
                  background:
                    currentTheme.palette.type === "light"
                      ? "#EAEAEA"
                      : "#333333",
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5em",
                }}
                padding={"1em"}
                borderRadius={".5em"}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <h2 style={{ fontSize: "1.3em" }}> Order {order?.id}</h2>
                  <Button
                    onClick={() => handleViewOptions(order.id)}
                    sx={{ padding: "0.7em", minWidth: "44px" }}
                  >
                    <MoreVertRoundedIcon
                      sx={{
                        color:
                          currentTheme.palette.type === "light"
                            ? "#000"
                            : "#eeee",
                      }}
                    />
                  </Button>
                </Box>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "2px 4px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--currency-green)",
                      fontWeight: "600",
                    }}
                  >
                    N {orders[order?.id - 1]?.amount}{" "}
                  </div>

                  {orders[order?.id - 1]?.items.length === 0 ? (
                    <div>
                      <Button
                        sx={{
                          color:
                            currentTheme.palette.type === "light"
                              ? "var(--primary-red)"
                              : "#eeee",
                          display: "flex",
                          padding: ".2em .2em .2em .4em",
                          textTransform: "none",
                          alignItems: "center",
                          border:
                            currentTheme.palette.type === "light"
                              ? "1px solid var(--primary-red)"
                              : "1px solid #eeee",
                        }}
                        onClick={() => handleClickMenu(order?.id)}
                      >
                        <span style={{ fontWeight: "600" }}>Add Items</span>
                        <ChevronRightRoundedIcon />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div></div>
              </Box>
            );
          })}
        </Box>
        <Button
          onClick={() => handleNewOrders(orders?.length)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px 0px",
            marginTop: "4em",
            gap: ".7em",
            width: "100%",
            textTransform: "none",
            color: currentTheme.palette.type === "light" ? "#000" : "#eeee",
            border:
              currentTheme.palette.type === "light"
                ? "1px solid var(--primary-red)"
                : "1px solid #eeee",
          }}
        >
          <AddBoxRoundedIcon
            sx={{
              color:
                currentTheme.palette.type === "light"
                  ? "var(--primary-red)"
                  : "#eeee",
            }}
          />
          <span
            style={{
              fontWeight: "600",
              color:
                currentTheme.palette.type === "light"
                  ? "var(--primary-red)"
                  : "#eee",
            }}
          >
            {" "}
            Add New Orders{" "}
          </span>
        </Button>
      </div>
      {openOrderOptions.status ? (
        <RestaurantOrderModal
          onDelButtonClick={() => handleRemoveOrder(openOrderOptions.id)}
          delText={"Delete Order"}
          id={openOrderOptions.id}
          ordersIn={orders[openOrderOptions.id - 1].items.length > 0}
          closeModal={() => setOpenOrderOptions(false)}
        />
      ) : null}
      {allCartOptions ? (
        <RestaurantOrderModal
          onDelButtonClick={clearCart}
          delText={"Clear Cart"}
          closeModal={() => setAllCartOptions(false)}
        />
      ) : null}
    </Container>
  );
};
export default Restaurant;
