import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { TbLayout2 } from "react-icons/tb";
import { IoMenu } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";
import { LuUserRound, LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";

const menuItems = [
  { icon: TbLayout2, label: 'Dashboard', href: '/' },
  { icon: LuUsers, label: 'Users', href: '/users' },
  { icon: PiShoppingCartSimpleBold, label: 'Orders', href: '/orders' },
  { icon: LuPackage, label: 'Products', href: '/products' },
  { icon: IoSettingsOutline, label: 'Settings', href: '/settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      collapsed ? "w-16" : "w-64"
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <span className="text-xl font-semibold text-dashboard-text">Admin</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <IoMenu size={20} /> : <FaChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-primary hover:text-primary-foreground transition-colors ${
              item.href === "/" ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};
