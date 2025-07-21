import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOffers } from "../../services/FetchDatas";
import toast from "react-hot-toast";

export const fetchOffers = createAsyncThunk(
  'offers/fetch-offers',
  async(_,{rejectWithValue}) => 
    await getOffers()
    .then(res => res)
    .catch(err => rejectWithValue(err.message || "Failed to fetch offers!"))
)

const couponSlice = createSlice({
  name: 'offers',
  initialState: {
    offersList: [],
    error: null
  },
  reducers: {
    addCoupon: (state, action) => {
      state.offersList = state.offersList.unshift(action.payload);
      state.error = null;
    },
    clearOffers: (state, action) => {
      state.offersList = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offersList = action.payload;
        state.error = null;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{ position: 'top-center'})
      })
  }
})

export const { addCoupon, clearOffers } = couponSlice.actions;

export default couponSlice.reducer;