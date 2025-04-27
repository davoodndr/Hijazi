import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import PublicRoutes from './AdminPublicRoutes'
import ProtectedRoutes from './AdminProtectedRoutes'
import Login from '../../pages/Admin/auth/Login'
import Register from '../../pages/Admin/auth/Register'
import AdminLayout from '../../pages/Admin/AdminLayout'
import { Toaster } from 'react-hot-toast'
import AddUser from '../../pages/Admin/users/AddUser'
import ViewUser from '../../pages/Admin/users/ViewUser'

const AdminDashboard = React.lazy(() => import('../../pages/Admin/AdminDashboard'))
const UsersList = React.lazy(() => import('../../pages/Admin/users/UsersList'))

const AdminRouter = ({user, isLoading}) => {
  return (
    <>
      <Routes>
        <Route path="register" element={<PublicRoutes><Register /></PublicRoutes>} />
        <Route path="login" element={<PublicRoutes><Login /></PublicRoutes>} />
          
          <Route element={<ProtectedRoutes user={user} isLoading={isLoading} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="view-user" element={<ViewUser />} />
              </Route>
              
            </Route>
          </Route>

      </Routes>

      <Toaster
        position='top-right'
        toastOptions={{
          error: {
            style: {
              border: '1px solid var(--color-error-border)',
              backgroundColor: 'var(--color-error-border)',
              color: 'white'
            }
          },
          success: {
            style: {
              /* border: '1px solid var(--color-primary-50)', */
              backgroundColor: 'var(--color-green-500)',
              color: 'white'
            },
            iconTheme: {
              primary: '#fff',
              secondary: 'var(--color-green-600)'
            },
            duration: 2500
          }
        }}

        />
      
    </>
    
  )
}

export default AdminRouter