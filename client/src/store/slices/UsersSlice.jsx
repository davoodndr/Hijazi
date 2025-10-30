import { createAction, createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
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
    users: [],
    activeRole: 'user',
    isLoading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action?.payload?.user;
      state.isLoading = false;
    },
    addUser: (state, action) => {
      state?.users?.unshift(action?.payload)
      state.error = null;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      const updated = action?.payload;
      state.users = state?.users?.map(u => u._id === updated?._id ? updated : u)
    },
    updateUserStatus: (state, action) => {
      const { user_id, newStatus } = action?.payload;
      state.users = state?.users?.map(u => u._id === user_id ? {...u, status: newStatus} : u)
    },
    setAllUsers: (state, action) => {
      state.users = action?.payload;
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(logoutUser, (state) => {
      state.user = null;
      state.isLoading = false;
    })
    .addMatcher(isPending(fetchUser, updateRole), (state) => {
      state.isLoading = true;
    })
    .addMatcher(isFulfilled(fetchUser, updateRole), (state, action) => {
      state.user = action?.payload;
      state.isLoading = false;
    })
    .addMatcher(isRejected(fetchUser, updateRole),(state, action) => {
      state.error = action?.payload;
      state.isLoading = false
    })
  }
})

export const { setUser, addUser, updateUser, setActiveRole, setAllUsers, updateUserStatus } = userSlice.actions;

export default  userSlice.reducer