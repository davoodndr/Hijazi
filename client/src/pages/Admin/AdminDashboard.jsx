import React from 'react'
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";
import { LuUserRound, LuUsers } from "react-icons/lu";
import MetricCard from '../../components/admin/dashboard/MetricCard';
import { FiBarChart } from 'react-icons/fi';

const AdminDashboard = () => {

  
  return (
    <section className="flex p-8 w-full">
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
    </section>
  )
}

export default AdminDashboard