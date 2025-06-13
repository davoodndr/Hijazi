import { BrowserRouter, Route, Routes} from "react-router"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "../store/slices/UsersSlice"
import { fetchCategories } from "../store/slices/CategorySlices"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"
import { fetchCart } from "../store/slices/CartSlice"
import { fetchWishlist } from "../store/slices/WishlistSlice"
import { fetchOrders } from "../store/slices/OrderSlice"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthData = async() => {
      const { payload: user } = await dispatch(fetchUser());
      if(user?.roles?.includes('user')){
        dispatch(fetchCart())
        dispatch(fetchWishlist())
        dispatch(fetchOrders())
      }
    }
    fetchAuthData()
    dispatch(fetchCategories())
  },[dispatch])

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
