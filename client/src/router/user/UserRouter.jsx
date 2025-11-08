import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import UserLayout from "../../pages/User/UserLayout"
import PublicRoutes from "./UserPublicRoutes"
import ProtectedRoutes from "./UserProtectedRoutes"
import { Suspense } from 'react'
import LoadingFallOff from '../../components/ui/LoadingFallOff'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, setCartItems } from '../../store/slices/CartSlice'
import { clearWishlist, setWishlist } from '../../store/slices/WishlistSlice'
import { setAllOffers } from '../../store/slices/OfferSlice'
import { setUser } from '../../store/slices/UsersSlice'
import { clearReviews, setAllProducts } from '../../store/slices/ProductSlices'
import { setAllBrands } from '../../store/slices/BrandSlice'
import { useQueryClient } from '@tanstack/react-query'
import { getAddressList, getBrands, getCart, getCategories, getOffers, getOrdersList, getProductList, getWallet, getWishlist } from '../../services/FetchDatas'
import { setAllCategories } from '../../store/slices/CategorySlices'
import { updateUserRole } from '../../services/ApiActions'
import { clearOrders, setAllOrders } from '../../store/slices/OrderSlice'
import { clearAddressList, setAddressList } from '../../store/slices/AddressSlice'
import { clearWallet, setWallet } from '../../store/slices/WalletSlice'

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
const Wallet = React.lazy(() => import("../../pages/User/Dashboard/Wallet"))
const ProductReviews = React.lazy(() => import("../../pages/User/ProductReviews"))

const UserRouter = () => {

  const { loading } = useSelector(state => state.common);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {

    const handleVisibilityChange = () => {
      // for capturing the role and switching datas after login
      if (document.visibilityState === "visible") {
        setCurrentUser(queryClient, dispatch);
      }
    }

    const fetchData = async() => {
      
      const currentUser = await setCurrentUser(queryClient, dispatch)

      if(!currentUser?.error){

        const [cartItems, wishlist, addressList, orders, wallet] = await getUserDataQueryResults(queryClient);

        dispatch(setCartItems(cartItems))
        dispatch(setWishlist(wishlist))
        dispatch(setAddressList(addressList))
        dispatch(setAllOrders(orders))
        dispatch(setWallet(wallet))
      }
      
      const [categories, products, offers, brands] = await getDataQueryResults(queryClient);
      
      dispatch(setAllCategories(categories))
      dispatch(setAllProducts(products))
      dispatch(setAllOffers(offers))
      dispatch(setAllBrands(brands))
    }
    
    fetchData();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, [dispatch, queryClient]);

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
          <Route path='collections/:category/:subcategory/:product/product-reviews' element={<ProductReviews />} />
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
              <Route path='wallet' element={<Wallet />} />
            </Route>

          </Route>
          
        </Route>
        
      </Routes>
    </Suspense>
    
    <LoadingFallOff loading={ loading } />

    </>
  )
}

const getUserQueryResult = async(queryClient) => {

  return await queryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: () => updateUserRole('user'),
  })
  .then(() => queryClient.getQueryData(['user']))
  .catch(error => ({error: error?.message || 'Failed to fetch user'}))
  
}

const getUserDataQueryResults = async(queryClient) => {

  return (await Promise.allSettled([

    queryClient.prefetchQuery({
      queryKey: ['cartItems'],
      queryFn: getCart,
    }).then(() => queryClient.getQueryData(['cartItems'])),

    queryClient.prefetchQuery({
      queryKey: ['wishlist'],
      queryFn: getWishlist,
    }).then(() => queryClient.getQueryData(['wishlist'])),

    queryClient.prefetchQuery({
      queryKey: ['addressList'],
      queryFn: getAddressList,
    }).then(() => queryClient.getQueryData(['addressList'])),

    queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: getOrdersList,
    }).then(() => queryClient.getQueryData(['orders'])),

    queryClient.prefetchQuery({
      queryKey: ['wallet'],
      queryFn: getWallet,
    }).then(() => queryClient.getQueryData(['wallet'])),
    
  ])).map(res => res?.value)
}

const setCurrentUser = async(queryClient, dispatch) => {

  const user = await getUserQueryResult(queryClient);

  if(user?.error) {
    localStorage.removeItem('cart');
    dispatch(clearCart())
    dispatch(clearWishlist())
    dispatch(clearOrders())
    dispatch(clearReviews())
    dispatch(clearAddressList())
    dispatch(clearWallet())
  }else {
    dispatch(setUser(user))
  }

  return user
}

const getDataQueryResults = async(queryClient) => {

  return (await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    }).then(() => queryClient.getQueryData(['categories'])),

    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: getProductList,
    }).then(() => queryClient.getQueryData(['products'])),

    queryClient.prefetchQuery({
      queryKey: ['offers'],
      queryFn: getOffers,
    }).then(() => queryClient.getQueryData(['offers'])),

    queryClient.prefetchQuery({
      queryKey: ['brands'],
      queryFn: getBrands,
    }).then(() => queryClient.getQueryData(['brands'])),

  ])).map(res => res?.value)
}

export default UserRouter