import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { LuBriefcase, LuCalendar, LuEye, LuEyeClosed, LuMail, LuMapPin, LuPhone, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import place_holder from '../../../assets/user_placeholder.jpg'
import { MdOutlineImageSearch } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import AxiosToast from "../../../utils/AxiosToast";
import toast from "react-hot-toast";
import { IoAccessibility } from "react-icons/io5";
import Select from 'react-select'
import CustomSelect from "../../../components/ui/CustomSelect";

const AddUser = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordShowing, setPasswordShowing] = useState(false);
  const [confirmShowing, setConfirmShowing] = useState(false);

  /* input handling */
  const [data, setData] = useState({
    username: "", fullname:"", email:"", mobile:"",
    address_line:"", city:"", state:"", pincode:"",
    passoword:"", confirm:""
  })

  const handleChange = (e) => {
    const { name, value} = e.target;
    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const mandatories = ['username', 'email', 'password', 'confirm'];
  const validateValues = mandatories.every(field => data[field]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(validateValues){

      setLoading(true);

      try {
        console.log("OK")
      } catch (error) {
        AxiosToast(error)
      }

      return

    }else{
      toast.error("Please fill all mandatories")
    }

  };

  return (
    <section className='h-full flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Create New User</h3>
          <span className='sub-title'>Enter user details below</span>
        </div>
        <button 
          form="add-user-form"
          type="submit"
          className='ps-2! pe-4! inline-flex items-center gap-2 text-white'>
          <IoIosAdd size={25} />
          <span>Add Now</span>
        </button>
      </div>

      {/* form */}
      <div className="w-full text-sm text-gray-700 rounded-md overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr] gap-5">
          <form onSubmit={handleSubmit} className="columns-2 gap-5 space-y-5 " id="add-user-form">
            {/* Personal Information */}
            <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">
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
            <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">
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
                      type="tel"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* accessibility Information */}
            <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">
              <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <IoAccessibility className="w-5 h-5" />
                <span>Accessibility</span>
              </h2>
              <div className="flex flex-col gap-5">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">Roles</label>
                  <CustomSelect
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
            <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">

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
            <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">
              <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <LuMapPin className="w-5 h-5" />
                <span>Address</span>
              </h2>
              <div className="flex flex-col gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
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
                  <label className="block text-sm font-medium text-gray-700">City</label>
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
                  <label className="block text-sm font-medium text-gray-700">State</label>
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
                  <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
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
          <div className="h-fit space-y-6 border border-gray-200 bg-white p-6 rounded-3xl shadow-md">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <CgProfile className="w-5 h-5" />
              <span>Profile Image</span>
            </h2>
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <img src={place_holder} className="w-40 rounded-full" alt="prifle" />
                <label htmlFor="profile-input"
                  className="border border-gray-300 p-2 rounded-2xl cursor-pointer transition-all duration-300
                    hover:bg-primary-50 hover:border-primary-300 text-[16px]! bg-white absolute bottom-0 right-3
                    shadow-lg"
                >
                  <MdOutlineImageSearch size={25} />
                </label>
              </div>
              <span className="border border-gray-300 w-full text-center text-xs py-1 rounded-full">Image</span>
              <input type="file" id="profile-input" hidden/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddUser;