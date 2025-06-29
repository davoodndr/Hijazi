import { useEffect, useState } from "react";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { LuEye, LuEyeClosed, LuMail, LuMapPin, LuPhone, LuUser } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import place_holder from '../../../assets/user_placeholder.jpg'
import { MdOutlineImageSearch } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import AxiosToast from "../../../utils/AxiosToast";
import toast from "react-hot-toast";
import { IoAccessibility, IoImage } from "react-icons/io5";
import CustomSelect from "../../../components/ui/CustomSelect";
import { Axios } from "../../../utils/AxiosSetup";
import ApiBucket from "../../../services/ApiBucket";
import { useDispatch } from 'react-redux'
import { setLoading } from '../../../store/slices/CommonSlices'
import { TbArrowBackUp } from "react-icons/tb";
import { HiHome } from "react-icons/hi2";
import { uploadAvatar } from "../../../services/ApiActions";
import CropperModal from "../../../components/ui/CropperModal";
import { imageFileToSrc } from "../../../utils/Utils";

const EditUser = () => {

  const location = useLocation();
  const { user } = location.state;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('');
  const [passwordShowing, setPasswordShowing] = useState(false);
  const [confirmShowing, setConfirmShowing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null)
  const [address, setAddress] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* input handling */
  const [data, setData] = useState({
    username: user?.username, fullname:user?.fullname, email:user?.email, mobile:user?.mobile,
    address_line:user?.default_address?.address_line, 
    city:user?.default_address?.city, state:user?.default_address?.state, 
    pincode:user?.default_address?.pincode,
    password:"", confirm:"", file: ""
  })

  useEffect(() => {
    setImagePreview(user?.avatar)
    setRoles(user?.roles?.map(role => (
      {value: role, label: role.charAt(0).toUpperCase()+role.slice(1)}
    )));
    setStatus({value:user?.status, label: user?.status.charAt(0).toUpperCase()+user?.status.slice(1)})
  },[user])

  const handleChange = (e) => {
    const { name, value} = e.target;
    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // image change handling
  const handleImageSelect = async(e) => {
    try {
      const src = await imageFileToSrc(files.thumb);
      setImagePreview(src);
      
      setData(prev => ({...prev, file: files.file}));
      
    } catch (err) {
      console.error('Error reading file:', err);
    }

    setIsModalOpen(false);
  }

  /* address active and deactive */
  const handleAddressActivation = (e) => {

    const addressContainer = document.querySelector('.hidden-div');
    //const addressContainer = document.querySelector('.address-container');
    const divs = addressContainer.querySelectorAll('div')
    const elements = addressContainer.querySelectorAll('input')
    const addressFeilds = Array.from(elements).map(el => el.name)

    if(!e.target.checked){
      setAddress([]);
      addressFeilds.forEach(item => data[item] = '');
      addressContainer.classList.remove('show');
      addressContainer.addEventListener('transitionend',() => {
        addressContainer.classList.add('hidden')
      },{once: true})

    }else{

      setAddress(addressFeilds);
      addressContainer.classList.remove('hidden')

      void addressContainer.offsetWidth;

      addressContainer.classList.add('show')

    }
  }

  // update user
  const handleSubmit = async(e) => {
    
    e.preventDefault();

    let mandatories = ['username', 'email'];
    // adding address field for validation
    if(address.length) mandatories = mandatories.concat(address);
    const validateValues = mandatories.every(field => data[field]);

    if(validateValues){

      if(data.password && data.password !== data.confirm){
        toast.error("Password doesn\'nt match");
        return
      }

      if(data?.mobile?.length > 0 && data?.mobile?.length < 10){
        toast.error("Invalid mobile number");
        return
      }

      if(address?.length && data.pincode?.length < 6){
        toast.error("Invalid pincode");
        return
      }

      data.roles = roles.map(role => role.value);
      data.status = status?.value || '';

      dispatch(setLoading(true));
      

      try {

        
        //removes blank entries from data for creating newUser
        const filteresData = Object.entries(data).filter(([_,value]) => {
          if (value === "" || value == null || value == undefined) return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        });
        
        const finalData = Object.fromEntries(filteresData);
        
        
        const response = await Axios({
          ...ApiBucket.updateUser,
          data: {
            ...finalData,
            user_id: user._id
          }
        })

        if(response.data.success){

          const file = finalData.file;
          let newAvatar = "";

          if(file){
            const public_id = user.avatar ? user?.avatar?.split('/').filter(Boolean).pop().split('.')[0] : '';
            
            newAvatar = await uploadAvatar(user._id, file, public_id);
          }

          AxiosToast(response, false);
          setData({
            username: "", fullname:"", email:"", mobile:"",
            address_line:"", city:"", state:"", pincode:"",
            password:"", confirm:"", file:''
          })
          setRoles([]);
          setStatus('')
          setImagePreview(null);
          navigate('/admin/users')
        }
        
      } catch (error) {
        console.log(error)
        AxiosToast(error)
      }finally{
        dispatch(setLoading(false))
      }

      return

    }else{
      toast.error("Please fill all mandatories")
    }

  };

  return (
    <section className='flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Update User</h3>
          <span className='sub-title'>Edit user details below</span>
        </div>
        <div className="inline-flex items-stretch gap-5">
          <div className={`inline-flex items-center gap-1.5`}>
            <input
              type="checkbox"
              id="address-ticker"
              className="peer"
              onChange={handleAddressActivation}
            />
            <label
              htmlFor="address-ticker"
              className="!text-[13px] !text-neutral-600 peer-checked:!text-primary-400 
              peer-checked:!font-semibold cursor-pointer"
            >
              Address
            </label>
          </div>
          <button
            onClick={() => navigate('/admin/users')} 
            className='!ps-2 !pe-4 !bg-white border border-gray-300 !text-gray-400 
              inline-flex items-center gap-2 hover:!text-primary-400 hover:!border-primary-300'>
            <TbArrowBackUp size={25} />
            <span>Back</span>
          </button>
          <button 
            form="add-user-form"
            type="submit"
            className='ps-2! pe-4! inline-flex items-center gap-2 text-white'>
            <IoIosAdd size={25} />
            <span>Update Now</span>
          </button>
        </div>
        
      </div>

      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2 text-gray-400'>
          <span>Users</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Update User</span>
        </div>
      </div>

      {/* form */}
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        
        <form onSubmit={handleSubmit} className="columns-2 gap-2 space-y-2 " id="add-user-form">
          {/* Personal Information */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <LuUser className="w-5 h-5" />
              <span>Personal</span>
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="flex text-sm font-medium">
                  <span>Userame</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  name="fullname"
                  value={data.fullname}
                  onChange={handleChange}
                  type="text"
                  className="mt-1"
                  placeholder="Enter full name"
                />
              </div>
              
            </div>
          </div>

          {/* Contact Information */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <LuMail className="w-5 h-5" />
              <span>Contact</span>
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="flex text-sm font-medium">
                  <span>Email</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter emil address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 flex items-center gap-2 relative">
                  <LuPhone className="w-5 h-5 text-gray-400 absolute right-0 me-3" />
                  <input
                    name="mobile"
                    value={data.mobile}
                    onChange={handleChange}
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                    type="number"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* accessibility Information */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <IoAccessibility className="w-5 h-5" />
              <span>Accessibility</span>
            </h2>
            <div className="flex flex-col gap-5">
              <div className="">
                <label className="block text-sm font-medium text-gray-700">Roles</label>
                <CustomSelect
                  value={roles}
                  onChange={(newRoles) => setRoles(newRoles)}
                  isMulti 
                  focusColor={'#4cc4bb'} 
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'user', label: 'User' },
                  ]} />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(status) => setStatus(status)}
                  focusColor={'#4cc4bb'} 
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'blocked', label: 'Blocked' },
                  ]} />
              </div>
            </div>
          </div>

          {/* password */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

            <div className="flex flex-col gap-5">
              <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <PiPassword className="w-6 h-6" />
                <span>Password</span>
              </h2>
              <div className='flex flex-col'>
                <label className="flex text-sm font-medium">
                    <span>Password</span>
                    <span className="text-xl leading-none ms-1 text-red-500">*</span>
                  </label>
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
              <div className='flex flex-col'>
                <label className="flex text-sm font-medium">
                    <span>Confirm</span>
                    <span className="text-xl leading-none ms-1 text-red-500">*</span>
                  </label>
                <div className='flex items-center border border-neutral-300 focus-within:border-primary-300 
                  rounded-input-border transition-colors duration-300'>

                  <input type={`${confirmShowing ? 'text' : 'password'}`} className='border-0!'
                    name='confirm' value={data.confirm} onChange={handleChange} placeholder='Re-enter password' />

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
            
          </div>

          {/* Address */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs
            hidden-div hidden">
            <h2 className="text-md font-medium text-gray-900 flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <LuMapPin className="w-5 h-5" />
                <span className="leading-none">Address</span>
              </div>
            </h2>
            <div className="address-container flex flex-col gap-5">
              <div className="sm:col-span-2">
                <label className="flex text-sm font-medium">
                  <span>Street Address</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="address_line"
                  value={data.address_line}
                  onChange={handleChange}
                  type="text"
                  className="mt-1"
                  placeholder="Enter address line"
                />
              </div>
              <div>
                <label className="flex text-sm font-medium">
                  <span>City</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="city"
                  value={data.city}
                  onChange={handleChange}
                  type="text"
                  className="mt-1"
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <label className="flex text-sm font-medium">
                  <span>State</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="state"
                  value={data.state}
                  onChange={handleChange}
                  type="text"
                  className="mt-1"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="flex text-sm font-medium">
                  <span>ZIP/Postal Code</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input
                  name="pincode"
                  value={data.pincode}
                  onChange={handleChange}
                  type="text"
                  className="mt-1"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

        </form>

        {/* profile image */}
        <div className="h-fit space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
          <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
            <CgProfile className="w-5 h-5" />
            <span>Profile Image</span>
          </h2>
          
          <div className='flex flex-col items-center space-y-2 mb-5'>
          
            <div className='w-60 h-60 relative rounded-lg overflow-hidden'>
              <img src={imagePreview || place_holder} className='pointer-events-none w-full' alt="avatar" />
              <svg
                className="absolute inset-0 w-60 h-60 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <mask id="hole">
                    <rect width="100" height="100" fill="white" />
                    <circle cx="50" cy="50" r="47" fill="black" />
                  </mask>
                </defs>
                {imagePreview && 
                  <>
                    <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)" mask="url(#hole)" />
                    <circle cx="50" cy="50" r="47" fill="none" stroke="white" strokeWidth="1" />
                  </>
                }
              </svg>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className='w-60'
            >Change Image</button>

            <CropperModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              dimen={{width: 450, height:320}}
              title="Crop Image"
              subTitle="Crop images as per the required dimention"
              headerIcon={IoImage}
              onResult={handleImageSelect}
              cropper={{
                outputFormat: 'webp',
                validFormats: ['jpg','jpeg','png','bmp','webp'],
                outPutDimen: 300,
                thumbDimen: 200,
                containerClass: 'flex flex-col items-center w-full h-full',
                cropperClass: 'flex w-60 !h-60 border border-gray-300 rounded-3xl overflow-hidden',
                buttonsClass: 'flex flex-col space-y-2 -right-12 top-1/2 -translate-y-1/2'
              }}
            />
          </div>
        </div>
        
      </div>
    </section>
  );

};

export default EditUser;