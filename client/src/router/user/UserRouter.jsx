import React from 'react'
import { Route, Routes } from 'react-router'
import Home from "../../pages/User/Home"
import UserLayout from "../../pages/User/UserLayout"
import Register from "../../pages/User/Auth/Register"
import Login from "../../pages/User/Auth/Login"
import SearchPage from "../../pages/User/SearchPage"
import PublicRoutes from "./UserPublicRoutes"

const UserRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<PublicRoutes><Register /></PublicRoutes>} />
        <Route path="login" element={<PublicRoutes><Login /></PublicRoutes>} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}

export default UserRouter