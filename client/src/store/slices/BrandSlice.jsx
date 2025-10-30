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
  reducers: {
    setAllBrands: (state, action) => {
      state.brandList = action?.payload;
      state.error = null;
    },
    addBrand: (state, action) => {
      state?.brandList?.unshift(action?.payload);
      state.error = null;
    },
    updateBrand: (state, action) => {
      const updated = action?.payload;
      state.brandList = state?.brandList?.map(item => item._id === updated._id ? updated : item)
    }
  },
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

export const { setAllBrands, addBrand, updateBrand } = brandSlice.actions;

export default brandSlice.reducer