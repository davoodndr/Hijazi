import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductList } from "../../services/FetchDatas";


export const fetchProducts = createAsyncThunk(
  'products/fetch-produts',
  async () => {
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
  reducers: {
    addProduct: (state, action) => {
      state.items = state.items.unshift(action.payload);
      state.error = null;
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map(el => el._id === updated._id ? updated : el);
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true
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

export const { addProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer