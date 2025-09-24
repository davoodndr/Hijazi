import clsx from 'clsx';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router'
import { LuLogOut } from 'react-icons/lu';
import * as motion from "motion/react-client"

function UserDashboard() {

  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const currentUrl = location.pathname.split('/').pop();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(currentUrl)
  },[currentUrl])

  const links = [
    {label: 'My Profile', url: 'profile'},
    {label: 'My Orders', url: 'orders'},
    {label: 'address management', url: 'address-list'},
    {label: 'my wallet', url: 'wallet'},
  ]

  return (
    <section className='w-9/10 py-15'>
      <div className='min-h-[70vh] flex border border-gray-100 shadow-md rounded-3xl overflow-hidden'>

        {/* menus */}
        <div className='inline-flex flex-col w-[22%] shrink-0 bg-primary-50 py-3 pt-15'>
          {links.map(el =>
            <div
              key={el.url}
              onClick={() => {
                if(user?.roles?.includes('user')){
                  navigate(el.url)
                  setSelected(el.url)
                }
              }}
              className={clsx('cursor-pointer smooth ps-6 py-3 hover:ps-8 relative',
                selected === el.url ? 'text-primary-400 ps-8 bg-primary-300/20' : 'ps-6 hover:bg-primary-25'
              )}>
              <span className='capitalize'>{el.label}</span>
              {selected === el.url && 
                <motion.div
                  layoutId='selector'
                  className="absolute top-1/2 -translate-y-1/2 -right-2.5 flex items-center"
                >
                  <span className='inline-flex bg-white w-5 h-5 rotate-45'></span>
                </motion.div>
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