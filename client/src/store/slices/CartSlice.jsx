import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:[]
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);


      if(existing){
        existing.quantity += item.quantity || 1;
      }else{
        state.items.push({...item, quantity: item.quantity || 1})
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item =>  item.id === id);

      if(item) item.quantity = quantity;
    },
    clearCart: (state) => state.items = []
  }

})

export const getCartItem = (state, id) => {
  return state?.cart?.items?.find(item => item.id === id);
}

export const getCartTotal = (state) => {
  return state?.cart?.items?.reduce((total, item) => {
    return total + item?.price * item?.quantity;
  },0)
}

export const getCartCount = (state) => {
  return state?.cart?.items?.reduce((total, item) => total + item?.quantity,0)
}

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;