import React from 'react'
import { Outlet } from 'react-router'
import { TbLayout2 } from "react-icons/tb";
import { LuUserRound, LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";
import { Sidebar } from '../../components/admin/dashboard/SideBar'
import Header from '../../components/admin/dashboard/Header'


const AdminLayout = () => {

  const menuItems = [
      { icon: TbLayout2, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: LuUsers, label: 'Users', href: '/admin/users' },
      { icon: PiShoppingCartSimpleBold, label: 'Orders', href: '/admin/orders' },
      { icon: LuPackage, label: 'Products', href: '/admin/products' },
      { icon: IoSettingsOutline, label: 'Settings', href: '/admin/settings' },
    ];
  

  return (
    <main className='flex h-100'>
      <Sidebar menuItems={menuItems} />
      <section className='flex flex-col grow overflow-y-auto min-h-screen'>
        <Header />
        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout