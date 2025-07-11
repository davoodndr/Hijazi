import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import AxiosToast from '../../../utils/AxiosToast';
import { makeAddressDefault } from '../../../store/slices/AddressSlice';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { setUser } from '../../../store/slices/UsersSlice';

function Addresses() {

  const dispatch = useDispatch();
  const { addressList } = useSelector(state => state.address);
  const { user } = useSelector(state => state.user);

  const handleMakeAddressDefault = async(id) => {

    const old_default = addressList?.find(el => el.is_default === true)._id;

    try {
        
      const response = await Axios({
        ...ApiBucket.makeAddressDefault,
        data: { 
          address_id: id,
          old_default
        }
      })
  
      if(response.data.success){
        dispatch(makeAddressDefault(response.data))

        const updatedUser = {
          ...user,
          default_address: response.data.updated
        }
        dispatch(setUser({user: updatedUser}))
        AxiosToast(response, false);
      }
  
    } catch (error) {
      AxiosToast(error);
    }
  }

  return (
    <div className='h-full flex-grow p-5 space-y-5'>
      {/* header */}
      <div className='flex space-x-3'>
        <h3 className='text-xl'>Address List</h3>
        <p className='font-semibold text-[16px] bg-primary-400 text-white
          inline-flex px-1.75 rounded-full'
        >{addressList?.length || ''}</p>
      </div>

      {/* list */}
      <div className="grid grid-cols-4 gap-2">

        {addressList?.length > 0 &&

          addressList.map(address => {

            return (
              <div
                key={address._id}
                className='flex flex-col items-center justify-between min-h-40 relative
                border border-gray-300 rounded-xl'>
                
                {/* default badge */}
                {address.is_default && 
                  <div className='flex w-full justify-end pe-2'>
                    <div className='px-1.5 py-0.5 inline-flex items-center space-x-1 
                      bg-primary-300 rounded-xl rounded-t-none text-white'>
                      <span className='text-xs'>Default</span>
                      <FaCircleCheck className='text-md' />
                    </div>
                  </div>
                }

                {/* address */}
                <div 
                  className='inline-flex group-hover:text-primary-400 p-3 capitalize'>
                  <span>
                    {Object.keys(address)
                    .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
                    .map(key => address[key]).join(', ')}
                  </span>
                </div>

                {/* actions */}
                <div className="w-full p-3 flex items-center text-xs">
                  {!address.is_default && 
                    <span
                      onClick={() => handleMakeAddressDefault(address._id)}
                      className='cursor-pointer
                      smotth hover:text-primary-400 hover:underline'
                    >Make default</span>
                  }
                </div>
              </div>
            )
          })

        }
        <div className='flex items-center justify-center min-h-40 
          border border-gray-300 rounded-xl cursor-pointer smooth
          hover:border-primary-300 hover:bg-primary-25 group'>
          <div className='inline-flex flex-col items-center group-hover:text-primary-400'>
            <MdOutlineAddLocationAlt className='text-2xl'/>
            <span>Add new</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Addresses