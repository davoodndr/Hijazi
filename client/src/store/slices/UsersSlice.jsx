import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getUserDetail } from "../../services/FetchDatas";

export const fetchUser = createAsyncThunk('fetch-users',async () => {
  return await getUserDetail()
  .then(response => response);
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isLoading: true
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.user = action.payload;
      state.isLoading = true;
    }),
   builder.addMatcher(
    isAnyOf(fetchUser.fulfilled, fetchUser.rejected), (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    }
   )
  }
})

export const { setUser } = userSlice.actions;

export default  userSlice.reducer