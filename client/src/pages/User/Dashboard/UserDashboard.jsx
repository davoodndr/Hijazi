import clsx from 'clsx';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router'
import { LuLogOut } from 'react-icons/lu';

function UserDashboard() {

  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const currentUrl = location.pathname.split('/').pop();
  const [selected, setSelected] = useState(currentUrl);


  const links = [
    {label: 'My Profile', url: 'profile'},
    {label: 'My Orders', url: 'orders'},
    {label: 'address management', url: 'address-list'},
  ]

  return (
    <section className='w-9/10 py-15'>
      <div className='flex border border-gray-100 shadow-md rounded-3xl overflow-hidden'>

        {/* menus */}
        <div className='inline-flex flex-col w-[22%] shrink-0 bg-primary-50'>
          {links.map(el =>
            <div
              key={el.url}
              onClick={() => {
                if(user?.roles?.includes('user')){
                  navigate(el.url)
                  setSelected(el.url)
                }
              }} 
              className={clsx('cursor-pointer smooth hover:bg-primary-25 inline-flex',
                selected === el.url ? 'text-primary-400 pe-0 justify-end' : 'ps-6 py-3'
              )}>
              {selected === el.url ? 
                (
                  <div className='bg-white w-full px-6 py-3 rounded-3xl rounded-r-none'>
                    <span className='capitalize'>{el.label}</span>
                  </div>
                )
                :
                (<span className='capitalize'>{el.label}</span>)
              }
            </div>
          )}

          {/* logout menu */}
          <div
            onClick={() => {
              if(user?.roles?.includes('user')){
              }
            }} 
            className={clsx('px-6 py-3 cursor-pointer inline-flex items-center space-x-2 smooth hover:bg-primary-25',
            )}>
            <LuLogOut className='text-lg rotate-180' />
            <span className='capitalize'>logout</span>
          </div>

        </div>
        <Outlet />
      </div>
    </section>
  )
}

export default UserDashboard