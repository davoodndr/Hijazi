import { configureStore } from "@reduxjs/toolkit"
import  userReducer  from "./slices/UsersSlice"
import commonReducer from './slices/CommonSlices'

const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer
  }
})

export default store;