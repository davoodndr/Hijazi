import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import user_placeholder from '../../../assets/user_placeholder.jpg'
import CropperModal from '../../../components/ui/CropperModal';
import { IoImage } from 'react-icons/io5';
import { finalizeValues, imageFileToSrc, isEmailValid } from '../../../utils/Utils';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { setUser } from '../../../store/slices/UsersSlice';
import { setLoading } from '../../../store/slices/CommonSlices';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoMdCall } from "react-icons/io";

function UserProfile() {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [data, setData] = useState({
    username: '', fullname: '', gender: '', mobile: '', email:'', password: '', confirm: ''
  })

  useEffect(() => {
    setAvatarPreview(user?.avatar?.url);
    setData({
      username: user?.username, 
      fullname: user?.fullname, 
      gender: user?.gender, 
      mobile: user?.mobile, 
      email:user?.email
    })
  },[user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => {
      return {
        ...prev,
        [name] : value
      }
    })
  }

  const handleCropImage = async(files) => {
    // for dispalying images on thumbs
    try {
      const src = await imageFileToSrc(files.thumb);
      setAvatarPreview(src);

      setAvatar(files);
      
    } catch (err) {
      console.error('Error reading file:', err);
    }

    setIsModalOpen(false);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const finalData = finalizeValues(data);
    
    if(isEmailValid(finalData.email)){

      const formData = new FormData();
      for(const key in finalData){
        formData.append(key, finalData[key])
      }
      if(avatar && Object.values(avatar).length){
        formData.append('image', avatar.file)
        formData.append('public_id', user?.avatar?.public_id || finalData?.username)
      }

      try {

        dispatch(setLoading(true))
        
        const response = await Axios({
          ...ApiBucket.updateUserDetail,
          data: formData
        })

        if(response.data.success){
          dispatch(setUser({user: response?.data?.user}));
          AxiosToast(response, false)
        }

      } catch (error) {
        AxiosToast(error || error?.message)
      }finally{
        dispatch(setLoading(false))
      }

    }
  }

  return (
    <div className='grow px-5 py-3 space-y-5'>
      {/* header */}
      <h3 className='text-xl'>Profile Settings</h3>

      {/* content */}
      <div className="inline-flex w-full space-x-5 rounded-xl">

        {/* avatar */}
        <div className='w-[30%] flex flex-col space-y-2 border border-gray-200 p-6
          rounded-2xl'
        >

          <div className='w-50 relative rounded-lg overflow-hidden'>
            <img src={avatarPreview || user_placeholder} className='pointer-events-none' alt="avatar" />
            <svg
              className="absolute inset-0 w-50 h-50 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <mask id="hole">
                  <rect width="100" height="100" fill="white" />
                  <circle cx="50" cy="50" r="47" fill="black" />
                </mask>
              </defs>
              {avatarPreview && 
                <>
                  <rect width="100%" height="100%" fill="rgba(0,0,0,0.1)" mask="url(#hole)" />
                  <circle cx="50" cy="50" r="47" fill="none" stroke="white" strokeWidth="1" />
                </>
              }
            </svg>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className='w-full'
          >Change Image</button>

          <CropperModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            dimen={{width: 450, height:320}}
            title="Crop Image"
            subTitle="Crop images as per the required dimention"
            headerIcon={IoImage}
            onResult={handleCropImage}
            cropper={{
              src: avatarPreview,
              outputFormat: 'webp',
              validFormats: ['jpg','jpeg','png','bmp','webp'],
              outPutDimen: 300,
              thumbDimen: 200,
              containerClass: 'flex flex-col items-center w-full h-full',
              cropperClass: 'flex w-60 !h-60 border border-gray-300 rounded-3xl overflow-hidden',
              buttonsClass: 'flex flex-col space-y-2 -right-12 top-1/2 -translate-y-1/2'
            }}
          />

          <hr className='my-3 border-gray-200' />

          {/* default address */}
          <div className='w-full flex flex-col space-y-2'>
            <div className='font-semibold flex items-center justify-between
              text-primary-400'>
              <span>Default Address</span>
              <FaCircleCheck className='text-md' />
            </div>
            <span className='capitalize'>
              {Object.keys(user?.default_address)
              .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
              .map(key => user?.default_address[key]).join(', ')}
            </span>
            {user?.default_address?.mobile && 
              <p className='capitalize flex items-center space-x-2'>
                <IoMdCall className='text-lg' />
                <span>{user?.default_address?.mobile}</span>
              </p>
            }
          </div>
        </div>

        <form onSubmit={handleSubmit} 
          className='grid grid-cols-2 w-8/10 h-fit p-6 gap-x-5 
            gap-y-2 border border-gray-200 rounded-2xl'
        >

          {/* fullname */}
          <div className='capitalize'>
            <label htmlFor="">full name</label>
            <input 
              type="text"
              name='fullname'
              value={data?.fullname}
              onChange={handleChange}
              placeholder='Full name'
            />
          </div>

          {/* username */}
          <div className='capitalize'>
            <label htmlFor="">user name</label>
            <input 
              type="text"
              name='username'
              value={data?.username}
              onChange={handleChange}
              placeholder='User name'
            />
          </div>

          {/* email */}
          <div className='capitalize'>
            <label htmlFor="">E-mail</label>
            <input 
              type="text"
              name='email'
              value={data?.email}
              onChange={handleChange}
              placeholder='Email'
            />
          </div>

          {/* mobile */}
          <div className='capitalize'>
            <label htmlFor="">Mobile No.</label>
            <input 
              type="text"
              name='mobile'
              value={data?.mobile ?? ''}
              onChange={handleChange}
              placeholder='Mobile No'
            />
          </div>

          {/* password */}
          <div className='capitalize'>
            <label htmlFor="">Password</label>
            <input 
              type="password"
              name='password'
              value={data?.password ?? ''}
              onChange={handleChange}
              placeholder='Password'
            />
          </div>

          {/* password */}
          <div className='capitalize'>
            <label htmlFor="">Confirm Password</label>
            <input 
              type="password"
              name='confirm'
              value={data?.confirm ?? ''}
              onChange={handleChange}
              placeholder='Confirm Password'
            />
          </div>

          <div>
            <label htmlFor="">Gender</label>
            <div className='flex border border-neutral-300 h-[40px] px-3.5 
              rounded-input-border space-x-4'>
              <div className='capitalize inline-flex items-center space-x-1'>
                <input 
                  type="radio"
                  name='gender'
                  value='male'
                  checked={data?.gender === 'male'}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  id='male'
                />
                <label className='cursor-pointer !text-sm' htmlFor='male'>Male</label>
              </div>
              <div className='capitalize inline-flex items-center space-x-1'>
                <input 
                  type="radio"
                  name='gender'
                  value='female'
                  checked={data?.gender === 'female'}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  id='female'
                />
                <label className='cursor-pointer !text-sm' htmlFor='female'>Female</label>
              </div>
            </div>
          </div>

          <div></div>
          <div></div>

          <div className='text-end'>
            <button className='!px-5' type='submit'>Save Changes</button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default UserProfile