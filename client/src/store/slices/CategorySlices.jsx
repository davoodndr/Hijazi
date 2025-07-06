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
  reducers: {},
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

export default categorySlice.reducer;