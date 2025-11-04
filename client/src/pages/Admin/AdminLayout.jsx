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

const AdminLayout = () => {

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

export default AdminLayout