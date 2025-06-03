import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import { getCart } from '../../services/FetchDatas';
import { addToCartAction, removeFromCartAction } from '../../services/ApiActions';

export const fetchCart = createAsyncThunk(
  'cart/fetch-cart', 
  async(user_id) => 
    await getCart(user_id).then(res => res)
)

export const syncCartitem = createAsyncThunk(
  'cart/syncCartItem',
  async({user_id, item, type},{rejectWithValue}) => 
    await addToCartAction(user_id, item, type)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to sync cart item'))
)

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async({user_id, item},{rejectWithValue}) => 
    await removeFromCartAction(user_id, item)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to remove cart item'))
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:[],
    error: null
  },
  reducers: {

    addToCart: (state, action) => {
      const { item, type } = action.payload;
      const existing = state?.items?.find(i => i.id === item.id);

      if(item.quantity > item.stock){
        toast.error(`Only ${item.stock} in stock!`);
        return;
      }

      if(existing){

        if(!type){
          const existingQty = existing.quantity || 0;
          const totalQty = existingQty + item.quantity;

          if(totalQty > item.stock){
            toast.error(`Only ${item.stock} in stock!`);
            return;
          }

          existing.quantity += item.quantity || 1;
        }else{
          existing.quantity = item.quantity || 1
        }
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
    clearCart: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null
      })
      .addCase(syncCartitem.fulfilled, (state, action) => {
        const { newItem } = action.payload
        const index = state.items.findIndex(
          (item) => item.id === newItem.id
        );
        if (index > -1) {
          state.items[index].quantity = newItem.quantity;
        } else {
          state.items.push(newItem);
        }
        state.error = null;
      })
      .addCase(syncCartitem.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error, {position: 'top-center'})
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const { items } = action.payload;
        state.items = items;
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error, {position: 'top-center'})
      })
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
  //console.log(state.cart)
  return state?.cart?.items?.reduce((total, item) => total + item?.quantity,0)
}

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;