import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { placeOrderAction } from "../../services/ApiActions";
import toast from "react-hot-toast";
import Alert from "../../components/ui/Alert";

export const placeOrderSync = createAsyncThunk(
  'orders/placeOrder',
  async({order},{rejectWithValue}) =>
    await placeOrderAction(order)
      .then(res => res)
      .catch(err => rejectWithValue(err.message || 'Failed to place order'))
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderSync.fulfilled, (state, action) => {
        const { order, message } = action.payload;
        state.orders.unshift(order);
        state.error = null;
        showAlert(order)
      })
      .addCase(placeOrderSync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{position: 'top-center'})
      })
  }
})

const showAlert = (order) => {
  Alert({
    title:'Order Placed successfully',
    text: 'Thank you for puchasing the product from us. You can view it on the order detail page.',
    icon: 'success',
    customClass: {
      title: '!text-2xl !text-primary-300',
      htmlContainer: '!text-gray-400',
      popup: '!max-w-[430px]',
      icon: '!size-[5em]',
      confirmButton: 'border border-primary-400',
      cancelButton: '!bg-white border border-primary-400 !text-primary-400',
      actions: '!justify-center'
    },
    showCancelButton: true,
    cancelButtonText: 'Continue shoping',
    confirmButtonText: 'View my Order',
  })
  .then(res => {
    if(res.isConfirmed){
      console.log(order)
    }
  })
}

export default orderSlice.reducer;