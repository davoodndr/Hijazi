import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: 'variants',
  initialState: {
    variants: []
  },
  reducers: {
    setVariants: (state, action) => {
      state.variants = action.payload
    }
  }
})

export const { setVariants } = productSlice.actions;

export default productSlice.reducer;