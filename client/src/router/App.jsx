import { BrowserRouter, Routes, Route } from "react-router"
import Home from "../pages/User/Home"
import UserLayout from "../pages/User/UserLayout"
import Register from "../pages/User/Auth/Register"
import Login from "../pages/User/Auth/Login"
import SearchPage from "../pages/User/SearchPage"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "../store/slices/UsersSlice"
import PublicRoutes from './PublicRoutes'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser())
  },[dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<PublicRoutes><Register /></PublicRoutes>} />
          <Route path="login" element={<PublicRoutes><Login /></PublicRoutes>} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
