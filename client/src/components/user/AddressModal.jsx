import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb'
import CustomSelect from '../../components/ui/CustomSelect'
import { states } from '../../constants/arrays'
import LoadingButton from '../ui/LoadingButton'
import { ClipLoader } from 'react-spinners'
import { FaCircleCheck } from "react-icons/fa6";
import clsx from 'clsx'
import { IoIosArrowDown } from "react-icons/io";
import { TbLocationPlus } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux'
import { isValidDatas } from '../../utils/Utils'
import { addAddress, updateAddress } from '../../store/slices/AddressSlice'
import toast from 'react-hot-toast'
import { useAddAddressMutation, useUpdateAddressMutation } from '../../services/UserMutationHooks'
import AxiosToast from '../../utils/AxiosToast'

function AddressModalComponent({edit_address, isOpen, onChange, onClose, showSelector = false}) {

  const dispatch = useDispatch();
  const { addressList:list } = useSelector(state => state.address);
  const [expanded, setExpanded] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const [data, setData] = useState({
    name: '', mobile: '', address_line: '', landmark: '', city: '', state: '',
    pincode: '', is_default: false
  });
  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  useEffect(() => {
    const sorted = [...list]?.sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
    setAddressList(sorted)
  },[list])

  useEffect(()=> {
    if(isOpen && edit_address){
      const add = list?.find(el => el?._id === edit_address);
      if(add) {
        const editData = {
          name: add?.name,
          mobile: add?.mobile,
          address_line: add?.address_line,
          landmark: add?.landmark,
          city: add?.city,
          state: add?.state,
          pincode: add?.pincode,
          is_default: add?.is_default
        }

        setData(editData)
      }
    }
  },[edit_address, list, isOpen])

  useEffect(() => {
    if(showSelector) setExpanded("list");
      else setExpanded("form");
  },[showSelector])

  // handle change field values
  const handleChange = (e) => {
    let { name, value } = e.target;
    setData(prev => {
      return {
        ...prev,
        [name]: value.toString().toLowerCase()
      }
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(expanded === 'form'){
      const validate = isValidDatas(
        ['name','mobile','address_line', 'landmark', 'city', 'state', 'pincode'],
        data
      )

      if(validate){
        setIsLoading(true);
        
        let response = null;
        
        if(edit_address){

          response = await updateAddressMutation.mutateAsync(
            { data: { ...data, address_id: edit_address } },
            {
              onError: (err)=> AxiosToast(err)
            }
          )

        }else{
          response = await addAddressMutation.mutateAsync(
            { data },
            {
              onError: (err)=> AxiosToast(err)
            }
          )
        }

        if(response?.data?.success){
          const newAddress = response?.data?.address;
          if(edit_address){
            dispatch(updateAddress(newAddress))
          }else{
            dispatch(addAddress(newAddress))
          }
          AxiosToast(response, false);
        }
        
        setData({
          name: '', mobile: '', address_line: '', landmark: '', city: '', state: '',
          pincode: '', is_default: false
        })
        setExpanded(showSelector ? 'list' : 'form')
        setIsLoading(false);
        if(showSelector){
          setSelectedAddress(response?.data?.address?._id)
        }else{
          onChange();
        }
      }else{
        toast.error("Please fill all mandatories",{position: 'top-center'})
      }
    }else{
      onChange(selectedAddress)
      setExpanded('list')
    }
  }

  const handleClose = ()=>{
    setExpanded(showSelector ? 'list' : 'form')
    setData({
      name: '', mobile: '', address_line: '', landmark: '', city: '', state: '',
      pincode: '', is_default: false
    })
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen} modalBackDropClass='top-[10%]'>
        <div className='w-150 flex flex-col'>
          {/* header */}
          <div className='flex gap-4 mb-3 border-gray-300'>
            <div className='p-2 border border-primary-300 rounded-xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col leading-3.5">
              <h1 className='text-lg'>{expanded === 'form' ? (edit_address ? 'Edit' :'Create') : 'Select'} Address</h1>
              {expanded === 'form' ?
                edit_address ? 
                (<p className='text-xs'>Change fields to update address</p>)
                :
                (<p className='text-xs'>Fill necessary fields for your address</p>)
               :
               (<p className='text-xs'>Select an address from the list</p>)
              }
            </div>
          </div>

          {/* tabs */}
          <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-2xl">

            {showSelector &&
              <div className="flex flex-col">
              
                <div 
                  onClick={() => setExpanded('list')}
                  className='flex items-center justify-between p-3 cursor-pointer group'
                >
                  <h3 
                    data-count={`${addressList.length > 0 ? addressList.length : 'None'}`}
                    className={clsx('group-hover:text-black! smooth',
                      expanded === 'list' ? 'text-primary-300!' : 'text-gray-400!',
                      `after:content-[attr(data-count)] after:font-light after:ms-2
                      after:inline-flex after:items-center after:justify-center
                      after:px-1 after:py-0.5 after:rounded-full after:leading-3
                      after:min-w-4 after:min-h-4 after:text-[11px] after:text-white`,
                      addressList.length > 0 ? 'after:bg-pink-500' 
                        : 'after:bg-gray-300'
                    )}
                  >Existing</h3>
                  <IoIosArrowDown className={clsx(
                    expanded === 'list' && 'rotate-180'
                  )} />
                  
                </div>

                {/* exisiting address list */}
                <AnimatePresence>
                  {expanded === 'list' && (
                    <motion.div
                      key='address_list'
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-b-gray-200"
                    >
                      <div className='flex space-x-2 max-h-[252px] overflow-y-auto scroll-basic p-3 pe-2.5 me-3.75 pt-0'>
                        
                        <div className="w-full grid grid-cols-3 gap-2">
                          {addressList?.length > 0 ?
                            addressList.map(address => {
                              
                              const addressData = Object.keys(address)
                                .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
                                .map(key => address[key]).join(', ')

                              return (
                                <label
                                  key={address._id}
                                  className={clsx('w-full shrink-0 p-3 border rounded-xl cursor-pointer font-normal relative',
                                    selectedAddress === address._id ? 'border-primary-300 bg-primary-25' : 'border-gray-300'
                                  )}
                                >
                                  {address?.is_default &&
                                    <div className='absolute top-0.5 right-0.5'>
                                      <FaCircleCheck className='text-base text-green-600' />
                                    </div>
                                  }
                                  <input 
                                    type="radio" 
                                    name="address" 
                                    hidden
                                    onChange={() => setSelectedAddress(address._id)}
                                    checked={selectedAddress === address._id} />
                                  <p className='capitalize text-sm text-gray-500'>{addressData}</p>
                                </label>
                              )
                            })
                            :
                            <label
                              onClick={() => setExpanded('form')}
                              className={`w-30 h-30 shrink-0 inline-flex 
                                flex-col items-center justify-center
                                p-3 border border-gray-300 rounded-xl 
                                cursor-pointer smooth hover:border-primary-300
                                hover:bg-primary-25 hover:text-primary-400!`}
                            >
                              <TbLocationPlus className='text-2xl' />
                              <span>Add new address</span>
                            </label>
                          }
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            }

            {/* new address tab */}
            <div className='flex flex-col'>

              <div 
                onClick={() => setExpanded('form')}
                className='flex items-center justify-between p-3 cursor-pointer group'
              >
                <h3 className={clsx('group-hover:text-black! smooth',
                  expanded === 'form' ? 'text-primary-300!' : 'text-gray-400!'
                )}
                >{edit_address ? 'Edit' : 'New'}</h3>
                <IoIosArrowDown className={clsx(
                  expanded === 'form' && 'rotate-180'
                )} />
                
              </div>
              
              <AnimatePresence>
                {expanded === 'form' && (
                  <motion.div
                    layout
                    key='address_form'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b-gray-200 p-3 pt-0"
                  >

                    <form className='grid grid-cols-2 gap-x-3 space-y-3'>
                      <input 
                        type="text"
                        name='name'
                        value={data?.name ?? ''}
                        onChange={handleChange}
                        placeholder='full name' />

                      <input 
                        type="text"
                        name='mobile'
                        value={data?.mobile ?? ''}
                        onChange={handleChange}
                        placeholder='mobile number' />

                      <input 
                        type="text"
                        name='address_line'
                        value={data?.address_line ?? ''}
                        onChange={handleChange}
                        className='col-span-2'
                        placeholder='address line' />

                      <input 
                        type="text"
                        name='landmark'
                        value={data?.landmark ?? ''}
                        onChange={handleChange} 
                        placeholder='@eg: near apex bridge' />

                      <input 
                        type="text"
                        name='city'
                        value={data?.city ?? ''}
                        onChange={handleChange}  
                        placeholder='city / town / district' />

                      <input 
                        type="text"
                        name='pincode'
                        value={data?.pincode ?? ''}
                        onChange={handleChange} 
                        placeholder='6 digit pincode' />

                      <CustomSelect
                        value={
                          (() => {
                          const state = states?.find(el => el?.state === data?.state)
                          return { value: state?.code, label: state?.state }
                          })()
                        }
                        searchable={true}
                        onChange={(item) => {
                          setData(prev => ({...prev, state: item?.label || ''}))
                        }}
                        options={states.map(item => {
                          return {value: item.code, label: item.state}
                        })}
                      />
                      <div className='flex items-center gap-x-2'>
                        <input 
                          type="checkbox"
                          checked={data?.is_default}
                          onChange={(e) => {
                            setData(prev => ({...prev, is_default: e.target.checked}))
                          }}
                          id="make-default" />
                        <label htmlFor="make-default" className='text-gray-600! leading-normal!'
                        >Make this my default address</label>
                      </div>
                    </form>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pt-4'>
            
            <button
              onClick={handleClose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 text-gray-500! hover:text-white! bg-gray-300! hover:bg-gray-400!`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              onClick={handleSubmit}
              text={expanded === 'form' ? (edit_address ? 'Update Now' : 'Create Now') : 'Add Now'}
              loadingText='Creating . . . . .'
              icon={<ClipLoader color="white" size={23} />}
              className={`px-4! rounded-3xl! inline-flex items-center
                transition-all duration-300`}
            />
          </div>

        </div>
      </Modal>}
    </AnimatePresence>
  )
}

const AddressModal = React.memo(AddressModalComponent);

export default AddressModal