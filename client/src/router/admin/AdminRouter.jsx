import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import PublicRoutes from './AdminPublicRoutes'
import ProtectedRoutes from './AdminProtectedRoutes'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import LoadingFallOff from '../../components/ui/LoadingFallOff'
import AdminLayout from '../../pages/Admin/AdminLayout'
import PageLayout from '../../pages/Admin/PageLayout'
import { useEffect } from 'react'
import { setAllUsers, setUser } from '../../store/slices/UsersSlice'
import { clearWishlist } from '../../store/slices/WishlistSlice'
import { clearCart } from '../../store/slices/CartSlice'
import { useQueryClient } from '@tanstack/react-query'
import { 
  fetchAllBrandsAction,
  fetchAllCategoriesAction,
  fetchAllOffersAction,
  fetchAllOrdersAction,
  fetchAllProductsAction,
  fetchAllReviewsAction,
  fetchAllUsersAction 
} from '../../services/FetchDatas'
import { updateUserRole } from '../../services/ApiActions'
import { setAllOrders } from '../../store/slices/OrderSlice'
import { setAllReviews } from '../../store/slices/ReviewSlice'
import { setAllProducts } from '../../store/slices/ProductSlices'
import { setAllOffers } from '../../store/slices/OfferSlice'
import { setAllCategories } from '../../store/slices/CategorySlices'
import { setAllBrands } from '../../store/slices/BrandSlice'

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
const OffersList = React.lazy(() => import('../../pages/Admin/offers/OffersList'))
const UserReviews = React.lazy(() => import('../../pages/Admin/reviews/UserReviews'))

const AdminRouter = () => {

  const { loading } = useSelector(state => state.common);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(()=> {

    const handleVisibilityChange = () => {
      // for capturing the role and switching datas after login
      if (document.visibilityState === "visible") {
        setCurrentUser(queryClient, dispatch)
      }
    }

    const fetchDatas = async() => {

      const currentUser = await setCurrentUser(queryClient, dispatch)

      if(!currentUser?.error){
        const [users, orders, reviews, products, offers, categories, brands] = await getQueryResults(queryClient);
        
        dispatch(setAllUsers(users))
        dispatch(setAllOrders(orders))
        dispatch(setAllReviews(reviews))
        dispatch(setAllProducts(products))
        dispatch(setAllOffers(offers))
        dispatch(setAllCategories(categories))
        dispatch(setAllBrands(brands))
      }

    }

    fetchDatas();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  },[queryClient, dispatch]);

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
              {/* <Route index element={<Navigate to="dashboard" />} /> */}
              <Route index path="dashboard" element={<AdminDashboard />} />

              {/* users tab */}
              
                <Route path="users">
                  <Route element={<PageLayout />}>
                    <Route index element={<UsersList key="users" />} />
                  </Route>
                  <Route path="add-user" element={<AddUser />} />
                  <Route path="edit-user" element={<EditUser />} />
                  <Route path="view-user" element={<ViewUser />} />
                </Route>

                {/* categories tab */}
                <Route path='categories'>
                  <Route element={<PageLayout />}>
                    <Route index element={<CategoryList key="categories" />} />
                  </Route>
                </Route>
                {/* brands tab */}
                <Route path='brands'>
                  <Route element={<PageLayout />}>
                    <Route index element={<BrandList key="brands" />} />
                  </Route>
                </Route>
                {/* products tab */}
                <Route path='products'>
                  <Route element={<PageLayout />}>
                    <Route index element={<ProductList key="products" />} />
                  </Route>
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path=":slug/edit" element={<EditProduct />} />
                </Route>
                {/* orders tab */}
                <Route path='orders'>
                  <Route element={<PageLayout />}>
                    <Route index element={<OrdersList key="orders" />} />
                  </Route>
                  <Route path='view-order/:id' element={<ViewOrder />} />
                </Route>
                {/* offers tab */}
                <Route path='offers'>
                  <Route element={<PageLayout />}>
                    <Route index element={<OffersList key="offers" />} />
                  </Route>
                </Route>
                {/* reviews tab */}
                <Route path='reviews'>
                  <Route element={<PageLayout />}>
                    <Route index element={<UserReviews key="reviews" />} />
                  </Route>
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

const getUserQueryResult = async(queryClient) => {

  return await queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: () => updateUserRole('admin'),
    })
    .then(() => queryClient.getQueryData(['user']))
    .catch(error => ({error: error?.message || 'Failed to fetch user'}))
  
}

const setCurrentUser = async(queryClient, dispatch) => {

  const user = await getUserQueryResult(queryClient);

  if(user) {
    localStorage.removeItem('cart');
    dispatch(setUser(user))
    dispatch(clearCart())
    dispatch(clearWishlist())
  }
  return user
}

const getQueryResults = async(queryClient) => {
  
  return await Promise.all([

    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: fetchAllUsersAction,
    }).then(() => queryClient.getQueryData(['users'])),

    queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: fetchAllOrdersAction,
    }).then(() => queryClient.getQueryData(['orders'])),

    queryClient.prefetchQuery({
      queryKey: ['reviews'],
      queryFn: fetchAllReviewsAction,
    }).then(() => queryClient.getQueryData(['reviews'])),

    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: fetchAllProductsAction,
    }).then(() => queryClient.getQueryData(['products'])),

    queryClient.prefetchQuery({
      queryKey: ['offers'],
      queryFn: fetchAllOffersAction,
    }).then(() => queryClient.getQueryData(['offers'])),

    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: fetchAllCategoriesAction,
    }).then(() => queryClient.getQueryData(['categories'])),

    queryClient.prefetchQuery({
      queryKey: ['brands'],
      queryFn: fetchAllBrandsAction,
    }).then(() => queryClient.getQueryData(['brands'])),

  ])
}

export default AdminRouter