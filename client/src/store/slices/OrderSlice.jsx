import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    setAllOrders: (state, action) => {
      state.ordersList = action?.payload;
    },
    addOrder: (state, action) => {
      state.ordersList.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const order = action?.payload;
      // should keep this as the list pattern differ from view order pattern
      state.ordersList = state?.ordersList?.map(el => {
        if(el?._id === order?._id){
          return {
            ...el,
            ...order
          }
        }
        return el
      })
    },
    clearOrders: (state) => {
      state.ordersList = []
    }
  },
  /* extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersList = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload;
      })
  } */
})

export const getOrder = (state, order_no) => {
  return state.orders.ordersList.find(order => order.order_no === order_no);
}

export const { setAllOrders, addOrder, updateOrder, clearOrders } = orderSlice.actions;

export default orderSlice.reducer;