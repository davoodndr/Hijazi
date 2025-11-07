import React from 'react'
import { Link, useNavigate } from 'react-router'
import { RiArrowRightUpLine } from "react-icons/ri";
import user_placeholder from '../../assets/user_placeholder.jpg'
import { useLogout } from '../../services/hooks';

const AccountDropDown = ({user, onClose}) => {

  const logout = useLogout()
  const navigate = useNavigate();

  const handleLogout = ()=> {
    onClose();
    logout();
  }

  return (
    <>
      {
        user ? (
          /* Logined user info */
          <div className="flex gap-2 items-center justify-start p-5 py-6">
            <div
              onClick={() => {
                navigate('/dashboard/profile');
                onClose();
              }}
              className="absolute right-0 top-0 m-1.5 p-0.5 border border-neutral-300 rounded-lg 
                smooth hover:shadow-lg hover:bg-primary-50 hover:border-primary-300 hover:scale-110">
              <RiArrowRightUpLine size={20} />
            </div>
            {/* avatar */}
            <div className='w-15 rounded-[50%] overflow-hidden'>
              <img src={user?.avatar?.url ? user?.avatar?.url : user_placeholder} alt="user" />
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
            <div 
              onClick={() => {
                navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                onClose();
              }}
              className='border border-neutral-300 w-fit py-1 hover:bg-primary-50
              smooth px-5 cursor-pointer hover:scale-103 hover:border-primary-300'>Login / Sign up</div>
          </div>
        )
      }
      
      <hr className='text-neutral-200' />

      <ul className='flex flex-col p-5 text-[13px] tracking-wide font-semibold text-neutral-400'>
        <li
          onClick={() => {
            navigate('/dashboard/wallet')
            onClose();
          }}
          className='cursor-pointer smooth hover:text-primary-500 hover:translate-x-0.5'>
          Wallet
        </li>
        <li
          onClick={() => {
            navigate('/dashboard/orders')
            onClose();
          }}
          className='cursor-pointer smooth hover:text-primary-500 hover:translate-x-0.5'>
          Orders
        </li>
        <li 
          onClick={() => {
            navigate('/wishlist')
            onClose();
          }}
          className='cursor-pointer smooth
          hover:text-primary-500 hover:translate-x-0.5'>
          <div>Wishlist</div>
        </li>
        <li
          onClick={() => {
            navigate('/dashboard/address-list')
            onClose();
          }}
          className='cursor-pointer smooth
          hover:text-primary-500 hover:translate-x-0.5'>
          <div>Address List</div>
        </li>
        {user &&
          <li className='inline-flex justify-end w-full'>
            <div onClick={handleLogout} className='cursor-pointer text-red-400 hover:bg-red-200 w-fit px-3
            smooth hover:text-red-500'>Logout</div>
          </li>
        }
      </ul>
    </>
  )
}

export default AccountDropDown