import React from 'react'
import { Link } from 'react-router'
import { BsBag } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import logo from "../assets/logo.svg"

const Navbar = () => {
  return (
    <header className="flex flex-col sticky top-0 bg-white">

      {/* header middle */}
      <div className='flex flex-row w-full justify-center'>
        <div className="flex flex-row gap-3 w-9/10 justify-between py-1.5">

          {/* logo */}
          <Link to={'/'}className='w-2/10 md:w-1/10 h-15'>
            <img src={logo} className='object-contain h-full' alt="logo" />
          </Link>

          {/* main menu */}
          <ul className="hidden md:flex flex-row items-center w-5/10">
            <li className='px-5 text-base font-bold'>Home</li>
            <li className='px-5 text-base font-bold'>About</li>
            <li className='px-5 text-base font-bold'>Categories</li>
            <li className='px-5 text-base font-bold'>Policies</li>
            <li className='px-5 text-base font-bold'>Contact</li>
          </ul>

          {/* search-bar */}
          <div className="hidden md:flex border border-neutral-300 items-center overflow-hidden rounded-3xl w-4/10 gap-2 my-2">
            <div className='bg-neutral-100 h-full w-12 flex items-center justify-center'>
              <BiSearch size={25} className='text-neutral-400' />
            </div>
            <input type="text" placeholder='Search' className='w-full border-noned outline-none text-base px-3 py-2' />
          </div>

          {/* wishlist & cart */}
          <ul className="flex flex-row items-center justify-between w-3/10 md:w-2/10">
            <li className='inline-flex flex-col items-end md:items-center px-3 w-3/10'>
              <BsHeart size={22} />
              <span className='hidden md:inline-flex text-xs font-semibold'>Wishlist</span>
            </li>
            <li className='inline-flex flex-col items-center px-3 w-3/10'>
              <BsBag size={22}/>
              <span className='hidden md:inline-flex text-xs font-semibold'>Bag</span>
            </li>
            <li className='hidden md:inline-flex flex-col items-center px-3 w-3/10'>
              <BiUser  size={22}/>
              <span className='hidden md:inline-flex text-xs font-semibold'>Account</span>
            </li>

            {/* menu icon */}
            <li className='inline-flex md:hidden items-center justify-center cursor-pointer w-3/10'>
              <RiMenu3Fill size={30} className='' />
            </li>
          </ul>

          {/* mobile menu */}
          <div className='fixed top-0 right-0 w-full h-full backdrop-blur-sm'>
            <div className='fixed top-0 right-0 w-8/10 h-full bg-white shadow-xl/20'>
              <div className='relative flex flex-col p-5'>

                {/* header */}
                <div className='flex items-center'>
                  {/* close btn */}
                  <div className="absolute top-0 right-0 inline-flex w-fit border rounded-md m-2 cursor-pointer transition duration-200 hover:bg-red-400 hover:text-white">
                    <IoClose size={20}/>
                  </div>
                </div>
                
                {/*  */}
                <div className='border flex'>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
        
    </header>
  )
}

export default Navbar