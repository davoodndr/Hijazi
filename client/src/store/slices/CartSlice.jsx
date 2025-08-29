import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import { getCart } from '../../services/FetchDatas';
import { addToCartAction, emptyCartAction, removeFromCartAction } from '../../services/ApiActions';

export const fetchCart = createAsyncThunk(
  'cart/fetch-cart', 
  async(_,{rejectWithValue}) => 
    await getCart()
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to fetch cart'))
)

export const syncCartitem = createAsyncThunk(
  'cart/syncCartItem',
  async({item, type},{rejectWithValue}) => 
    await addToCartAction(item, type)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to sync cart item'))
)

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async({item},{rejectWithValue}) => 
    await removeFromCartAction(item)
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to remove cart item'))
)

export const clearCartSync = createAsyncThunk(
  'cart/emptyCart',
  async(_,{rejectWithValue}) => 
    await emptyCartAction()
    .then(res => res)
    .catch(err => rejectWithValue(err.message || 'Failed to sync clear cart'))
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:[],
    checkoutItems:[],
    cartCount:0,
    cartSubTotal: 0,
    appliedCoupon: null,
    appliedCartOffer: null,
    error: null
  },
  reducers: {
    setCheckoutItems:  (state, action) => {
      state.checkoutItems = action.payload
    },
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
      state.checkoutItems = []
      state.cartCount = 0
      state.cartSubTotal =  0
      state.appliedCoupon =  null
      state.appliedCartOffer =  null
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload
    },
    setAppliedCartOffer: (state, action) => {
      state.appliedCartOffer = action.payload
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload
    },
    setCartSubTotal: (state, action) => {
      state.cartSubTotal = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null
      })
      .addCase(syncCartitem.fulfilled, (state, action) => {
        const { items } = action.payload
        state.items = items;
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
      .addCase(clearCartSync.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      })
      .addCase(clearCartSync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error, {position: 'top-center'})
      })
  }

})

export const getCartItem = (state, id) => {
  return state?.cart?.items?.find(item => item.id === id);
}

export const getCartTax = (state) => {
  const tax = state?.cart?.items?.reduce((total, item) => {

    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    const taxRate = item?.tax || 0.05;

    return total + price * taxRate * quantity;
  },0)

  return Number(tax).toFixed(2);
}

export const getItemsTotal = (state) => {
  const total = state?.cart?.items?.reduce((total, item) => 
    total + item?.price * item?.quantity
  ,0)

  return Number(total).toFixed(2);
}

export const getCartCount = (state) => {
  return state?.cart?.items?.reduce((total, item) => total + item?.quantity,0)
}

export const { setCart, setCheckoutItems, addToCart, removeFromCart, updateQuantity, clearCart, 
  setAppliedCoupon, setAppliedCartOffer } = cartSlice.actions;
export default cartSlice.reducer;