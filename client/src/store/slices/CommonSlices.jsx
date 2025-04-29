import { createSlice } from "@reduxjs/toolkit";

const commonSlices = createSlice({
  name: 'common',
  initialState: {
    loading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setLoading } = commonSlices.actions;

export default commonSlices.reducer;