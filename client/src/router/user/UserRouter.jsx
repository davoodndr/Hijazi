import React from 'react'
import { Route, Routes } from 'react-router'
import UserLayout from "../../pages/User/UserLayout"
import PublicRoutes from "./UserPublicRoutes"
import ProtectedRoutes from "./UserProtectedRoutes"
import { Suspense } from 'react'
import LoadingFallOff from '../../components/ui/LoadingFallOff'
import { useSelector } from 'react-redux'

const Register = React.lazy(() => import("../../pages/User/Auth/Register"))
const Login = React.lazy(() => import("../../pages/User/Auth/Login"))
const Home = React.lazy(() => import("../../pages/User/Home"))
const ProductListing = React.lazy(() => import("../../pages/User/ProductListing"))
const SearchPage = React.lazy(() => import("../../pages/User/SearchPage"))
const ProductPage = React.lazy(() => import("../../pages/User/ProductPage"))
const UserCart = React.lazy(() => import("../../pages/User/UserCart"))
const Wishlist = React.lazy(() => import("../../pages/User/Wishlist"))
const Checkout = React.lazy(() => import("../../pages/User/Checkout"))
const Payment = React.lazy(() => import("../../pages/User/Payment"))
const OrderDetail = React.lazy(() => import("../../pages/User/OrderDetail"))
const UserDashboard = React.lazy(() => import("../../pages/User/Dashboard/UserDashboard"))
const UserProfile = React.lazy(() => import("../../pages/User/Dashboard/UserProfile"))
const UserOrders = React.lazy(() => import("../../pages/User/Dashboard/UserOrders"))
const Addresses = React.lazy(() => import("../../pages/User/Dashboard/Addresses"))

const UserRouter = () => {

  const { loading } = useSelector(state => state.common);

  return (
    <>
    <Suspense fallback={<LoadingFallOff loading={true} />}>
      <Routes>
        <Route path='/' element={<UserLayout />}>

          {/* public routes */}
          <Route element={<PublicRoutes />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="collections" element={<ProductListing />} />

          {/* product view */}
          <Route path="collections/:category/:subcategory/:product" element={<ProductPage />} />
          <Route path="cart" element={<UserCart />} />
          
          {/* protected routes */}
          <Route element={<ProtectedRoutes />}>

            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment" element={<Payment />} />
            <Route path="my-order/:order-no" element={<OrderDetail />} />
            <Route path="dashboard" element={<UserDashboard />} >
              <Route path='profile' element={<UserProfile />} />
              <Route path='orders' element={<UserOrders />} />
              <Route path='address-list' element={<Addresses />} />
            </Route>

          </Route>
          
        </Route>
        
      </Routes>
    </Suspense>
    
    <LoadingFallOff loading={ loading } />

    </>
  )
}

export default UserRouter