import React from 'react'
import { Sidebar } from '../../components/admin/dashboard/SideBar'
import { IoSearch } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import { LuUserRound, LuUsers } from "react-icons/lu";
import MetricCard from '../../components/admin/dashboard/MetricCard';
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";
import { FiBarChart } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-dashboard-background">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {/* <Circle size={32} className="text-primary" /> */}
            <h1 className="text-2xl font-semibold text-dashboard-text">Dashboard Overview</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input 
                type="search" 
                placeholder="Search..." 
                className="w-full h-9 pl-8 pr-4 rounded-md border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <button
              className="p-2 rounded-full text-dashboard-muted hover:text-dashboard-text hover:bg-gray-100 transition-colors"
            >
              <FaRegBell size={20} />
            </button>
            <button
              className="p-2 rounded-full text-dashboard-muted hover:text-dashboard-text hover:bg-gray-100 transition-colors"
            >
              <LuUserRound size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value="$45,231.89"
            trend={20.1}
            icon={<PiShoppingCartSimpleBold size={24} />}
          />
          <MetricCard
            title="Orders"
            value="356"
            trend={12.5}
            icon={<LuPackage size={24} />}
          />
          <MetricCard
            title="Users"
            value="2,345"
            trend={8.1}
            icon={<LuUsers size={24} />}
          />
          <MetricCard
            title="Avg. Order Value"
            value="$127.00"
            trend={-2.3}
            icon={<FiBarChart size={24} />}
          />
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard