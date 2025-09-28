import { AnimatePresence } from 'motion/react'
import React from 'react'
import Modal from './Modal'
import LoadingButton from './LoadingButton'
import { ClipLoader } from 'react-spinners'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import StarRating from '../user/StarRating'

function RateProductModalComponent({ isOpen, onClose, onSubmit}) {

  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const handleClose = () => {
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen}>
        <div className='w-120 flex flex-col space-y-2 overflow-hidden'>
          {/* header */}
          <div className='flex gap-4 pb-3 mb-4 border-b border-gray-300 items-center'>
            <div className='p-2 border border-primary-300 rounded-xl bg-primary-50'>
              <FaStar className='text-primary-500' size={20} />
            </div>
            <h1 className='text-lg !text-primary-400'>Rating & Review</h1>
          </div>

          {/* content */}
          <div className='flex flex-col space-y-2'>

            <div className='flex items-end space-x-2'>
              <div className='flex-1'>
                <label htmlFor="">Title</label>
                <input 
                  type="text"
                  placeholder='@ex: Excellent product'
                />
              </div>

              {/* star rating */}
              <div className="flex-1">
                <label htmlFor="">Star Rating</label>
                <span className='h-[40px] border border-neutral-300 rounded-input-border flex justify-center'>
                  <StarRating
                    onClick={(rating) => setRating(rating)}
                    showPercentage={true}
                    starClass='text-2xl' 
                  />
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="">Review</label>
              <textarea name="" id="" rows={4}
                placeholder='Enter your review here'
                className='!h-auto'
              />
            </div>

          </div>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pb-2 pr-2'>
            
            <button
              onClick={handleClose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              /* onClick={handleAddFund} */
              text='Submit'
              loadingText='Processing . . . . .'
              icon={<ClipLoader color="white" size={23} />}
              className={`px-4! rounded-3xl! inline-flex items-center smooth !bg-primary-400`}
            />
          </div>
        </div>
      </Modal>}
    </AnimatePresence>
  )
}

const RateProductModal = React.memo(RateProductModalComponent)

export default RateProductModal