import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBrands } from "../../services/FetchDatas";

export const fetchBrands = createAsyncThunk('fetch-brands', async() => {
  return await getBrands().then(res => res)
})

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brandList: [],
    brandLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brandLoading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brandList = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brandLoading = false;
        state.error = action.error;
      })
  }
})

export default brandSlice.reducer