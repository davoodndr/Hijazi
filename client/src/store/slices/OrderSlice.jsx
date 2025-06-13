import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getOrdersList } from "../../services/FetchDatas";

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async(_,{rejectWithValue}) =>
    await getOrdersList()
      .then(res => res)
      .catch(err => rejectWithValue(err.message || 'Failed to fetch orders'))
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    ordersList: [],
    error: null,
  },
  reducers: {
    addToOrders: (state, action) => {
      state.ordersList.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersList = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{position: 'top-center'})
      })
  }
})

export const getOrder = (state, order_no) => {
  return state.orders.ordersList.find(order => order.order_no === order_no);
}

export const { addToOrders } = orderSlice.actions;

export default orderSlice.reducer;