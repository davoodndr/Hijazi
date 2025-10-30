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
    activeProduct: null,
    reviews: [],
    error: null,
  },
  reducers: {
    setAllProducts: (state, action) => {
      state.items = action?.payload
      state.error = null;
    },
    addProduct: (state, action) => {
      state.items = state.items.unshift(action.payload);
      state.error = null;
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map(el => el._id === updated._id ? updated : el);
      state.error = null;
    },
    setActiveProduct: (state, action) => {
      state.activeProduct = action?.payload;
      state.error = null;
    },
    setReviews: (state, action) => {
      state.reviews = action?.payload;
      state.error = null;
    },
    clearActiveProduct: (state) => {
      state.activeProduct = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
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

export const {
  setAllProducts,
  addProduct,
  updateProduct,
  setActiveProduct,
  setReviews,
  clearActiveProduct,
  clearReviews
} = productSlice.actions;

export default productSlice.reducer