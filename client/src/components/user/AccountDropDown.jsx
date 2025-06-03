import React from 'react'
import { Link } from 'react-router'
import { RiArrowRightUpLine } from "react-icons/ri";
import user_placeholder from '../../assets/user_placeholder.jpg'
import { useLogout } from '../../services/hooks';

const AccountDropDown = ({user}) => {

  /*  md:invisible opacity-0 */
  const logout = useLogout()

  return (
    <div className='nav-account-dropdown border md:invisible opacity-0 border-primary-200 absolute top-[100%] 
      -right-50 -translate-x-5/10 w-auto min-w-70 bg-white shadow-md rounded-sm cursor-default'>

        {
          user ? (
            /* Logined user info */
            <div className="flex gap-2 items-center justify-start p-5 py-6">
              <Link to={'/user/dashboard/profile'} 
                className="absolute right-0 top-0 m-1.5 p-0.5 border border-neutral-300 rounded-lg 
                  transition-all duration-300 hover:shadow-lg hover:bg-primary-50 hover:border-primary-300 hover:scale-110">
                <RiArrowRightUpLine size={20} />
              </Link>
              {/* avatar */}
              <div className='w-15 rounded-[50%] overflow-hidden'>
                <img src={user?.avatar ? user?.avatar : user_placeholder} alt="user" />
              </div>
              <div className="inline-flex flex-col leading-5">
                <span className='capitalize font-semibold tracking-wide'>{user.username}</span>
                <span className='overflow-hidden text-ellipsis'>{user.email}</span>
              </div>
            </div>
          ) :
          (
            <div className='flex flex-col p-5'>
              <p className='my-1'>To access account</p>
              <Link to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} 
                className='border border-neutral-300 w-fit py-1 hover:bg-primary-50
                transition-all duration-300 px-5 cursor-pointer hover:scale-103 hover:border-primary-300'>Login / Sign up</Link>
            </div>
          )
        }
      
      <hr className='text-neutral-200' />

      <ul className='flex flex-col p-5 text-[13px] tracking-wide font-semibold text-neutral-400'>
        <li className='cursor-pointer transition-all duration-300
          hover:text-primary-500 hover:translate-x-0.5'>
          <div>Orders</div>
        </li>
        <li className='cursor-pointer transition-all duration-300
          hover:text-primary-500 hover:translate-x-0.5'>
          <div>Wishlist</div>
        </li>
        <li className='cursor-pointer transition-all duration-300
          hover:text-primary-500 hover:translate-x-0.5'>
          <div>Contact</div>
        </li>
        {user &&
          <li className='inline-flex justify-end w-full'>
            <div onClick={logout} className='cursor-pointer text-red-400 hover:bg-red-200 w-fit px-3
            transition-all duration-300 hover:text-red-500'>Logout</div>
          </li>
        }
      </ul>
    </div>
  )
}

export default AccountDropDown