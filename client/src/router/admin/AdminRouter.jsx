import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import PublicRoutes from './AdminPublicRoutes'
import ProtectedRoutes from './AdminProtectedRoutes'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import LoadingFallOff from '../../components/ui/LoadingFallOff'
import AdminLayout from '../../pages/Admin/AdminLayout'

const Login = React.lazy(() => import('../../pages/Admin/auth/Login'))
const Register = React.lazy(() => import('../../pages/Admin/auth/Register'))
const AdminDashboard = React.lazy(() => import('../../pages/Admin/AdminDashboard'))
const UsersList = React.lazy(() => import('../../pages/Admin/users/UsersList'))
const AddUser = React.lazy(() => import('../../pages/Admin/users/AddUser'))
const EditUser = React.lazy(() => import('../../pages/Admin/users/EditUser'))
const ViewUser = React.lazy(() => import('../../pages/Admin/users/ViewUser'))
const CategoryList = React.lazy(() => import('../../pages/Admin/categories/CategoryList'))
const BrandList = React.lazy(() => import('../../pages/Admin/brands/BrandList'))
const ProductList = React.lazy(() => import('../../pages/Admin/products/ProductList'))
const AddProduct = React.lazy(() => import('../../pages/Admin/products/AddProduct'))
const EditProduct = React.lazy(() => import('../../pages/Admin/products/EditProduct'))
const OrdersList = React.lazy(() => import('../../pages/Admin/orders/OrdersList'))
const ViewOrder = React.lazy(() => import('../../pages/Admin/orders/ViewOrder'))
const CouponList = React.lazy(() => import('../../pages/Admin/coupons/CouponList'))

const AdminRouter = () => {

  const { loading } = useSelector(state => state.common);

  return (
    <>
      <Suspense fallback={<LoadingFallOff loading={true} />}>
        <Routes>

          {/* public routes */}
          <Route element={<PublicRoutes />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          
          {/* protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              {/* users tab */}
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="edit-user" element={<EditUser />} />
                <Route path="view-user" element={<ViewUser />} />
              </Route>

              {/* categories tab */}
              <Route path='categories'>
                <Route index element={<CategoryList />} />
              </Route>
              {/* brands tab */}
              <Route path='brands'>
                <Route index element={<BrandList />} />
              </Route>
              {/* products tab */}
              <Route path='products'>
                <Route index element={<ProductList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path=":slug/edit" element={<EditProduct />} />
              </Route>
              {/* orders tab */}
              <Route path='orders'>
                <Route index element={<OrdersList />} />
                <Route path='view-order/:id' element={<ViewOrder />} />
              </Route>
              {/* coupons tab */}
              <Route path='coupons'>
                <Route index element={<CouponList />} />
              </Route>
              
            </Route>
          </Route>

        </Routes>
      </Suspense>

      <LoadingFallOff loading={ loading } />

      <Toaster
        position='top-right'
        toastOptions={{
          error: {
            style: {
              border: '1px solid var(--color-error-border)',
              backgroundColor: 'var(--color-error-border)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(255, 0, 0, 1)'
            }
          },
          success: {
            style: {
              /* border: '1px solid var(--color-primary-50)', */
              backgroundColor: 'var(--color-green-500)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0, 64, 0, 1)'
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