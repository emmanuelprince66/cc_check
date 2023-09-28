import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
  },
  reducers: {
    clearCart: (state) => {
      return {
        data: [],
      };
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.data.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.counter += 1;
        existingItem.price += newItem.price;
      } else {
        state.data.push({ ...newItem, quantity: newItem.counter }); // Initialize counter with 1
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      console.log(itemId);
      state.data = state.data.filter((item) => item.id !== itemId);
    },
    incrementCounter: (state, action) => {
      const itemId = action.payload;
      const itemToIncrement = state.data.find((item) => item.id === itemId);

      if (itemToIncrement) {
        itemToIncrement.counter += 1;
        itemToIncrement.price +=
          itemToIncrement.price / (itemToIncrement.counter - 1); // Increment the price by the original price per item
      }
    },
    decrementCounter: (state, action) => {
      const itemId = action.payload;
      const itemToDecrement = state.data.find((item) => item.id === itemId);

      if (itemToDecrement && itemToDecrement.counter > 1) {
        itemToDecrement.counter -= 1;
        const originalPricePerItem =
          itemToDecrement.price / (itemToDecrement.counter + 1);
        itemToDecrement.price = originalPricePerItem * itemToDecrement.counter;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementCounter,
  decrementCounter,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
