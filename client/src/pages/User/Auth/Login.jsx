import React, { useCallback, useEffect, useState } from 'react'
import welcome from '../../../assets/welcome_to_shop_green.jpg'
import googleLogo from '../../../assets/google-logo.svg'
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../store/slices/UsersSlice';
import { getUserDetail } from '../../../services/FetchDatas';
import { useGoogleAuth } from '../../../services/hooks';
import ForgotPassword from '../../../components/ui/ForgotPassword';
import VerfyOtp from '../../../components/ui/VerifyOtp';
import ResetPassword from '../../../components/ui/ResetPassword';
import { AnimatePresence } from 'motion/react';
import Modal from '../../../components/ui/Modal';
import Lottie from 'lottie-react'
import success_icon from '../../../assets/animated_success_icon.json'


const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const [passwordShowing, setPasswordShowing] = useState(false);
  const [isForgotPassOpen, setForgotPassOpen] = useState(false);
  const [isVerifyOtpOpen, setVerifyOtpOpen] = useState(false);
  const [isResetOpen, setResetOpen] = useState(false);
  const [isSuccesOpen, setSuccessOpen] = useState(false);

  const [capturedValue, setCapturedValue] = useState("");
  const [data, setData] = useState({email: '', password: ''});

  /* handling user inputs values */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validateValues = Object.values(data).every(el => el);

  /* handling submit user credentials */
  const handleSubmit = async(e) => {
    
    e.preventDefault();

    if(validateValues){

      try {

        const response = await Axios({
          ...ApiBucket.login,
          data
        })

        if(response.data.success){
          AxiosToast(response, false);

          localStorage.setItem('accessToken',response.data.accessToken);
          localStorage.setItem('refreshToken',response.data.refreshToken);

          const userData = await getUserDetail();

          dispatch(setUser({user: userData}));

          setData({email: '', password: ''});
          navigate('/');
        }
        
      } catch (error) {
        
        AxiosToast(error)
      }

    }else{
      toast.error('Please fill all fields');
    }
  }

  /* imported hook for google auth */
  const googleLogin = useGoogleAuth();

  /* setting up the email for accessing verify otp*/
  const handleForgotMail = useCallback((values)=> {
    setCapturedValue(values);
    setForgotPassOpen(false);
    setVerifyOtpOpen(true)
  },[isForgotPassOpen]);

  /* setting email for accessing reset password */
  const handleVerifyOtp = useCallback((values)=> {
    setCapturedValue(values);
    setVerifyOtpOpen(false);
    setResetOpen(true)
  },[isVerifyOtpOpen]);

  /* setting email for accessing reset password */
  const handleResetPassword = useCallback(()=> {
    setResetOpen(false);
    setSuccessOpen(true);
  },[isVerifyOtpOpen]);


  /* for prevent access of user already logged in */
  useEffect(() => {
    if(user && user.role === 'user'){
      navigate('/');
    }

  },[user])

  return (
    <main className='flex flex-col w-full h-full bg-primary-50 items-center justify-center'>
      <div className='bg-white from-primary-300 to-primary-50 shadow-xl border border-primary-50 
        md:w-7/10 md:h-130 mx-2 md:mx-0 my-10 p-2 rounded-4xl flex flex-col md:flex-row gap-5 overflow-hidden items-stretch'>
      
        {/* image */}
        <div className='flex w-full md:w-6/10 h-full'>
          <img src={welcome} className='object-cover rounded-3xl h-full' alt="welcome-img" />
        </div>

        {/* form inputs */}
        <div className='flex flex-col items-center justify-between w-full md:w-4/10'>
          <form /* onSubmit={handleSubmit}  */className='border-neutral-200 w-full p-6 md:pb-2 flex flex-col gap-3'>
            <div>
              <p className='text-center text-2xl'>Sign in</p>
              <p className='text-center text-xs mb-5'>Sign in and get in to your account</p>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">Email</label>
              <input type="email" name='email' value={data.email} onChange={handleChange} placeholder='Enter email address' />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="">Password</label>
              <div className='flex items-center border border-neutral-300 focus-within:border-primary-300 
                rounded-input-border transition-colors duration-300'>

                <input type={`${passwordShowing ? 'text' : 'password'}`} className='border-0!' 
                  name='password' value={data.password} onChange={handleChange} placeholder='Enter password' />
                
                <div onClick={() => setPasswordShowing(!passwordShowing)} className='inline-flex items-center h-full px-2 cursor-pointer'>
                  {passwordShowing ?
                    (<LuEye size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                    :
                    (<LuEyeClosed size={20} className='transition-colors duration-300 text-neutral-400 hover:text-primary-300' />)
                  }
                </div>
              </div>
            </div>

            {/* forgot password */}
            <div className='flex items-center justify-end'>
              <label onClick={()=> setForgotPassOpen(true)}
              htmlFor='forgot-pass' className='m-0! pe-2 cursor-pointer hover:text-black!'>Forgot password</label>
              
            </div>

            <button className='mt-5' type='submit' onClick={handleSubmit}>Sing in</button>
          </form>

          {/* forgot password modal */}
          <ForgotPassword 
            isOpen={isForgotPassOpen} 
            onClose={() => setForgotPassOpen(false)} 
            onConfirm={handleForgotMail} />

          {/* Verify Otp */}
          <VerfyOtp 
            email={capturedValue}
            isOpen={isVerifyOtpOpen} 
            onClose={() => setVerifyOtpOpen(false)} 
            onConfirm={handleVerifyOtp} />

          {/* Reset password */}
          <ResetPassword 
            email={capturedValue}
            isOpen={isResetOpen} 
            onClose={() => setResetOpen(false)} 
            onConfirm={handleResetPassword} />

          {/* message after reset success */}
          <AnimatePresence>
            {isSuccesOpen && <Modal isOpen={isSuccesOpen}>
              <div className="w-90 flex flex-col items-center">
                
                <div className='mb-3 w-50'>
                  <Lottie animationData={success_icon} loop={false} speed={1}
                   style={{height: 100, transform: "scale(2)", transformOrigin: "center"}} />
                </div>

                <div className='flex flex-col items-center'>
                  <h1 className='text-xl'>Password Changed!</h1>
                  <p className='w-7/10 text-center'>Congrats, You can now login with your new password</p>
                </div>

                <button onClick={() => setSuccessOpen(false)} className='w-30 rounded-3xl! mt-7'>Ok</button>

              </div>
            </Modal>}
          </AnimatePresence>
          
          {/* google sign-in */}
          <div className='flex items-center justify-center w-fit border border-neutral-300 rounded-3xl ps-1 pe-4
            transition-all duration-300 hover:scale-103 hover:shadow-md hover:border-primary-300 cursor-pointer'>
            <div className='inline-flex w-10 h-10'>
              <img src={googleLogo} alt="google-logo" />
            </div>
            <span className='text-xs' onClick={googleLogin}>Sign in with Google</span>
          </div>
          
          {/* link to sign-in page */}
          <div className='flex w-full justify-between py-6 px-4 md:py-3 md:pe-3 text-xs'>
            <p className='text-neutral-500'>Don't have an account? 
              <Link to={'/register'} className='ms-1 underline text-primary-500 font-semibold'>Sign Up</Link>
            </p>

            <Link className='underline text-neutral-500'>Terms & Conditions</Link>

          </div>

        </div>

      </div>
    </main>
  )
}

export default Login