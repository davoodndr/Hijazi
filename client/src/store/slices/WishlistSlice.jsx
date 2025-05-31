import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    list: []
  },
  reducers: {
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
    clear: (state) => state.list = []
  }
})

export const getWishlistCount = (state) => {
  return state?.wishlist?.list?.length;
}

export const { addToList, removeFromList, clear } = wishlistSlice.actions;
export default wishlistSlice.reducer;