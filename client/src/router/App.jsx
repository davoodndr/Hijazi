import { BrowserRouter, Route, Routes, useLocation} from "react-router"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"

function App() {

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
