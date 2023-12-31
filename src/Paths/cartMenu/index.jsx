import { useEffect } from "react";
import useMenu from "../../hooks/useMenu";
import BackArrow from "../../components/backArrow/BackArrow";
import { useState } from "react";
import { useTheme } from "@mui/material";
import {
  Box,
  TextField,
  List,
  Button,
  Grid,
  InputAdornment,
  Skeleton,
  Typography,
  Container,
} from "@mui/material";
import "../../components/restaurant/restaurant.css";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import useRestaurantCategory from "../../hooks/useRestaurantCategory";
import {
  setOrderCart,
  addMenu,
  setTakeAwayPrice,
  updateOrderType,
  setCategoryNameInView,
  handlePreview,
} from "../../util/slice/merchantSlice";
import CartBox from "../../components/cartBox/cartBox";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
const RestaurantMenu = () => {
  const currentTheme = useTheme();
  const [id, setId] = useState(null);
  const [mode, setMode] = useState("eat-in");
  const [categoryInView, setCategoryInView] = useState(0);
  const [preview, setPreview] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const {
    data: merchantDetails,
    orders,
    isOTD,
    categoryNameInView,
    orderInView,
    orderCart,
    OTDOrderOnClickId,
    totalAmount,
    previewOrders,
  } = useSelector((state) => state.merchantReducer);
  const idToUse = isOTD
    ? OTDOrderOnClickId
    : merchantDetails.restaurant
    ? merchantDetails?.restaurant?.id
    : null;
  const menu = useMenu(idToUse);
  const category = useRestaurantCategory(idToUse);
  const navigate = useNavigate();
  // this adds the menu as the orderCart which can be used subsequently
  // adds other fields  - count,subTotal
  useEffect(() => {
    const filteredResult = menu?.data?.menu?.map((order) => {
      return { ...order, count: 1, subTotal: parseFloat(order.price) };
    });

    if (!orderCart || orderCart.length === 0) {
      dispatch(setOrderCart(filteredResult));
    }
  }, [orderInView, dispatch]);

  // this is called when the order viewing the menu has changed
  useEffect(() => {
    const filteredResult = menu?.data?.menu?.map((order) => {
      return { ...order, count: 1, subTotal: parseFloat(order.price) };
    });
    dispatch(setTakeAwayPrice(menu?.data?.takeAway?.price));
    if (!orders[orderInView - 1]?.menu) {
      dispatch(addMenu(filteredResult));
    }
  }, [orderInView, menu?.data?.menu]);
  // targets categoryName
  useEffect(() => {
    const selectedCategoryName =
      category?.data?.categories[categoryInView]?.name;
    if (selectedCategoryName) {
      dispatch(setCategoryNameInView(selectedCategoryName));
    }
  }, [category, orderCart, dispatch, categoryInView, categoryNameInView]);

  useEffect(() => {
    dispatch(handlePreview());
  }, [orders[orderInView - 1]?.menu]);

  function checkCategory(i, name) {
    dispatch(setCategoryNameInView(name));
    setCategoryInView(i);
  }
  function handleSaveToCart() {
    navigate("/cart");
  }
  function handleOrderType(type) {
    dispatch(updateOrderType(type));
  }
  function showPreview() {
    setPreview(true);
  }

  return (
    <div className="gpt3__restaurant">
      <Container>
        <Box display="flex" gap="1em">
          <BackArrow />
          <TextField
            label="Search Items"
            sx={{ "& .MuiInputBase-root": { height: "44px" } }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box display="flex" sx={{}} gap="1em" justifyContent="space-between">
          <div
            style={{ display: "flex", flexDirection: "column", gap: ".5em" }}
          >
            <span>Order {orderInView}</span>
            {orders[orderInView - 1]?.items?.length > 0 && !preview ? (
              <Button
                onClick={showPreview}
                sx={{
                  cursor: "pointer",
                  borderRadius: ".5em",
                  padding: ".2em .8em",
                  color: "grey",
                  border: "1px solid var(--primary-red)",
                }}
              >
                {" "}
                Preview{" "}
              </Button>
            ) : null}{" "}
          </div>
          {/* eat-in and takeaway buttons */}
          {!isOTD ? (
            <div
              style={{
                display: "grid",
                gap: ".5em",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <span
                style={{
                  width: "100%",
                  color:
                    orders[orderInView - 1]?.orderType === "eat-in"
                      ? "white"
                      : "black",
                  cursor: "pointer",
                  backgroundColor:
                    orders[orderInView - 1]?.orderType === "eat-in"
                      ? "var(--cart-deep-red)"
                      : "#EDEDED",
                  padding: ".5em .8em",
                  borderRadius: ".5em",
                }}
                onClick={() => handleOrderType("eat-in")}
              >
                Eat-In
              </span>
              <span
                style={{
                  width: "100%",
                  color:
                    orders[orderInView - 1]?.orderType !== "eat-out"
                      ? "black"
                      : "white",
                  cursor: "pointer",
                  backgroundColor:
                    orders[orderInView - 1]?.orderType === "eat-out"
                      ? "var(--cart-deep-red)"
                      : "#EDEDED",
                  padding: ".5em .8em",
                  borderRadius: " .5em .5em ",
                }}
                onClick={() => handleOrderType("eat-out")}
              >
                {" "}
                Takeaway
              </span>
            </div>
          ) : null}{" "}
        </Box>

        {/* Category List   */}
        {!preview ? (
          <Box>
            <List
              sx={{
                display: "flex",
                gap: "1em",
                padding: ".6px 0",
                "&:-webkit-scrollbar": { display: "none" },
                overflowX: "scroll",
                borderBottom: "1px solid #EAEAEA",
              }}
            >
              {category?.data?.categories?.map((item, i) => {
                return (
                  <li
                    onClick={() => checkCategory(i, item.name)}
                    style={{
                      whiteSpace: "noWrap",
                      cursor: "pointer",
                      listStyleType: " none",
                      color: categoryInView === i ? "var(--cart-deep-red)" : "",
                      borderBottom:
                        categoryInView === i
                          ? "1px solid var(--cart-deep-red)"
                          : "",
                      transition: "color 0.3s ease-in-out",
                    }}
                    key={i}
                  >
                    {item.name}
                  </li>
                );
              })}
            </List>
          </Box>
        ) : null}
        {/* the menu list itself , it handles the preview,menu and skeleton here */}
        <Grid
          container
          justifyContent="space-between"
          padding={"1em 0"}
          rowGap="1em"
        >
          {!orders[orderInView - 1]?.menu ? (
            <Skeleton variant="rectangular" width={210} height={118} />
          ) : !preview ? (
            orders[orderInView - 1]?.menu.map((item, i) => {
              return (
                <CartBox
                  key={i}
                  category={categoryNameInView}
                  itemInfo={item}
                  index={i}
                  id={orderInView}
                  preview={false}
                />
              );
            })
          ) : (
            orders[orderInView - 1]?.menu
              .filter((item) => item.canPreview)
              .map((item, i) => {
                return (
                  <CartBox
                    key={i}
                    // category={categoryNameInView}
                    preview={true}
                    itemInfo={item}
                    index={i}
                    id={orderInView}
                  />
                );
              })
          )}
        </Grid>
        {/* save button and amounnt */}
        <Box
          sx={{
            background:
              currentTheme.palette.type === "light"
                ? "var(--grey-cart-btn)"
                : "#eeee",
            display: "flex",
            insetInline: "0",
            alignItems: "center",
            width: { md: "33%", sm: "100%", xs: "100%" },
            position: "fixed",
            left: { xs: 0, sm: 0, md: "33.5%" },
            bottom: 0,
            height: "70px",
            fontSize: "10px",
            padding: "1rem",
            justifyContent: "space-between",
          }}
          bottom="0"
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "2em",
              color: currentTheme.palette.type === "ligth" ? "#fff" : "#000",
            }}
          >
            {orders[orderInView - 1]?.amount}
          </Typography>
          <Button
            onClick={handleSaveToCart}
            sx={{
              backgroundColor: "#EB001B",
              height: "30px",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "#EB001B" },
              width: "100px",
              minWidth: "auto",
            }}
          >
            {" "}
            Save{" "}
          </Button>
        </Box>
      </Container>
    </div>
  );
};
export default RestaurantMenu;
