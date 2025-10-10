import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { IoIosAdd, IoIosArrowForward } from 'react-icons/io'
import { IoLocationOutline, IoWallet } from 'react-icons/io5'
import { LuMail, LuMapPin, LuPhone, LuUser } from 'react-icons/lu'
import { MdPayments } from "react-icons/md";
import { TbArrowBackUp } from 'react-icons/tb'
import { FaRegAddressBook } from "react-icons/fa";
import { HiHome } from "react-icons/hi2";
import place_holder from '../../../assets/user_placeholder.jpg'
import { Axios } from '../../../utils/AxiosSetup'
import ApiBucket from '../../../services/ApiBucket'

function ViewUser() {

  const location = useLocation();
  const navigate = useNavigate();
  const { user: user_id } = location?.state;
  const [user, setUser] = useState(null);

  useEffect(()=> {
    
    if(user_id){
      getUserInfo(user_id);
    }
  },[user_id])

  const getUserInfo = async(user_id)=> {
    
    try {
      
      const response = await Promise.all([
        Axios({
          ...ApiBucket.getUserInfo,
          params: { user_id }
        }).then(res => res?.data),
        
        Axios({
          ...ApiBucket.getWallet,
          params: { user_id }
        }).then(res => res?.data)
      ])
      
      const data = {
        ...response?.find(el => el?.user)?.user,
        wallet: response?.find(el => el?.wallet)?.wallet
      }
      console.log(data)
      setUser(data)

    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }

  }

  return (
    <section className='flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>User Account</h3>
        </div>
        <div className="inline-flex items-stretch gap-5">
          <button
            onClick={() => navigate('/admin/users')} 
            className='!ps-2 !pe-4 !bg-white border border-gray-300 !text-gray-400 
              inline-flex items-center gap-2 hover:!text-primary-400 hover:!border-primary-300'>
            <TbArrowBackUp size={25} />
            <span>Back</span>
          </button>
          <button 
            form="add-user-form"
            type="submit"
            className='ps-2! pe-4! inline-flex items-center gap-2 text-white'>
            <IoIosAdd size={25} />
            <span>Add Now</span>
          </button>
        </div>
        
      </div>

      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2 text-gray-400'>
          <span>Users</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>User Account</span>
        </div>
      </div>

      {/* form */}
      <div className="grid grid-cols-[280px_2fr] gap-2">
        
        {/* Personal Information */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            
            <div className="flex flex-col items-center h-fit gap-1">
              <div className="w-55 h-55 rounded-[70px] overflow-hidden">
                <img src={user?.avatar?.url || place_holder} className="object-cover" alt="profile" />
              </div>

              <ul className='w-full flex flex-col gap-3'>
                <li className='flex flex-col items-center gap-3 py-2'>

                  <p className='capitalize text-xl font-semibold'>{user?.fullname}</p>
                  <div className='flex items-center gap-2 bg-primary-400 text-white
                    rounded-full py-2 px-4 shadow-lg'>
                    <IoWallet size={20}/>
                    <p>Balance: 
                      <span className='ml-2 price-before price-before:text-gray-300 font-bold'
                      >{user?.wallet?.balance}</span>
                    </p>
                  </div>

                </li>
                <li className='border-b border-gray-300'></li>
                <li>
                  <p className='flex items-center space-x-2'>
                    <LuUser />
                    <span>{user?.username}</span>
                  </p>
                  <p className='flex items-center space-x-2'>
                    <LuMail />
                    <span>{user?.email}</span>
                  </p>
                  {user?.default_address && (
                    <p className='flex items-center space-x-2'>
                      <IoLocationOutline />
                      <span className='inline-flex capitalize'>{user?.default_address?.city}</span>
                    </p>
                  )}
                  {user?.mobile && (
                    <p className='flex items-center space-x-2'>
                      <LuPhone />
                      <span>{user?.mobile}</span>
                    </p>
                  )}
                </li>
              </ul>
            </div>
            
          </div>

        <div className="columns-2 space-y-2">
                    
          {/* Default Address */}
          <div className="break-inside-avoid space-y-6">
            <div className="flex flex-col gap-5 p-6 rounded-lg border border-gray-200 bg-white shadow-xs">
              <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <FaRegAddressBook className="w-5 h-5" />
                <span>Default Address</span>
              </h2>
              {user?.default_address ?
                <ul className='w-full flex flex-col gap-1'>
                  <li className='capitalize space-x-2'>
                    <label className='!text-sm font-normal text-gray-400'>Address:</label>
                    <p className='inline-flex'>{user?.default_address.address_line}</p>
                  </li>
                  <li className='capitalize space-x-2'>
                    <label className='!text-sm font-normal text-gray-400'>City:</label>
                    <p className='inline-flex'>{user?.default_address.city}</p>
                  </li>
                  <li className='capitalize space-x-2'>
                    <label className='!text-sm font-normal text-gray-400'>State:</label>
                    <p className='inline-flex'>{user?.default_address.state}</p>
                  </li>
                  <li className='capitalize space-x-2'>
                    <label className='!text-sm font-normal text-gray-400'>Country:</label>
                    <p className='inline-flex'>{user?.default_address.country}</p>
                  </li>
                  <li className='capitalize space-x-2'>
                    <label className='!text-sm font-normal text-gray-400'>Pincode/Zip code:</label>
                    <p className='inline-flex'>{user?.default_address.pincode}</p>
                  </li>
                </ul>
                : 
                <div className='w-full text-center text-gray-400'>Not added</div>
              }
            </div>
          </div>

          {/* Shipping Address */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <LuMapPin className="w-5 h-5" />
                <span className="leading-none">Shipping Address</span>
              </div>
            </h2>
            <div className="flex flex-col gap-5">
              
            </div>
          </div>

          {/* payment methods */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

            <div className="flex flex-col gap-5">
              <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <MdPayments className="w-6 h-6" />
                <span>Payment Method</span>
              </h2>
              <div className='flex flex-col'>
                
              </div>
              
            </div>
            
          </div>

          
        </div>
        
      </div>
    </section>
  )
}

export default ViewUser