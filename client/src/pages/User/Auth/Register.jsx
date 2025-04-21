import React, { useState } from 'react'
import welcome from '../../../assets/welcome_to_shop.jpg'
import googleLogo from '../../../assets/google-logo.svg'
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { Link } from 'react-router'

const Register = () => {
  const [passwordShowing, setPasswordShowing] = useState(false);
  const [confirmShowing, setConfirmShowing] = useState(false);

  return (
    <main className='flex flex-col w-full h-full bg-primary-25 items-center justify-center'>
      <div className='bg-white from-primary-300 to-primary-50 shadow-xl border border-primary-50 
        md:w-7/10 md:h-screen mx-2 md:mx-0 my-10 p-2 rounded-4xl flex flex-col md:flex-row gap-10 overflow-hidden items-stretch'>
      
        {/* image */}
        <div className='flex w-full md:w-6/10 h-full'>
          <img src={welcome} className='object-cover rounded-3xl h-full' alt="welcome-img" />
        </div>

        {/* form inputs */}
        <div className='flex flex-col items-center justify-between w-full md:w-4/10'>
          <form className='border-neutral-200 w-full p-6 md:pb-2 flex flex-col gap-3'>
            <div>
              <p className='text-center text-2xl'>Create an account</p>
              <p className='text-center text-xs mb-5'>Sign up and get an account</p>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">User name</label>
              <input type="text" placeholder='Enter username' />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">Email</label>
              <input type="email" placeholder='Enter email address' />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">Password</label>
              <div className='flex items-center border border-neutral-200 focus-within:border-primary-300 
                rounded-input-border transition-colors duration-300'>
                <input type={`${passwordShowing ? 'text' : 'password'}`} className='border-0!' placeholder='Enter password' />
                <div onClick={() => setPasswordShowing(!passwordShowing)} className='inline-flex items-center h-full px-2 cursor-pointer'>
                  {passwordShowing ?
                    (<LuEye size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                    :
                    (<LuEyeClosed size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                  }
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">Confirm</label>
              <div className='flex items-center border border-neutral-200 focus-within:border-primary-300 
                rounded-input-border transition-colors duration-300'>
                <input type={`${confirmShowing ? 'text' : 'password'}`} className='border-0!' placeholder='Re-enter password' />
                <div onClick={() => setConfirmShowing(!confirmShowing)} className='inline-flex items-center h-full px-2 cursor-pointer'>
                  {confirmShowing ?
                    (<LuEye size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                    :
                    (<LuEyeClosed size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                  }
                </div>
              </div>
            </div>

            <button className='mt-5'>Sign Up</button>
          </form>
          
          {/* google sign-in */}
          <div className='flex items-center justify-center w-fit border border-neutral-300 rounded-3xl ps-1 pe-4
            transition-all duration-300 hover:scale-103 hover:shadow-md hover:border-primary-300 cursor-pointer'>
            <div className='inline-flex w-10 h-10'>
              <img src={googleLogo} alt="google-logo" />
            </div>
            <span className='text-xs'>Sign in with Google</span>
          </div>
          
          {/* link to sign-in page */}
          <div className='flex w-full justify-between py-6 px-4 md:py-3 md:pe-3 text-xs'>
            <p className='text-neutral-500'>Already have an account? 
              <Link to={'/login'} className='ms-1 underline text-primary-500 font-semibold'>Sign In</Link>
            </p>

            <Link className='underline text-neutral-500'>Terms & Conditions</Link>

          </div>

        </div>

      </div>
    </main>
  )
}

export default Register