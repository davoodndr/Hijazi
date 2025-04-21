import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    }
  }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer