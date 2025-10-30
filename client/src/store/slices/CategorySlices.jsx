import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategories } from "../../services/FetchDatas";

export const fetchCategories = createAsyncThunk(
  'get-categories',
  async(_,{rejectWithValue}) => 
    await getCategories()
    .then(response => response)
    .catch(err => rejectWithValue(err.message || "Failed to fetch categories!"))
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categoryList: [],
    categoryLoading: false,
    error: null
  },
  reducers: {
    setAllCategories: (state, action) => {
      state.categoryList = action?.payload;
      state.error = null;
    },
    addCategory: (state, action) => {
      state?.categoryList?.unshift(action?.payload);
      state.error = null;
    },
    updateCategory: (state, action) => {
      const updated = action?.payload;
      state.categoryList = state?.categoryList?.map(el => el?._id === updated?._id ? updated : el);
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryList = action.payload;
        state.categoryLoading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.error;
      })
  }
})

export const { setAllCategories, addCategory, updateCategory } = categorySlice.actions;

export default categorySlice.reducer;