import { createSlice } from "@reduxjs/toolkit";
const merchantSlice = createSlice({
  name: "merchantDetails",
  initialState: {
    data: [],
    orderCart: [],
    refreshError:false,
    orders: [],
    userDetails: {},
    deliveryDetails: {},
    previewOrders: [],
    OTDRestaurants: null,
    orderInView: 0,
    categoryNameInView: "",
    totalAmount: 0,
    landmarkCost: 0,
    receiptInView: null,
    takeAwayPrice: 0,
    myLocation: {},
    landmarks: null,
    isOTD: false,
    OTDtype: "delivery",
    OTDOrderOnClickId: 0,
    OTDRestaurantId : 0,
  },
  reducers: {
    populateMerchantDetails: (state, action) => {
      state.data = action.payload;
    },
    setOTDRestaurantId: (state, action) => {
      state.OTDRestaurantId = action.payload;
    },
    setOTDOrderOnClickId: (state, action) => {
      state.OTDOrderOnClickId = action.payload;
      if (state.OTDOrderOnClickId === action.payload) {
        console.log("same restaurant");
      } else {
        state.orders = [];
      }
    },
    setLandmarkCost: (state, action) => {
      state.landmarkCost = action.payload;
    },
    clearMerchantState: (state, action) => {
      return {
        userDetails: {},
        data: [],
        orderCart: [],
        orders: [],
        deliveryDetails: {},
        previewOrders: [],
        OTDRestaurants: null,
        orderInView: 0,
        categoryNameInView: "",
        totalAmount: 0,
        landmarkCost: 0,
        receiptInView: null,
        takeAwayPrice: 0,
        myLocation: {},
        isOTD: false,
        landmarks: null,
        OTDtype: "delivery",
        OTDOrderOnClickId: 0,
      };
    },
    setDeliveryDetails: (state, action) => {
      state.deliveryDetails = action.payload;
    },
    setOTDtype: (state, action) => {
      state.OTDtype = action.payload;
      state.orders = state.orders.map((item) => {
        return { ...item, orderType: action.payload };
      });
    },
    setCategoryNameInView: (state, action) => {
      state.categoryNameInView = action.payload;
    },
    setRefreshError: (state, action) => {
      state.refreshError = action.payload;
    },
    addOrders: (state, action) => {
      let itemExists = state.orders.find(
        (item) => item.id === action.payload.id
      );
      if (!itemExists) {
        let addMenuObject = { ...action.payload };
        state.orders.push(addMenuObject);
      }
    },
    addItemsToCart: (state, action) => {
      const orderIndex = state.orders.findIndex(
        (item) => item.id === state.orderInView
      );
      let existingItem = state.orders[orderIndex]?.items?.find(
        (item) => item.name === action.payload.order.name
      );
      state.orders[orderIndex].menu = state.orders[orderIndex].menu.map(
        (item) => {
          if (item.id === action.payload.order.menuId) {
            return {
              ...item,
              added: true,
              canPreview: true,
              canEditPreview: true,
            };
          }
          return item;
        }
      );

      if (existingItem) {
        const updatedItem = { ...existingItem };
        updatedItem.subTotal = action.payload.order.subTotal;

        const itemIndex = state.orders[orderIndex].items.findIndex(
          (item) => item.name === action.payload.order.name
        );
        state.orders[orderIndex].items[itemIndex] = updatedItem;
      } else {
        state.orders[orderIndex]?.items?.push(action.payload.order);
      }

      if (state.orders[orderIndex]?.items.length > 0) {
        const amount = state.orders.reduce((acc, curr) => {
          const subTotal = curr?.items?.reduce((subTotal, item) => {
            return (subTotal += item.subTotal);
          }, 0);
          console.log(subTotal);
          return acc + subTotal;
        }, 0);

        // Update the amount and totalAmount
        const subTotal = state.orders[orderIndex]?.items?.reduce(
          (subTotal, item) => {
            return (subTotal += item.subTotal);
          },
          0
        );
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          totalAmount: subTotal,
        };

        state.totalAmount = amount;
      } else {
        // Handle the case where there are no orders
        state.totalAmount = 0;
      }
    },

    setOrderInView: (state, action) => {
      state.orderInView = action.payload;
    },
    setOrderCart: (state, action) => {
      state.orderCart = action.payload;
    },
    updateOrderType: (state, action) => {
      state.orders[state.orderInView - 1].orderType = action.payload;
    },
    addMenu: (state, action) => {
      const orderIndex = state.orders.findIndex(
        (item) => item.id === state.orderInView
      );

      state.orders[orderIndex] = {
        ...state.orders[orderIndex],
        menu: action.payload,
      };

      return state;
    },
    handleCountChange: (state, action) => {
      const orderIndex = state.orders.findIndex(
        (item) => item.id === state.orderInView
      );
      state.orders[orderIndex].menu = state.orders[orderIndex].menu?.map(
        (item) => {
          if (item.id === action.payload.id) {
            // Update the count when the condition is met

            if (action.payload.type === "add") {
              return {
                ...item,
                count: item.count + 1,
                subTotal: Number(item.price) * (item.count + 1),
              };
            } else if (action.payload.type !== "add" && item.count > 1) {
              return {
                ...item,
                count: item.count - 1,
                subTotal: Number(item.price) * (item.count - 1),
              };
            }
          }
          // Return the original item if the condition isn't met
          return item;
        }
      );
      return state;
    },
    removeOrder: (state, action) => {
      let index = action.payload - 1;
      state.totalAmount -= state.orders[index].totalAmount;

      state.orders = state.orders
        .filter((order) => order.id !== action.payload)
        .map((item, i) => {
          return {
            ...item,
            id: i + 1,
          };
        });
      // console.log(JSON.parse(JSON.stringify(state.orders[index])))
    },
    clearRestaurantCart: (state, action) => {
      state.orders = state.orders.filter((order) => order.id === 1);
      state.orders = [];
      state.orderInView = 0;
      state.categoryNameInView = "";
      state.totalAmount = 0;
      state.landmarkCost = {};
    },
    editStatusUpdate: (state, action) => {
      let neil = state.orders[state.orderInView - 1].menu;

      state.orders[state.orderInView - 1].menu = state.orders[
        state.orderInView - 1
      ].menu.map((item) => {
        if (item.id === action.payload) {
          return { ...item, added: false, canEditPreview: false };
        }
        return item;
      });
    },
    removeItemFromCart: (state, action) => {
      let index = state.orderInView - 1;
      // state.orders[index].totalAmount =

      state.orders[index].items = state.orders[index].items.filter(
        (item) => item.menuId !== action.payload.id
      );

      state.orders[index].menu = state.orders[index].menu.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            count: 1,
            added: false,
            subTotal: item.price,
            canPreview: false,
            canEditPreview: false,
          };
        }
        return item;
      });

      state.orders[index].totalAmount -= action.payload.subTotal;
    },
    resetState: (state, action) => {
      state.orders = [];
      state.orderInView = 0;
      state.categoryNameInView = "";
      state.totalAmount = 0;
      state.landmarkCost = {};
    },

    handlePreview: (state, action) => {
      state.previewOrders = state.orders[state.orderInView - 1]?.menu?.filter(
        (item) => item.canPreview
      );
    },
    showReceiptInView: (state, action) => {
      state.receiptInView = action.payload;
    },
    fillUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setTakeAwayPrice: (state, action) => {
      state.takeAwayPrice = action.payload;
    },
    setLocation: (state, action) => {
      state.myLocation = action.payload;
    },
    setLandmarks: (state, action) => {
      state.landmarks = action.payload;
    },
    initOTD: (state, action) => {
      state.isOTD = action.payload;
    },
    setOTDRestaurants: (state, action) => {
      state.OTDRestaurants = action.payload;
    },
    clearStateForOTD: (state, action) => {
      return {
        ...state,
        data: [],
        orders: [],
        landmark: 0,
        landmarks: null,
        landmarkCost: null,
        previewOrders: [],
        deliveryDetails: {},
      };
    },
    clearStateOuterOTD: (state, action) => {
      return {
        ...state,
        data: [],
        orders: [],
        landmark: 0,
        landmarks: null,
        previewOrders: [],
        deliveryDetails: {},
      };
    },
  },
});

export const {
  populateMerchantDetails,
  setOTDRestaurantId,
  addOrders,
  clearStateForOTD,
  fillUserDetails,
  removeOrder,
  setDeliveryDetails,
  showReceiptInView,
  setLandmarkCost,
  setOTDtype,
  addMenu,
  setTakeAwayPrice,
  setLocation,
  setRefreshError,
  orders,
  initOTD,
  takeAwayPrice,
  clearMerchantState,
  setOTDRestaurants,
  setLandmarks,
  handlePreview,
  setOTDOrderOnClickId,
  addItemsToCart,
  setOrderInView,
  removeItemFromCart,
  handleCountChange,
  editStatusUpdate,
  updateOrderType,
  setCategoryNameInView,
  resetState,
  orderCart,
  clearRestaurantCart,
  setOrderCart,
} = merchantSlice.actions;
export default merchantSlice.reducer;
