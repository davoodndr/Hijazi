import React, { useEffect, useState } from 'react'
import { BiSearch } from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router';
import { TypeAnimation } from 'react-type-animation'

const UserSearchBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);

  useEffect(() => {
    const isSearch = location.pathname === '/search';
    setIsSearchPage(isSearch);
  },[location])

  const redirectToSearch = () => {
    navigate("/search")
  }

  return (
    <search className="hidden md:flex border border-neutral-300 items-center overflow-hidden 
      transition-colors duration-300 rounded-3xl w-[400px] me-6 gap-1 my-2 focus-within:border-primary-300">

      <div className='bg-primary-50 h-full w-14 flex items-center justify-center'>
        <BiSearch size={25} className='text-primary-300' />
      </div>
      {
        !isSearchPage ? (
          <div onClick={redirectToSearch} className='w-full px-3'>
            <TypeAnimation 
              sequence={[
                'Explore products in Toys',
                1000,
                'Explore products in Clothings',
                1000,
                'Explore products in Electronics',
                1000,
                'Explore products in Food Items',
                1000
              ]}
              wrapper="span"
              speed={50}
              style={{display: 'inline-flex' }}
              repeat={Infinity}
            />
          </div>
        )
        : (
          <input type="text" placeholder='Search' className='w-full border-0! outline-0! text-base px-3' />
        )
      }
    </search>
  )
}

export default UserSearchBar