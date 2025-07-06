import { BrowserRouter, Route, Routes} from "react-router"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "../store/slices/UsersSlice"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"
import { fetchCart } from "../store/slices/CartSlice"
import { fetchWishlist } from "../store/slices/WishlistSlice"
import { fetchOrders } from "../store/slices/OrderSlice"
import { fetchProducts } from "../store/slices/ProductSlices"
import { fetchBrands } from "../store/slices/BrandSlice"
import { fetchCategories } from '../store/slices/CategorySlices'
import { fetchAddresses } from "../store/slices/AddressSlice"
import { fetchCoupons } from "../store/slices/CouponSlice"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthData = async() => {
      const { payload: user } = await dispatch(fetchUser());
      if(user?.roles?.includes('user')){
        dispatch(fetchCart())
        dispatch(fetchWishlist())
        dispatch(fetchOrders())
        dispatch(fetchAddresses())
      }
    }
    fetchAuthData()
    dispatch(fetchCategories())
    dispatch(fetchCoupons())
    dispatch(fetchBrands())
    dispatch(fetchProducts())
  },[])

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/*" element={<UserRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
