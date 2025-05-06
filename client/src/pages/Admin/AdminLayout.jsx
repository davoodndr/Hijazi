import React from 'react'
import { Outlet } from 'react-router'
import { TbLayout2 } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";
import { SlBadge } from "react-icons/sl";
import { Sidebar } from '../../components/admin/dashboard/SideBar'
import Header from '../../components/admin/dashboard/Header'


const AdminLayout = () => {

  const menuItems = [
      { icon: TbLayout2, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: LuUsers, label: 'Users', href: '/admin/users' },
      { icon: BiCategoryAlt, label: 'Categories', href: '/admin/categories' },
      { icon: SlBadge, label: 'Brands', href: '/admin/brands' },
      { icon: LuPackage, label: 'Products', href: '/admin/products' },
      { icon: PiShoppingCartSimpleBold, label: 'Orders', href: '/admin/orders' },
      { icon: IoSettingsOutline, label: 'Settings', href: '/admin/settings' },
    ];
  

  return (
    <div className='flex w-screen h-screen overflow-hidden relative'>
      <Sidebar menuItems={menuItems} />
      <main className='flex-1 flex flex-col overflow-y-auto bg-gray-100 scroll-basic'>
        <Header />
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout