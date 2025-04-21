import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/User/Home"
import UserLayout from "./pages/User/UserLayout"
import Register from "./pages/User/Auth/Register"
import Login from "./pages/User/Auth/Login"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
