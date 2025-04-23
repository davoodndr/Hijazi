import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { BsBag } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../assets/logo.svg"
import { useSelector } from 'react-redux';
import AccountDropDown from './AccountDropDown';

const Navbar = () => {

  const { user } = useSelector(state => state.user);
  const [currentUser, setCurrentUser] = useState(null);

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
  const navigate = useNavigate();

  /* for smooth animation on submenu expand - mobile */
  useEffect(() => {
    Object.keys(menuRefs.current).forEach(key => {
      const el = menuRefs.current[key];
      
      if(el){
        el.style.maxHeight = expandedMenu === key ? `${el.scrollHeight}px` : "0px";
      }
    })
  }, [expandedMenu]);

  /* settingup depending on user role */
  useEffect(() => {
    if(user?.role === 'user') setCurrentUser(user);
  },[user])

  return (
    <header className="flex flex-col sticky top-0 bg-white">

      {/* header middle */}
      <div className='flex flex-row w-full justify-center'>
        <div className="flex flex-row w-9/10 justify-between py-1.5">

          {/* left side */}
          <div className='inline-flex items-center w-5/10'>

            {/* logo */}
            <Link to={'/'}className='w-4/8 md:w-2/11 h-15'>
              <img src={logo} className='object-contain h-full' alt="logo" />
            </Link>

            {/* main menu */}
            <ul className="hidden md:flex flex-row items-center w-full pl-3">
              <li className='px-5 text-base font-bold'>Home</li>
              <li className='px-5 text-base font-bold'>About</li>
              <li className='px-5 text-base font-bold'>Categories</li>
              <li className='px-5 text-base font-bold'>Policies</li>
              <li className='px-5 text-base font-bold'>Contact</li>
            </ul>
          </div>

          {/* right side */}
          <div className='inline-flex justify-end w-4/8'>
            {/* search-bar */}
            <search className="hidden md:flex border border-neutral-200 items-center overflow-hidden 
              transition-colors duration-300 rounded-3xl w-full me-5 gap-1 my-2 focus-within:border-primary-300">

              <div className='bg-primary-50 h-full w-14 flex items-center justify-center'>
                <BiSearch size={25} className='text-primary-300' />
              </div>
              <input type="text" placeholder='Search' className='w-full border-0! outline-0! text-base px-3 py-2' />
            </search>

            {/* wishlist & cart */}
            <ul className="flex flex-row items-center justify-end w-full md:w-4/10">
              <li className='inline-flex h-full flex-col items-center justify-center md:items-center w-13 md:w-3/9'>
                <BsHeart className='text-3xl md:text-2xl' />
                <span className='hidden md:inline-flex text-xs font-semibold'>Wishlist</span>
              </li>
              <li className='inline-flex h-full flex-col items-center justify-center w-13 md:w-3/9'>
                <BsBag className='text-3xl md:text-2xl'/>
                <span className='hidden md:inline-flex text-xs font-semibold'>Bag</span>
              </li>
              <li className='account-nav h-full hidden md:inline-flex flex-col items-center justify-center w-13 md:w-3/9 relative cursor-pointer'>
                <BiUser  className='text-3xl md:text-2xl'/>
                <div className='hidden md:inline-flex flex-col items-center text-xs font-semibold'>
                  <span>Account</span>
                  <div className='menu-indicator h-[3px] w-full bg-primary-300 z-10'></div>
                </div>
                
                {/* account dropdown menu */}
                <AccountDropDown user={currentUser} />
              </li>

              {/* menu icon */}
              <li onClick={() => setIsExpanded(true)} className='inline-flex md:hidden items-center justify-center 
                cursor-pointer w-fit ms-3 border border-neutral-300 p-1.5 rounded-lg transition-all
                hover:bg-primary-50 hover:border-primary-300'>
                <RiMenu3Fill size={35} />
              </li>
            </ul>
          </div>

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
                  <input type="text" placeholder='Search' className='w-full border-0! outline-0! text-base px-5 py-2' />
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

                {/* Other options */}
                <ul className='mt-20'>
                  <li className='flex items-center gap-2 cursor-pointer hover:text-primary-300'
                    onClick={()=> {
                      navigate('/login');
                      setIsExpanded(false)
                    }}>
                    <BiUser size={18} />
                    <span>Login / SignUp</span>
                  </li>
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