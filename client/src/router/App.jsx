import { BrowserRouter, Route, Routes} from "react-router"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "../store/slices/UsersSlice"
import { fetchCategories } from "../store/slices/CategorySlices"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser())
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
