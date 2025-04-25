import React from 'react'
import { Route, Routes } from 'react-router'
import PublicRoutes from './AdminPublicRoutes'
import Login from '../../pages/Admin/auth/Login'
import Register from '../../pages/Admin/auth/Register'

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="register" element={<PublicRoutes><Register /></PublicRoutes>} />
      <Route path="login" element={<PublicRoutes><Login /></PublicRoutes>} />
    </Routes>
  )
}

export default AdminRouter