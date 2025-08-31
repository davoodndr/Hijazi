import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { BsPatchQuestionFill } from "react-icons/bs";
import Modal from './Modal';
import LoadingButton from './LoadingButton';
import { ClipLoader } from 'react-spinners';
import CustomSelect from './CustomSelect';
import { cancelOrder } from '../../services/ApiActions';
import { useDispatch } from 'react-redux';
import { updateOrder } from '../../store/slices/OrderSlice';
import toast from 'react-hot-toast';

function CancelOrderModalComponent({isOpen, order, onSubmit, onClose}) {

  const dispatch = useDispatch();
  const [writingSelected, setWritingSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState(null);

  /* handle change dropdown */
  const handleOnChange = (option) => {
    
    if(option?.value === 'other'){
      setWritingSelected(true);
    }else{
      setWritingSelected(false);
      setReason(option?.label);
    }
    
  }

  /* handle type on textarea */
  const handleWriteReason = (e) => {
    setReason(e?.target?.value)
  }

  /* handle cancel api call */
  const handleCancel = async() => {
    
    setIsLoading(true);
    try {
      
      const response = await cancelOrder(order?._id, reason)
      if(response.success){
        toast.success(response.message, {position: "top-center"});

        const data = response.order;
        dispatch(updateOrder({_id: data?._id, status: data?.status}))
        onSubmit(data)
      }

    } catch (error) {
      console.log(error.response)
    }finally{
      setIsLoading(false);
    }
  }

  const handleclose = () => {
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && <Modal isOpen={isOpen}>
        <div className='w-100 flex flex-col space-y-10 overflow-hidden'>
          {/* header */}
          <div className='flex gap-4 mb-3 border-gray-300 items-center'>
            <div className='p-2 border border-red-300 rounded-xl bg-red-50'>
              <BsPatchQuestionFill className='text-red-500' size={20} />
            </div>
            <h1 className='text-lg !text-red-500'>Are you sure?</h1>
          </div>

          <motion.div className='flex flex-col mt-5 px-3'>
            <p>Why are you cancelling this order?</p>
            <CustomSelect
              onChange={handleOnChange}
              labelClass='normal-case'
              placeholder='Select a reason......'
              options={[
                {value: 'by_mistake', label: "Ordered by mistake"},
                {value: 'changed_mind', label: "Changed my mind"},
                {value: 'better_price', label: "Found better price"},
                {value: 'other', label: "Other reason"},
              ]}
            />

            <AnimatePresence>
              {writingSelected && 
                <motion.div
                  key="text_box"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <textarea
                    onChange={handleWriteReason}
                    name="other_reason"
                    rows="4"
                    placeholder='Write your reason here'
                    className='mt-3 !h-auto'
                  ></textarea>
                </motion.div>
              }
            </AnimatePresence>
          </motion.div>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pb-2 pr-2'>
            
            <button
              onClick={handleclose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              onClick={handleCancel}
              text='Yes, cancel now'
              loadingText='Cancelling . . . . .'
              icon={<ClipLoader color="white" size={23} />}
              className={`px-4! rounded-3xl! inline-flex items-center smooth !bg-red-400`}
            />
          </div>
        </div>
        </Modal>
      }
    </AnimatePresence>
  )
}

const CancelOrderModal = React.memo(CancelOrderModalComponent);

export default CancelOrderModal