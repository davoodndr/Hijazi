import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { BsBag } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { RiMenu3Fill } from "react-icons/ri";
import logo from "../../assets/logo.svg"
import { useDispatch, useSelector } from 'react-redux';
import AccountDropDown from './AccountDropDown';
import UserSearchBar from './UserSearchBar';
import MobileNav from './MobileNav';
import UserMenus from './UserMenus';
import { setLoading } from '../../store/slices/CommonSlices'
import { getCartCount } from '../../store/slices/CartSlice';
import CartDropdown from './CartDropdown';
import clsx from 'clsx';

function NavbarComponent(){

  let { user } = useSelector(state => state.user);
  let cartCount = useSelector(getCartCount);
  const [currentUser, setCurrentUser] = useState(null);
  const [isExpaned, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* settingup depending on user role */
  useEffect(() => {
    setCurrentUser(user?.roles.includes('user') ? user : null);
  },[user])

  const setMobMenuExpand = useCallback((expand) => {
    setIsExpanded(expand);
  }, [isExpaned])

  return (
    <header className="flex flex-col sticky top-0 bg-white z-1000 shadow-sm">

      {/* header middle */}
      <div className='flex flex-row w-full justify-center'>
        <div className="flex flex-row w-9/10 justify-between md:py-1.5">

          {/* left side */}
          <div className='inline-flex items-center w-5/10'>

            {/* logo */}
            <div
              onClick={() => {
                dispatch(setLoading(true))
                navigate('/')
              }} 
              className='w-20 h-13 md:w-25 md:h-15 inline-flex items-center cursor-pointer'>
              <img src={logo} className='object-contain w-full' loading='lazy' alt="logo" />
            </div>

            {/* main menu */}
            <UserMenus />

          </div>

          {/* right side */}
          <div className='inline-flex justify-end w-4/8'>
            {/* search-bar */}
            <UserSearchBar />

            {/* wishlist & cart */}
            <ul className="flex flex-row items-center justify-end w-full md:w-4/10 md:max-w-[160px]">
              <li className='inline-flex h-full flex-col items-center justify-center md:items-center w-11 md:w-3/9'>
                <BsHeart className='md:mb-1 text-2xl' />
                <span className='hidden md:inline-flex text-xs font-semibold'>Wishlist</span>
              </li>

              <li className='inline-flex h-full flex-col items-center justify-center w-11 md:w-3/9 
                relative cursor-pointer group'>

                {cartCount > 0 && <div className='w-fit px-1.5 h-4.5 bg-red-500 absolute left-[calc(100%-22px)] top-0.5 rounded-full
                  inline-flex items-center justify-center text-white text-xs font-extrabold'
                >
                  <p>{cartCount}</p>
                </div>}
                <BsBag className='md:mb-1 text-2xl'/>
                
                <div className='hidden md:inline-flex flex-col items-center text-xs font-semibold'>
                  <span>Bag</span>
                  <div className={clsx(
                    'menu-indicator h-[3px] w-full bg-primary-300 z-10',
                    cartCount > 0 && 'group-hover:!visible group-hover:!opacity-100 group-hover:!transform translate-y-0'
                  )}></div>
                </div>
                
                {/* cart dropdown */}
                {cartCount > 0 && 
                  <CartDropdown 
                    className='group-hover:!visible group-hover:!opacity-100 group-hover:!transform translate-y-0'
                  />
                }
                
              </li>

              <li className='account-nav h-full hidden md:inline-flex flex-col items-center justify-center w-13 md:w-3/9 relative cursor-pointer'>
                <BiUser  className='md:mb-1 text-2xl'/>
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
                <RiMenu3Fill size={25} />
              </li>
            </ul>
          </div>

          {/* mobile menu */}
          <MobileNav isExpaned={isExpaned} setExpand={setMobMenuExpand} user={currentUser} />

        </div>
      </div>
        
    </header>
  )
}

const Navbar = React.memo(NavbarComponent);

export default Navbar