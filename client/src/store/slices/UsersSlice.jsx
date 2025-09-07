import { createAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getUserDetail } from "../../services/FetchDatas";
import { updateUserRole } from "../../services/ApiActions";

export const fetchUser = createAsyncThunk(
  'fetch-users',
  async (_,{rejectWithValue}) => 
    await getUserDetail()
      .then(response => response)
      .catch(err => rejectWithValue(err.message || "Failed to fetch user data"))
)

export const updateRole = createAsyncThunk(
  'update-user-role',
  async (role,{rejectWithValue}) => 
    await updateUserRole(role)
      .then(response => response)
      .catch(err => rejectWithValue(err.message || "Failed to update role"))
)

export const logoutUser = createAction('logout');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    activeRole: 'user',
    isLoading: true
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    }),
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.user = null;
      state.isLoading = false;
    }),
    builder.addCase(logoutUser, (state) => {
      state.user = null;
      state.isLoading = false;
    }),
    builder.addCase(updateRole.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    }),
    builder.addCase(updateRole.rejected, (state) => {
      state.user = null;
      state.isLoading = false;
    })
    /* builder.addMatcher(
      isAnyOf(fetchUser.fulfilled, fetchUser.rejected), (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      }
    ) */
  }
})

export const { setUser, setActiveRole } = userSlice.actions;

export default  userSlice.reducer