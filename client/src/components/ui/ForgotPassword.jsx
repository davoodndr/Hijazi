import React, { useEffect, useRef, useState } from 'react'

import { isEmailValid } from '../../utils/Utils'
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiKey } from "react-icons/fi";
import Modal from './Modal';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';
import AxiosToast from '../../utils/AxiosToast';
import { Axios } from '../../utils/AxiosSetup';
import ApiBucket from '../../services/ApiBucket';
import { ClipLoader, MoonLoader } from 'react-spinners'
import { motion } from 'motion/react'
import LoadingButton from './LoadingButton';

const ForgotPassword = ({ role = 'user', isOpen, onClose, onConfirm }) => {

  const [email, setEmail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const ref = useRef(null);

  /* send otp email action */
  const handleConfirm = async() => {
    
    if(isEmailValid(email)){

      setIsLoading(true);

      try {

        const response = await Axios({
          ...ApiBucket.forgotPasswordOtp,
          data: {email, role}
        })

        if(response.data.success){
          AxiosToast(response, false);
        }

        onConfirm(email);
        setEmail("")

      } catch (error) {
        AxiosToast(error);
      } finally {
        setIsLoading(false);
      }

      return

    }
    toast.error('Please enter valid email');
    ref.current.focus();
  }

  return (

    <AnimatePresence>
      {/* should keep this pattern to maintain exit animation */}
      {isOpen && <Modal isOpen={isOpen}>

        <div className='w-90 flex flex-col items-center'>

          <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
            <FiKey size={30} />
          </div>

          <h1 className='text-xl'>Forgot password?</h1>
          <p>No worries, we'll send you reset instructions.</p>

          {/* email prompt */}
          <div className='flex flex-col w-full my-5'>
            <label htmlFor="" className='text-neutral-600! font-semibold!'>Email</label>
            <input ref={ref} type="text" value={email} onChange={e => setEmail(e.target.value)} 
              placeholder='Enter your email'/>
          </div>

          {/* action buttons */}
          <div className='flex w-full items-center justify-between pt-6'>
            <div onClick={onClose} className='inline-flex items-center gap-2 cursor-pointer'>
              <IoMdArrowRoundBack />
              <span>Back to login</span>
            </div>
            
            <LoadingButton
              onClick={handleConfirm}
              loading={loading}
              text='Send code'
              loadingText='Sending. . . . .'
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

export default ForgotPassword