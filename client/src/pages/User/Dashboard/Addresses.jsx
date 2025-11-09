import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import AxiosToast from '../../../utils/AxiosToast';
import { clearError, makeAddressDefault, removeAddress } from '../../../store/slices/AddressSlice';
import { setUser } from '../../../store/slices/UsersSlice';
import toast from 'react-hot-toast';
import AddressModal from '../../../components/user/AddressModal';
import Alert from '../../../components/ui/Alert';
import { useDefaultAddressMutation, useRemoveAddressMutation } from '../../../services/UserMutationHooks';

function Addresses() {

  const dispatch = useDispatch();
  const { addressList:list, error } = useSelector(state => state.address);
  const { user } = useSelector(state => state.user);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const defaultAddressMutation = useDefaultAddressMutation();
  const removeAddressMutation = useRemoveAddressMutation();

  useEffect(() => {
    if(error){
      toast.error(error, {position: 'top-center'});
      dispatch(clearError());
    }
    const sorted = [...list]?.sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
    setAddressList(sorted)
  },[error, list])

  const handleMakeAddressDefault = async(id) => {

    const old_default = addressList?.find(el => el?.is_default === true)?._id || addressList[0]?._id;

    try {
      
      const data = { 
        address_id: id,
        old_default
      }

      const response = await defaultAddressMutation.mutateAsync(
        { data },
        {
          onError: (err) => AxiosToast(err)
        }
      )
  
      if(response?.data?.success){
        
        dispatch(makeAddressDefault(response?.data))

        const updatedUser = {
          ...user,
          default_address: response?.data?.updated
        }
        dispatch(setUser(updatedUser))
        AxiosToast(response, false);
      }
  
    } catch (error) {
      AxiosToast(error);
    }
  }

  const handleRemoveAddress = async(id) => {

    Alert({
      title: 'Are you sure?',
      icon: 'question',
      html: 'You cannot revert back this action',
      showCancelButton: true,
      confirmButtonText: 'Ok, delete it',
      customClass: {
        confirmButton: 'bg-red-500!',
        title: 'text-red-500!',
        icon: 'text-red-500! border-red-500!',
      },
    }).then(async(res) => {
      if(res.isConfirmed){

        const response = await removeAddressMutation.mutateAsync(
          { address_id: id },
          {
            onError: (err) => AxiosToast(err)
          }
        );

        if(response?.data?.success){
          dispatch(removeAddress(response?.data))
          AxiosToast(response, false)
        }

      }
    })

  }

  return (
    <div className='h-full grow p-5 space-y-5'>
      {/* header */}
      <div className='flex items-center space-x-3'>
        <h3 className='text-xl'>Address List</h3>
        {addressList?.length > 0 && (
          <p className='font-semibold text-sm bg-primary-400 text-white
            inline-flex items-center justify-center px-1 rounded-full min-w-5 min-h-2 w-fit h-fit'
          >
            <span>{addressList?.length || ''}</span>
          </p>
        )}
      </div>

      {/* list */}
      <div className="grid grid-cols-4 gap-2">

        {addressList?.length > 0 &&

          addressList.map(address => {
            
            return (
              <div
                key={`${address._id}-${address.is_default}`}
                className='flex flex-col items-center justify-between min-h-40 relative
                border border-gray-300 rounded-xl'>
                
                {/* default badge */}
                {address?.is_default && 
                  <div className='flex w-full justify-end pe-2'>
                    <div className='px-1.5 py-0.5 inline-flex items-center space-x-1 
                      bg-primary-300 rounded-xl rounded-t-none text-white'>
                      <span className='text-xs'>Default</span>
                      <FaCircleCheck className='text-xs' />
                    </div>
                  </div>
                }

                {/* address */}
                <div 
                  className='inline-flex group-hover:text-primary-400 p-3 capitalize'>
                  <span>
                    {Object.keys(address)
                    .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile' && key !== 'createdAt')
                    .map(key => address[key]).join(', ')}
                  </span>
                </div>

                {/* actions */}
                <div className="w-full p-3 flex items-center text-xs space-x-2">
                  {!address?.is_default && 
                    <span
                      onClick={() => handleMakeAddressDefault(address._id)}
                      className='cursor-pointer
                      smotth hover:text-primary-400 hover:underline'
                    >Default</span>
                  }
                  <span
                    onClick={() => {
                      setEditAddress(address?._id);
                      setIsAddModalOpen(true);
                    }}
                    className='cursor-pointer
                    smotth hover:text-sky-500 hover:underline'
                  >Edit</span>
                  <span
                    onClick={() => handleRemoveAddress(address._id)}
                    className='cursor-pointer
                    smotth hover:text-red-400 hover:underline'
                  >Delete</span>
                </div>
              </div>
            )
          })

        }
        <div 
          onClick={() => setIsAddModalOpen(true)}
          className='flex items-center justify-center min-h-40 
          border border-gray-300 rounded-xl cursor-pointer smooth
          hover:border-primary-300 hover:bg-primary-25 group'
        >
          <div className='inline-flex flex-col items-center group-hover:text-primary-400'>
            <MdOutlineAddLocationAlt className='text-2xl'/>
            <span>Add new</span>
          </div>
        </div>

      </div>
      <AddressModal
        edit_address={editAddress}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditAddress(null)
        }}
        onChange={() => {
          setIsAddModalOpen(false);
          setEditAddress(null)
        }}
      />
    </div>
  )
}

export default Addresses