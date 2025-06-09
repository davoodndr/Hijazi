import { AnimatePresence } from 'motion/react'
import React from 'react'
import Modal from '../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb'
import CustomSelect from '../../components/ui/CustomSelect'
import { states } from '../../constants/arrays'
import LoadingButton from '../ui/LoadingButton'
import { ClipLoader } from 'react-spinners'
import { useState } from 'react'

function AddressModal({isOpen, onClose}) {

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = ()=>{
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen}>
        <div className='w-150 flex flex-col'>
          {/* header */}
          <div className='flex gap-4 mb-5 border-b border-gray-300'>
            <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className='text-xl'>Select / Create Address</h1>
              <p>Fill necessary fields for your address</p>
            </div>
          </div>

          {/* content */}
          <form className='grid grid-cols-2 gap-x-5 space-y-5'>
            <input type="text" placeholder='full name' />
            <input type="text" placeholder='mobile number' />
            <input type="text" 
              className='col-span-2'
              placeholder='address line' />
            <input type="text" placeholder='@eg: near apex bridge' />
            <input type="text" placeholder='city / town / district' />
            <input type="text" placeholder='6 digit pincode' />
            <CustomSelect
              searchable={true}
              options={states.map(item => {
                return {value: item.code, label: item.state}
              })}
            />
            <div className='flex items-center gap-x-2'>
              <input type="checkbox" name="" id="make-default" />
              <label htmlFor="make-default" className='!text-gray-600 leading-normal'
              >Make this my default address</label>
            </div>
          </form>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pt-6'>
            
            <button
              onClick={handleClose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              text='Add Now'
              loadingText='Creating . . . . .'
              type='submit'
              form='new-category-form'
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

export default AddressModal