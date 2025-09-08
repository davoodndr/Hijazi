import { BrowserRouter, Route, Routes, useLocation} from "react-router"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchUser, setActiveRole } from "../store/slices/UsersSlice"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"
import { clearCart, fetchCart } from "../store/slices/CartSlice"
import { clearWishlist, fetchWishlist } from "../store/slices/WishlistSlice"
import { clearOrders, fetchOrders } from "../store/slices/OrderSlice"
import { fetchProducts } from "../store/slices/ProductSlices"
import { fetchBrands } from "../store/slices/BrandSlice"
import { fetchCategories } from '../store/slices/CategorySlices'
import { clearAddressList, fetchAddresses } from "../store/slices/AddressSlice"
import { clearOffers, fetchOffers } from "../store/slices/OfferSlice"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchOffers())
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
