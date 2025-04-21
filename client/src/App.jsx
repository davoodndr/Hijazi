import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/User/Home"
import UserLayout from "./pages/User/UserLayout"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
