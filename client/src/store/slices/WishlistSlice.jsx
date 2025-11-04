import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getWishlist } from "../../services/FetchDatas";
import { addToWishlistAction, removeFromWishlistAction } from "../../services/ApiActions";

export const fetchWishlist = createAsyncThunk(
  'whislist/fetchList',
  async(_,{rejectWithValue}) => 
    await getWishlist()
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to fetch wishlist'))
)

export const syncWishlistItem = createAsyncThunk(
  'wishlist/add-to-list',
  async({item},{rejectWithValue}) => 
    await addToWishlistAction(item)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to sync wishlist'))
)

export const deleteWishlistItem = createAsyncThunk(
  'wishlist/deleteItem',
  async({item},{rejectWithValue}) => 
    await removeFromWishlistAction(item)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to remove from wishlist'))
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    list: [],
    error: null
  },
  reducers: {
    setWishlist: (state, action) => {
      state.list = action?.payload;
      state.error = null;
    },
    addToList: (state, action) => {
      const item = action.payload;
      const existing = state?.list?.find(i => i.id === item.id);
      if(existing){
        toast.error("Items already exists in list",{position: 'top-center'})
      }else{
        state.list.push(item)
        toast.success("Item added to Wishlist",{position: 'top-center'})
      }
    },
    removeFromList: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.list = []
    }
  },
  /* extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(syncWishlistItem.fulfilled, (state, action) => {
        const { list } = action.payload;
        state.list = list;
        state.error = null;
      })
      .addCase(syncWishlistItem.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{position: 'top-center'})
      })
      .addCase(deleteWishlistItem.fulfilled, (state, action) => {
        const { list } = action.payload;
        state.list = list;
        state.error = null;
      })
      .addCase(deleteWishlistItem.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error,{position: 'top-center'})
      })
  } */
})

export const getWishlistCount = (state) => {
  return state?.wishlist?.list?.length;
}

export const { setWishlist, addToList, removeFromList, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;