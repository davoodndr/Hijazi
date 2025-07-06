import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCoupons } from "../../services/FetchDatas";
import toast from "react-hot-toast";

export const fetchCoupons = createAsyncThunk(
  'coupons/fetch-coupons',
  async(_,{rejectWithValue}) => 
    await getCoupons()
    .then(res => res)
    .catch(err => rejectWithValue(err.message || "Failed to fetch coupons!"))
)

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    couponList: [],
    error: null
  },
  reducers: {
    addCoupon: (state, action) => {
      state.couponList = state.couponList.unshift(action.payload);
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.couponList = action.payload;
        state.error = null;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{ position: 'top-center'})
      })
  }
})

export const { addCoupon } = couponSlice.actions;

export default couponSlice.reducer;