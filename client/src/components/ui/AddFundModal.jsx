import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react'
import Modal from './Modal';
import LoadingButton from './LoadingButton';
import { ClipLoader } from 'react-spinners';
import { GiWallet } from "react-icons/gi";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addFundSync } from '../../store/slices/WalletSlice';
import { processRazorpayAction, verifyRazorpayAction } from '../../services/ApiActions';
import AxiosToast from '../../utils/AxiosToast';
import { Axios } from '../../utils/AxiosSetup';
import ApiBucket from '../../services/ApiBucket';

function AddFundModalComponent({isOpen, onSubmit, onClose}) {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState(null);

  const handleAddFund = async() => {
    if(amount && description){

      setIsLoading(true);

      try {

        const prefill = {
          name: "Test name",
          contact: "+917012860026" //this is format is must
        }
        const paymentResponse = await processRazorpayAction(amount, prefill, `rcpt_${Date.now()}`);
        const result = await verifyRazorpayAction(paymentResponse);

        const data = {
            amount, 
            description,
            paymentInfo: {
              paymentMethod: "razor-pay",
              paidAt: result?.paidAt,
              detail: {
                ...result?.paymentResult
              }
            }
          }

        await dispatch(addFundSync(data))
        
        onClose();

      } catch (error) {
        AxiosToast(error)
      }finally{
        setIsLoading(false);
      }

    }else{
      toast.error(`Please enter a ${!amount ? 'valid amount' : 'short description'}!`,
        {position: "top-center"}
      )
      return
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
            <div className='p-2 border border-primary-300 rounded-xl bg-primary-50'>
              <GiWallet className='text-primary-500' size={20} />
            </div>
            <h1 className='text-lg !text-primary-400'>How much do you wish to add?</h1>
          </div>

          <div>
            <div className='flex flex-col mt-5 px-3'>
              <label htmlFor="">Amount</label>
              <input
                onChange={(e) => {
                  if(e.target.value > 0){
                    setAmount(e.target.value)
                  }
                }}
                type="number"
                placeholder='Enter amount'  
              />
            </div>
            
            <div className='flex flex-col mt-5 px-3'>
              <label htmlFor="">Description</label>
              <input
                onChange={(e) => {
                  if(e.target.value){
                    setDescription(e.target.value.trim())
                  }
                }}
                type="text"
                placeholder='Enter description'  
              />
            </div>
          </div>

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
              onClick={handleAddFund}
              text='Add now'
              loadingText='Adding . . . . .'
              icon={<ClipLoader color="white" size={23} />}
              className={`px-4! rounded-3xl! inline-flex items-center smooth !bg-primary-400`}
            />
          </div>
        </div>
        </Modal>
      }
    </AnimatePresence>
  )
}

const AddFundModal = React.memo(AddFundModalComponent);

export default AddFundModal