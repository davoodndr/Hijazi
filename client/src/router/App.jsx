import { BrowserRouter, Route, Routes, useLocation} from "react-router"
import AdminRouter from "./admin/AdminRouter"
import UserRouter from "./user/UserRouter"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/*" element={<UserRouter />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
