import { configureStore } from "@reduxjs/toolkit"
import  userReducer  from "./slices/UsersSlice"
import commonReducer from './slices/CommonSlices'
import variantReducer from './slices/VariantSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
    variants: variantReducer
  }
})

export default store;