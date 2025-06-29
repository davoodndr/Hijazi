import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addNewAddressAction } from "../../services/ApiActions";
import { getAddressList } from "../../services/FetchDatas";
import toast from "react-hot-toast";

export const fetchAddresses = createAsyncThunk(
  'address/fetch',
  async(_,{rejectWithValue}) => 
    await getAddressList()
      .then(res => res)
      .catch(err => rejectWithValue(err.message || 'Failed to add new address'))
)

export const newAddress = createAsyncThunk(
  'address/createNew',
  async({data},{rejectWithValue}) => 
    await addNewAddressAction(data)
      .then(res => res)
      .catch(err => rejectWithValue(err.message || 'Failed to add new address'))
)

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addressList: [],
    error: null
  },
  reducers: {
    makeAddressDefault: (state, action) => {
      const { updated, old } = action.payload;
      state.addressList = state.addressList.map(el => {
        if(el._id === updated._id)
          return updated 
        else if(el._id === old._id)
          return old
        else
          return el
      })
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressList = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error, {position: 'top-center'})
      })
      .addCase(newAddress.fulfilled, (state, action) => {
        const { address, message } = action.payload;
        state.addressList.unshift(address);
        toast.success(message, {position: 'top-center'})
        state.error = null;
      })
      .addCase(newAddress.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error, {position: 'top-center'})
      })
  }
})

export const { makeAddressDefault } = addressSlice.actions;

export default addressSlice.reducer;