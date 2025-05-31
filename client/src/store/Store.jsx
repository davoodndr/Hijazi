import { configureStore } from "@reduxjs/toolkit"
import  userReducer  from "./slices/UsersSlice"
import commonReducer from './slices/CommonSlices'
import productReducer from './slices/ProductSlices'
import categoryReducer from './slices/CategorySlices'
import brandReducer from './slices/BrandSlice'
import cartReducer from './slices/CartSlice'
import wishlistReducer from './slices/WishlistSlice'

let preloadedCart;
try {
  
  const savedCart = localStorage.getItem('cart');
  if(savedCart){
    preloadedCart = JSON.parse(savedCart)
  }

} catch (error) {
  console.warn("Failed to load cart from localStorage", error);
}

const preloadedState = {
  cart: preloadedCart
};

const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState
})

store.subscribe(() => {
  const state = store.getState();
  const cartState = state.cart;
  localStorage.setItem('cart', JSON.stringify(cartState));
})

export default store;