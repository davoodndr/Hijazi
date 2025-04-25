import React, { useEffect, useRef, useState } from 'react'

import { isEmailValid } from '../../services/Misc'
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiPassword } from "react-icons/pi";
import Modal from './Modal';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';
import AxiosToast from '../../utils/AxiosToast';
import { Axios } from '../../utils/AxiosSetup';
import ApiBucket from '../../services/ApiBucket';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { motion } from 'motion/react'

const VerfyOtp = ({ isOpen, onClose, onConfirm, email }) => {

  const inputLength = 6
  const [otp, setOtp] = useState(Array(inputLength).fill(''));
  const [timeLeft, setTimeLeft] = useState(60);
  const [timer, setTimer] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRef = useRef([]);

  /* otp prompt value handling */
  const handleChange = (value, index) => {
    if(!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < inputLength - 1){
      inputRef.current[index + 1].focus();
    }
  }

  /* otp prompt input handling */
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  /* timer for resend otp */
  useEffect(() => {

    let current = 60;

    // Show 60 immediately
    setTimeLeft(current);

    const interval = isOpen ? setInterval(() => {
      current -= 1;
      setTimeLeft(current);

      if (current <= 0) {
        clearInterval(interval);
      }
    }, 1000) : 60

    return () => clearInterval(interval);

  },[isOpen, timer])

  /* action for resend otp */
  const handleResendOtp = async() => {

    if(!timeLeft){

      setResendLoading(true)

      try {

        const response = await Axios({
          ...ApiBucket.resendOtp,
          data: {email}
        })

        if(response.data.success){
          AxiosToast(response, false);
          setTimer(prev => (prev += 1));
        }
        
      } catch (error) {
        console.log(error);
        AxiosToast(error);
      }finally{
        setResendLoading(false)
      }
    }
  }
  
  /* consforming otp valid */
  const handleVerifyConfirm = async() => {
    
    const finalOtp = otp.join('').trim();

    if(finalOtp.length === 6){

      setIsLoading(true);

      try {

        const response = await Axios({
          ...ApiBucket.verifyForgotPasswordOtp,
          data: {
            email,
            otp: finalOtp
          }
        })

        if(response.data.success){
          AxiosToast(response, false)
        }

        setOtp(Array(inputLength).fill(''));

        return onConfirm(email);
        
      } catch (error) {
        AxiosToast(error)
      } finally{
        setIsLoading(false);
      }

      return

    }
    toast.error('Invalid otp entered')

  }

  return (

    <AnimatePresence>
      {/* should keep this pattern to maintain exit animation */}
      {isOpen && <Modal isOpen={isOpen}>

        <div className='w-80 flex flex-col items-center'>

          <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
            <PiPassword size={30} />
          </div>

          <h1 className='text-xl'>Verify OTP</h1>
          <p>Please check your mail & enter opt here.</p>
          
          {/* otp prompts */}
          <div className='flex flex-col'>
            {/* otp inputs */}
            <div className='flex w-full justify-center gap-2 mt-5 mb-2'>
              {otp.map((digit, index) => (
                <input className='w-10! h-10! text-lg p-0! text-center font-semibold'
                  key={index} type="text" inputMode='numeric' maxLength={1} value={digit}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e=> handleKeyDown(e, index)}
                  ref={el => (inputRef.current[index] = el)} placeholder='0'/>
              ))}
                
              </div>

            {/* otp expiration time and resend otp */}
            <div className='flex justify-between w-full mb-3'>
              <div className='text-xs'>
                {timeLeft === 0 ? 
                    <span className='text-sm text-red-500'>OTP Expired</span>
                  :
                    <>
                      <span className='me-2'>OTP will expire in:</span>
                      <span className='text-sm text-red-500'>{Math.floor(timeLeft / 60)} : {String(timeLeft % 60).padStart(2,'0')}</span>
                    </>
                  
                }
              </div>
              <div onClick={handleResendOtp} 
                className={`inline-flex ${timeLeft === 0 ? 'cursor-pointer text-orange-400 font-semibold underline'
                : 'text-neutral-400'} transition-all duration-300`}>
                
                <AnimatePresence mode="wait">
                  {resendLoading && (
                    <motion.div
                      key="spinner"
                      initial={{ width: 0, height: 0, opacity: 0 }}
                      animate={{ width: 23, height: 23, opacity: 1 }}
                      exit={{ width: 0, height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex items-center justify-center"
                    >
                      <ClipLoader color="black" size={15} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className='me'>Resend</span>

              </div>
            </div>
          </div>

          {/* controle buttons */}
          <div className='flex w-full items-center justify-between pt-6'>
            <div onClick={onClose} className='inline-flex items-center gap-2 cursor-pointer'>
              <IoMdArrowRoundBack />
              <span>Back to login</span>
            </div>
            
            <button onClick={handleVerifyConfirm} className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300`}>

              <span className='me-2'>Send code</span>
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="spinner"
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{ width: 23, height: 23, opacity: 1 }}
                    exit={{ width: 0, height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                  >
                    <ClipLoader color="white" size={23} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            
          </div>
        </div>

        </Modal>}
    </AnimatePresence>
  )

}

export default VerfyOtp