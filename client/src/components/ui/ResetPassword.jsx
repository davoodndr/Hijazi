import React, { useEffect, useRef, useState } from 'react'

import { isEmailValid } from '../../utils/Utils'
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineLockReset } from "react-icons/md";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import Modal from './Modal';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';
import AxiosToast from '../../utils/AxiosToast';
import { Axios } from '../../utils/AxiosSetup';
import ApiBucket from '../../services/ApiBucket';
import { ClipLoader } from 'react-spinners'
import { motion } from 'motion/react'

const ResetPassword = ({ email, isOpen, onClose, onConfirm }) => {

  const [passwordShowing, setPasswordShowing] = useState(false);
  const [confirmShowing, setConfirmShowing] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");


  /* reset password action */
  const handleResetConfirm = async() => {
    
    if(password && confirm){

      if(password !== confirm){
        toast.error("Password doesn\'t match");
        return;
      }

      setIsLoading(true);

      try {

        const response = await Axios({
          ...ApiBucket.resetPassword,
          data: {email, password}
        })

        AxiosToast(response, false);
        setPassword("")
        setConfirm("");

      } catch (error) {
        console.log(error)
        AxiosToast(error);

      } finally {
        setIsLoading(false);
      }

      return onConfirm();
    }
    toast.error('Please fill all fields');
  }

  return (

    <AnimatePresence>
      {/* should keep this pattern to maintain exit animation */}
      {isOpen && <Modal isOpen={isOpen}>

        <div className='w-100 flex flex-col items-center'>
          <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
            <MdOutlineLockReset size={30} />
          </div>

          <h1 className='text-xl'>Reset password</h1>
          <p>You can now reset your password</p>

          {/* password prompt */}
          <div className="flex flex-col gap-2 w-8/9 py-3">
            <div className='w-full'>
              <label htmlFor="">Password</label>
              <div className='flex items-center border border-neutral-300 focus-within:border-primary-300 
                rounded-input-border transition-colors duration-300'>

                <input type={`${passwordShowing ? 'text' : 'password'}`} className='border-0!'
                    name='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter password' />

                <div onClick={() => setPasswordShowing(!passwordShowing)} className='inline-flex items-center h-full px-2 cursor-pointer'>
                  {passwordShowing ?
                    (<LuEye size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                    :
                    (<LuEyeClosed size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                  }
                </div>
              </div>
            </div>
            <div className='w-full'>
              <label htmlFor="">Confirm</label>
              <div className='flex items-center border border-neutral-300 focus-within:border-primary-300 
                rounded-input-border transition-colors duration-300'>

                <input type={`${confirmShowing ? 'text' : 'password'}`} className='border-0!'
                    name='confirm' value={confirm} onChange={e => setConfirm(e.target.value)} placeholder='Re-enter password' />

                <div onClick={() => setConfirmShowing(!confirmShowing)} className='inline-flex items-center h-full px-2 cursor-pointer'>
                  {confirmShowing ?
                    (<LuEye size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                    :
                    (<LuEyeClosed size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                  }
                </div>
              </div>
            </div>
          </div>

          {/* footer - action buttons */}
          <div className='flex w-full items-center justify-between pt-10'>
            <div onClick={onClose} className='inline-flex items-center gap-2 cursor-pointer'>
              <IoMdArrowRoundBack />
              <span>Back to login</span>
            </div>
            
            <LoadingButton
              onClick={handleResetConfirm}
              loading={loading}
              text='Reset Now'
              loadingText='Processing. . . . .'
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

export default ResetPassword