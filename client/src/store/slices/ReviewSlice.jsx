import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    error: null
  },
  reducers: {
    setAllReviews: (state, action) => {
      state.reviews = action?.payload;
    },
    updateReview: (state, action) => {
      const updated = action?.payload;
      state.reviews = state?.reviews?.map(el => el?._id === updated?._id ? updated : el);
    }
  }
})

export const { setAllReviews, updateReview } = reviewSlice.actions;

export default reviewSlice.reducer;