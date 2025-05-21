import { BrowserRouter, Route, Routes} from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "../store/slices/UsersSlice"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"

function App() {

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUser())
  },[dispatch])

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/*" element={<UserRouter user={user} isLoading={isLoading} />} />
        <Route path="/admin/*" element={<AdminRouter user={user} isLoading={isLoading} />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
