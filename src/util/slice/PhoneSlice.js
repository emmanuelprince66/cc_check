import { createSlice } from "@reduxjs/toolkit";

const phoneSlice = createSlice({
  name: "phone",
  initialState: {
    data: "",
  },
  reducers: {
    addNumber: (state, action) => {
      const newNumber = action.payload;

      state.data = newNumber;
    },
  },
});

export const { addNumber } = phoneSlice.actions;
export default phoneSlice.reducer;
