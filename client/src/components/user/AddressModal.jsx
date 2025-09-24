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
import { newAddress } from '../../store/slices/AddressSlice'
import toast from 'react-hot-toast'

function AddressModalComponent({isOpen, onChange, onClose, showSelector = false}) {

  const dispatch = useDispatch();
  const { addressList } = useSelector(state => state.address);
  const [expanded, setExpanded] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: '', mobile: '', address_line: '', landmark: '', city: '', state: '',
    pincode: '', is_default: false
  });

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
        [name]: value.toString().trim().toLowerCase()
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
        await dispatch(newAddress({data}))
        setData({
          name: '', mobile: '', address_line: '', landmark: '', city: '', state: '',
          pincode: '', is_default: false
        })
        setExpanded(showSelector ? 'list' : 'form')
        setIsLoading(false);
        onChange();
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
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen}>
        <div className='w-150 flex flex-col'>
          {/* header */}
          <div className='flex gap-4 mb-3 border-gray-300'>
            <div className='p-2 border border-primary-300 rounded-xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col leading-3.5">
              <h1 className='text-lg'>{expanded === 'form' ? 'Create' : 'Select'} Address</h1>
              {expanded === 'form' ?
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
                    className={clsx('group-hover:!text-black smooth',
                      expanded === 'list' ? '!text-primary-300' : '!text-gray-400',
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
                  {expanded === 'list' && <motion.div
                    key='address_list'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b-gray-200"
                  >
                    <div className='flex space-x-2 w-full overflow-x-auto scroll-basic p-3 pt-0'>
                      
                      {addressList?.length > 0 ?
                        addressList.map(address => {
                          
                          const addressData = Object.keys(address)
                            .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
                            .map(key => address[key]).join(', ')

                          return (
                            <label
                              key={address._id}
                              className={clsx('w-40 shrink-0 p-3 border rounded-xl cursor-pointer relative',
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
                            hover:bg-primary-25 hover:!text-primary-400`}
                        >
                          <TbLocationPlus className='text-2xl' />
                          <span>Add new address</span>
                        </label>
                      }
                    </div>
                  </motion.div>}
                </AnimatePresence>
              </div>
            }

            {/* new address tab */}
            <div className='flex flex-col'>

              <div 
                onClick={() => setExpanded('form')}
                className='flex items-center justify-between p-3 cursor-pointer group'
              >
                <h3 className={clsx('group-hover:!text-black smooth',
                  expanded === 'form' ? '!text-primary-300' : '!text-gray-400'
                )}
                >New</h3>
                <IoIosArrowDown className={clsx(
                  expanded === 'form' && 'rotate-180'
                )} />
                
              </div>
              
              <AnimatePresence>
                {expanded === 'form' && <motion.div
                  key='address_list'
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
                      value={data.name}
                      onChange={handleChange}
                      placeholder='full name' />

                    <input 
                      type="text"
                      name='mobile'
                      value={data.mobile}
                      onChange={handleChange}
                      placeholder='mobile number' />

                    <input 
                      type="text"
                      name='address_line'
                      value={data.address_line}
                      onChange={handleChange}
                      className='col-span-2'
                      placeholder='address line' />

                    <input 
                      type="text"
                      name='landmark'
                      value={data.landmark}
                      onChange={handleChange} 
                      placeholder='@eg: near apex bridge' />

                    <input 
                      type="text"
                      name='city'
                      value={data.city}
                      onChange={handleChange}  
                      placeholder='city / town / district' />

                    <input 
                      type="text"
                      name='pincode'
                      value={data.pincode}
                      onChange={handleChange} 
                      placeholder='6 digit pincode' />

                    <CustomSelect
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
                        onChange={(e) => {
                          setData(prev => ({...prev, is_default: e.target.checked}))
                        }}
                        id="make-default" />
                      <label htmlFor="make-default" className='!text-gray-600 !leading-normal'
                      >Make this my default address</label>
                    </div>
                  </form>

                </motion.div>}
              </AnimatePresence>

            </div>
          </div>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pt-4'>
            
            <button
              onClick={handleClose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              onClick={handleSubmit}
              text='Add Now'
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