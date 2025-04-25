import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import { BiUser } from "react-icons/bi";
import logo from "../assets/logo.svg"
import user_placeholder from "../assets//user_placeholder.jpg"
import { useLogout } from '../services/hooks';
import UserMenus from './UserMenus';



const MobileNav = ({setExpand, isExpaned, user}) => {

  
  const navigate = useNavigate();
  const logout = useLogout();
  
  return (
    <div className={`fixed top-0 right-0 w-full h-full backdrop-blur-sm transition-all duration-400 ease-in-out
        ${isExpaned ? 'visible bg-[rgba(0,0,0,0.2)]' : 'invisible'}`}>
      <div className={`fixed top-0 right-0 w-8/10 h-full bg-white shadow-xl/20 
        transition-transform duration-400 ease-in-out
        ${isExpaned ? 'translate-x-0' : 'translate-x-100'}
        `}>
        <div className='relative flex flex-col gap-4 p-5 pt-2'>

          {/* header */}
          <div className='flex items-center justify-between'>

            {/* logo */}
            {user ? (
              <div className='w-full flex items-center gap-2 py-2 relative'>
                <div className='h-14 rounded-full overflow-hidden'>
                  <img src={user?.avatar ? user.avatar : user_placeholder} className='object-contain h-full' alt="logo" />
                </div>
                <div className='leading-5'>
                  <h3 className='capitalize'>{user.username}</h3>
                  <p>{user.email}</p>
                  <p className='absolute top-[80%] text-neutral-400 transition-all duration-300
                    hover:text-red-500 hover:scale-103 cursor-pointer' onClick={() => {
                      logout();
                      setExpand(false);
                      navigate('/')
                    }}>Logout</p>
                </div>
              </div>
              ): (
                <div className='w-full flex items-center gap-5'>
                  <Link to={'/'} className='h-12'>
                    <img src={logo} className='object-contain h-full' alt="logo" />
                  </Link>
                  <div className='leading-6'>
                    <p className='truncate'>Login to access account</p>
                    <div className='inline-flex items-center gap-1 cursor-pointer hover:text-primary-300'
                      onClick={() => {
                        navigate('/login');
                        setExpand(false);
                      }}>
                      <BiUser size={18} />
                      <span>Login / SignUp</span>
                    </div>
                  </div>
                </div>
              )
            }

            {/* close btn */}
            <div onClick={() => setExpand(false)} className={`inline-flex w-fit border border-neutral-300 rounded-md m-2 me-0 
              cursor-pointer transition duration-200 hover:bg-red-400 hover:text-white`}>
              <IoClose size={20}/>
            </div>
          </div>

          <hr className='text-neutral-200' />
          
          {/* search-bar */}
          <div className="flex border border-neutral-400 items-center overflow-hidden rounded-3xl gap-2 my-2">
            <input type="text" placeholder='Search' className='w-full border-0! outline-0! text-base px-5 py-2' />
            <div className='h-full w-12 flex items-center justify-center'>
              <BiSearch size={25} className='text-neutral-400' />
            </div>
          </div>

          {/* main menu */}
          <UserMenus isMobile={true} />

        </div>
      </div>
    </div>
  )
}

export default MobileNav