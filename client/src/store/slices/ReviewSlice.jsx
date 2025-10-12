import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    error: null
  },
  reducers: {
    fetchAllReviews: (state, action) => {
      state.reviews = action?.payload;
    }
  }
})

export const { fetchAllReviews } = reviewSlice.actions;

export default reviewSlice.reducer;