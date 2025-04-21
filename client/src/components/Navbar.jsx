import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BsBag } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../assets/logo.svg"

const Navbar = () => {

  const menus = [
    {label: 'home', href: '/'},
    {label: 'about', href: ''},
    {label: 'categories', href: '',
      submenu: [
        {label: 'clothing', href: ''},
        {label: 'chappals', href: ''},
      ]
    },
    {label: 'policies', href: ''},
    {label: 'contact', href: ''},
  ]

  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isExpaned, setIsExpanded] = useState(false);
  const menuRefs = useRef({});

  /* for smooth animation on submenu expand - mobile */
  useEffect(() => {
    Object.keys(menuRefs.current).forEach(key => {
      const el = menuRefs.current[key];
      
      if(el){
        el.style.maxHeight = expandedMenu === key ? `${el.scrollHeight}px` : "0px";
      }
    })
  }, [expandedMenu]);

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
            <li onClick={() => setIsExpanded(true)} className='inline-flex md:hidden items-center justify-center cursor-pointer w-3/10'>
              <RiMenu3Fill size={30} className='' />
            </li>
          </ul>

          {/* mobile menu */}
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
                  <Link to={'/'}className='h-12'>
                    <img src={logo} className='object-contain h-full' alt="logo" />
                  </Link>

                  {/* close btn */}
                  <div onClick={() => setIsExpanded(false)} className={`inline-flex w-fit border border-neutral-300 rounded-md m-2 me-0 
                    cursor-pointer transition duration-200 hover:bg-red-400 hover:text-white`}>
                    <IoClose size={20}/>
                  </div>
                </div>

                <hr className='text-neutral-200' />
                
                {/* search-bar */}
                <div className="flex border border-neutral-400 items-center overflow-hidden rounded-3xl gap-2 my-2">
                  <input type="text" placeholder='Search' className='w-full border-noned outline-none text-base px-5 py-2' />
                  <div className='h-full w-12 flex items-center justify-center'>
                    <BiSearch size={25} className='text-neutral-400' />
                  </div>
                </div>

                {/* main menu */}
                <ul className="flex flex-col">
                  {
                    menus && menus.map(menu => 
                      <li key={menu.label} className='px-3 py-2 border-b-1 border-neutral-200'>

                        <div className='flex items-center justify-between cursor-pointer' 
                          onClick={() => setExpandedMenu(prev => (prev === menu.label ? null : menu.label))}
                          >
                          <span className='text-base font-semibold capitalize'>{menu.label}</span>

                          {/* expand/collapse arrow */}
                          <div className='p-1'>
                            <IoIosArrowDown className={`transition-transform duration-300
                              ${expandedMenu === menu.label ? 'rotate-180' : 'rotate-0'}`} />
                          </div>
                        </div>

                        {menu.submenu && (
                          <ul ref={(el) => {
                            if(el) menuRefs.current[menu.label] = el;
                          }} 
                          className={`overflow-hidden transition-all duration-500 ease-in-out bg-white`}
                          >
                            {menu.submenu.map(sub => 
                              <li key={sub.label} className='pl-3 py-1.5 text-sm capitalize'>{sub.label}</li>
                            )}
                          </ul>
                        )}
                      </li>
                    )
                  }
                </ul>

              </div>
            </div>
          </div>

        </div>
      </div>
        
    </header>
  )
}

export default Navbar