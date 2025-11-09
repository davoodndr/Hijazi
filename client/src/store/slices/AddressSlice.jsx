import { createAsyncThunk, createSlice, isRejected } from "@reduxjs/toolkit";
import { addNewAddressAction, removeAddressAction } from "../../services/ApiActions";
import { getAddressList } from "../../services/FetchDatas";

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

export const removeAddressSync = createAsyncThunk(
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
    setAddressList: (state, action) => {
      state.addressList = action?.payload;
      state.error = null;
    },
    addAddress: (state, action) => {
      const address = action?.payload;
      let newList = state.addressList;
      if(address?.is_default){
        newList = state.addressList.map(el => ({...el, is_default:false}));
      }
      state.addressList = [address, ...newList]
      state.error = null;
    },
    updateAddress: (state, action) => {
      const updated = action?.payload;
      const oldDefault = state?.addressList?.find(el => el?.is_default);

      if(updated?.is_default){
        if(oldDefault){
          state.addressList = state.addressList.map(el =>{
            if(el?._id === oldDefault?._id && el?._id !== updated?._id){
              return { ...el, is_default: false }
            }else if(el?._id === updated?._id){
              return updated;
            }else{
              return el
            }
          })
        }else{
          state.addressList = state.addressList.map(el => el?._id === updated?._id ? updated : el);
        }
      }else{
        if(oldDefault){
          state.addressList = state.addressList.map(el => el?._id === updated?._id ? updated : el);
        }else{
          state.addressList = state.addressList.map(el => el?._id === updated?._id ? 
            { ...updated, is_default: true } : el
          );
        }
      }

      if (!state.addressList.some(address => address.is_default)) {
        // If no address is marked as default after the update, set the first address as default
        const firstAddress = state.addressList[0];
        if (firstAddress) {
          firstAddress.is_default = true;
        }
      }
      state.error = null;
    },
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
    removeAddress: (state, action) => {
      const { removed_id, newDefault_id } = action?.payload;
      state.addressList = state.addressList.filter(el => el?._id !== removed_id);
      const newList = [];
      for(const el of state.addressList){
        if(el?._id?.toString() !== removed_id){
          if(newDefault_id && el?._id?.toString() === newDefault_id){
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
    },
    clearAddressList: (state) => {
      state.addressList = []
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  /* extraReducers: (builder) => {
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
  } */
})

export const { setAddressList, addAddress, updateAddress, removeAddress, makeAddressDefault, clearAddressList, clearError } = addressSlice.actions;

export default addressSlice.reducer;