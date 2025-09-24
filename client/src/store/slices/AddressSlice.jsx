import { createAsyncThunk, createSlice, isRejected } from "@reduxjs/toolkit";
import { addNewAddressAction, removeAddressAction } from "../../services/ApiActions";
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

export const removeAddress = createAsyncThunk(
  'address/remove',
  async({id},{rejectWithValue}) => 
    await removeAddressAction(id)
      .then(res => res)
      .catch(err => rejectWithValue(err.message || 'Failed to remove address'))
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
    },
    clearAddressList: (state) => {
      state.addressList = []
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressList = action.payload;
        state.error = null;
      })
      .addCase(newAddress.fulfilled, (state, action) => {
        const { address, message } = action.payload;
        let newList = state.addressList;
        if(address?.is_default){
          newList = state.addressList.map(el => ({...el, is_default:false}));
        }
        state.addressList = [address, ...newList]
        toast.success(message, {position: 'top-center'})
        state.error = null;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        const { removed, newDefault } = action?.payload;
        state.addressList = state.addressList.filter(el => el?._id?.toString() !== removed);
        const newList = [];
        for(const el of state.addressList){
          if(el?._id?.toString() !== removed){
            if(newDefault && el?._id?.toString() === newDefault){
              newList.push({
                ...el,
                is_default: true
              })
            }else{
              newList.push(el)
            }
          }
        }
        state.addressList = newList;
        state.error = null;
      })
      .addMatcher(isRejected(fetchAddresses, newAddress, removeAddress), (state, action) => {
        state.error = action.payload;
      })
  }
})

export const { makeAddressDefault, clearAddressList, clearError } = addressSlice.actions;

export default addressSlice.reducer;