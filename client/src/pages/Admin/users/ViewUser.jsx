import React, { useState } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { IoAccessibility } from 'react-icons/io5'
import { LuEye, LuEyeClosed, LuMail, LuMapPin, LuPhone, LuUser } from 'react-icons/lu'
import { TbArrowBackUp } from 'react-icons/tb'
import CustomSelect from '../../../components/ui/CustomSelect'
import { PiPassword } from 'react-icons/pi'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineImageSearch } from 'react-icons/md'

function ViewUser() {


  return (
    <section className='flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Create New User</h3>
          <span className='sub-title'>Enter user details below</span>
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

      {/* form */}
      <div className="grid grid-cols-3 gap-2">
        
        {/* Personal Information */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
          
          <div className="flex flex-col gap-5">
            
            
          </div>
          
          <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
            <LuUser className="w-5 h-5" />
            <span>Personal</span>
          </h2>
          
        </div>

        {/* Contact Information */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
          <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
            <LuMail className="w-5 h-5" />
            <span>Contact</span>
          </h2>
          <div className="flex flex-col gap-5">
            
          </div>
        </div>
        
        {/* accessibility Information */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
          <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
            <IoAccessibility className="w-5 h-5" />
            <span>Accessibility</span>
          </h2>
          <div className="flex flex-col gap-5">
            
          </div>
        </div>

        {/* password */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

          <div className="flex flex-col gap-5">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <PiPassword className="w-6 h-6" />
              <span>Password</span>
            </h2>
            <div className='flex flex-col'>
              
            </div>
            
          </div>
          
        </div>

        {/* Address */}
        <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs
          hidden-div hidden">
          <h2 className="text-md font-medium text-gray-900 flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <LuMapPin className="w-5 h-5" />
              <span className="leading-none">Address</span>
            </div>
          </h2>
          <div className="address-container flex flex-col gap-5">
            
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default ViewUser