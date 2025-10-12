import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import { TbLayout2 } from "react-icons/tb";
import { LuBadgePercent, LuPackage, LuUsers } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { MdOutlineReviews } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { Sidebar } from '../../components/admin/dashboard/SideBar'
import Header from '../../components/admin/dashboard/Header'
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { fetchAllUsers } from '../../store/slices/UsersSlice';
import { fetchAllProducts } from '../../store/slices/ProductSlices';
import { fetchAllOrders } from '../../store/slices/OrderSlice';
import { fetchAllReviews } from '../../store/slices/ReviewSlice';
import { fetchAllOffers } from '../../store/slices/OfferSlice';
import { fetchAllCategories } from '../../store/slices/CategorySlices';
import { fetchAllBrands } from '../../store/slices/BrandSlice';
import { 
  fetchAllBrandsAction,
  fetchAllCategoriesAction,
  fetchAllOffersAction,
  fetchAllOrdersAction,
  fetchAllProductsAction,
  fetchAllReviewsAction,
  fetchAllUsersAction 
} from '../../services/FetchDatas';

const AdminLayout = () => {

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(()=> {

    const fetchDatas = async() => {

      const [users, orders, reviews, products, offers, categories, brands] = await getQueryResults(queryClient);
      
      dispatch(fetchAllUsers(users))
      dispatch(fetchAllOrders(orders))
      dispatch(fetchAllReviews(reviews))
      dispatch(fetchAllProducts(products))
      dispatch(fetchAllOffers(offers))
      dispatch(fetchAllCategories(categories))
      dispatch(fetchAllBrands(brands))

    }

    fetchDatas();

  },[queryClient, dispatch])

  const menuItems = [
    { icon: TbLayout2, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: LuUsers, label: 'Users', href: '/admin/users' },
    { icon: PiShoppingCartSimpleBold, label: 'Orders', href: '/admin/orders' },
    { icon: MdOutlineReviews, label: 'User Reviews', href: '/admin/reviews' },
    { icon: LuPackage, label: 'Products', href: '/admin/products' },
    { icon: LuBadgePercent, label: 'Offers', href: '/admin/offers' },
    { icon: BiCategoryAlt, label: 'Categories', href: '/admin/categories' },
    { icon: SlBadge, label: 'Brands', href: '/admin/brands' },
    { icon: IoSettingsOutline, label: 'Settings', href: '/admin/settings' },
  ];
  

  return (
    <div className='flex w-screen h-screen overflow-hidden relative'>
      <Sidebar menuItems={menuItems} />
      <main className='flex-1 flex flex-col overflow-y-auto bg-white scroll-basic'>
        <Header />
        <Outlet />
      </main>
    </div>
  )
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

export default AdminLayout