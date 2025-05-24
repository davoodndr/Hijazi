import React from 'react'
import { Route, Routes } from 'react-router'
import UserLayout from "../../pages/User/UserLayout"
import PublicRoutes from "./UserPublicRoutes"
import { Suspense } from 'react'
import LoadingFallOff from '../../components/ui/LoadingFallOff'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const Register = React.lazy(() => import("../../pages/User/Auth/Register"))
const Login = React.lazy(() => import("../../pages/User/Auth/Login"))
const Home = React.lazy(() => import("../../pages/User/Home"))
const ProductListing = React.lazy(() => import("../../pages/User/ProductListing"))
const SearchPage = React.lazy(() => import("../../pages/User/SearchPage"))
const ProductPage = React.lazy(() => import("../../pages/User/ProductPage"))

const UserRouter = ({user, isLoading}) => {

  const { loading } = useSelector(state => state.common);

  return (
    <>
    <Suspense fallback={<LoadingFallOff loading={true} />}>
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<PublicRoutes><Register /></PublicRoutes>} />
          <Route path="login" element={<PublicRoutes><Login /></PublicRoutes>} />

          {/* search page */}
          <Route path="search" element={<SearchPage />} />

          {/* product listing */}
          <Route path="collections" element={<ProductListing />} />

          {/* product view */}
          <Route path="product" element={<ProductPage />} />

        </Route>
      </Routes>
    </Suspense>
    
    <LoadingFallOff loading={ loading } />

    </>
  )
}

export default UserRouter