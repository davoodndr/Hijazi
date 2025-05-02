import React, { useState } from "react";

import { Link, useLocation } from "react-router";
import logo from '../../../assets/logo.svg'
import { FaChevronLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

export const Sidebar = ({menuItems}) => {

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation()

  const path = location.pathname;
  const current = menuItems.find(item => path.includes(item.href)) || menuItems[0]
  
  const [selected, setSelected] = useState(current);

  const handleSelect = (item) => {
    setSelected(item)
  }

  return (
    <aside className={`h-screen bg-white border-r border-gray-200 
      transition-all duration-300 ease-in-out ${ collapsed ? "w-16" : "w-64" }`}>

      <div className="flex items-center justify-between p-2 h-20 border-b border-gray-200">
        {!collapsed && 
          <div className="mx-3 w-24">
            <img src={logo} alt="logo" className="object-contain" />
          </div>
        }

        <div onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg hover:bg-primary-50 transition-colors duration-300 cursor-pointer p-3">
          {collapsed ? <IoMenu size={28} /> : <FaChevronLeft size={15} />}
        </div>
      </div>
      <nav className="p-2 space-y-1">
        {
          menuItems.map(item => (
            <div key={item.label} onClick={() => handleSelect(item)}>
              <Link to={item.href} className={`flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50
                transition-all duration-300 ${item === selected ? "bg-primary-300/10 text-primary-300" : ''}`}>

                <span>{<item.icon size={20} />}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}

              </Link>
              <span></span>
            </div>
          ))
        }
      </nav>
    </aside>
  )

};
