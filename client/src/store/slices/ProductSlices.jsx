import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductList } from "../../services/FetchDatas";


export const fetchProducts = createAsyncThunk('fetch-produts',async () => {
  return await getProductList()
  .then(response => response);
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    productsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = false
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.error
      })
  }
})

export default productSlice.reducer