import { configureStore } from "@reduxjs/toolkit"
import  userReducer  from "./slices/UsersSlice"
import commonReducer from './slices/CommonSlices'
import productReducer from './slices/ProductSlices'
import categoryReducer from './slices/CategorySlices'
import brandReducer from './slices/BrandSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
  }
})

export default store;