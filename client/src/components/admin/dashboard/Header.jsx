import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import { LuUserRound, LuUsers } from "react-icons/lu";
import AccountDropDown from './AccountDropDown';
import { useSelector } from 'react-redux';

const Header = () => {

  const { user } = useSelector(state => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(user?.roles.includes('admin') ? user : null);
  },[user])

  return (
    <header className="border-b border-gray-200 flex items-center justify-between h-20 p-5">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-dashboard-text"></h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input 
            type="search" 
            placeholder="Search..." 
            className="w-full h-9 pl-8! pr-4 rounded-md border border-gray-200 focus:outline-none focus:border-primary-50 focus:ring-1 focus:ring-primary-50 transition-colors"
          />
        </div>
        <div className="p-2 rounded-xl cursor-pointer hover:text-primary-400
           hover:bg-primary-50 transition-colors">
          <FaRegBell size={20} />
        </div>
        <div className="account-nav p-2 rounded-xl cursor-pointer hover:text-primary-400
         hover:bg-primary-50 transition-colors relative">
          <LuUserRound size={20} />

          <AccountDropDown user={currentUser} />
        </div>
      </div>
    </header>
  )
}

export default Header