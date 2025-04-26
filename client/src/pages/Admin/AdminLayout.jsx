import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
        <Outlet />
      {/* <Footer /> */}
      
    </>
  )
}

export default AdminLayout