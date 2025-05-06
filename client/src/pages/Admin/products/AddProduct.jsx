import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { LuEye, LuEyeClosed, LuMail, LuMapPin, LuPhone, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import place_holder from '../../../assets/user_placeholder.jpg'
import { MdOutlineImageSearch } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import AxiosToast from "../../../utils/AxiosToast";
import toast from "react-hot-toast";
import { IoAccessibility, IoClose, IoTrash } from "react-icons/io5";
import CustomSelect from "../../../components/ui/CustomSelect";
import { Axios } from "../../../utils/AxiosSetup";
import ApiBucket from "../../../services/ApiBucket";
import { useDispatch } from 'react-redux'
import { setLoading } from '../../../store/slices/CommonSlices'
import { TbArrowBackUp } from "react-icons/tb";
import { HiHome } from "react-icons/hi2";
import { uploadAvatar } from '../../../services/ApiActions'
import ListBox from "../../../components/ui/ListBox";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import ComboBox from "../../../components/ui/ComboBox";
import CropperWindow from "../../../components/ui/CropperWindow";
import ImageThumb from "../../../components/ui/ImageThumb";
import { imageFileToSrc } from "../../../utils/Utils";

const AddProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('');
  const [passwordShowing, setPasswordShowing] = useState(false);
  const [confirmShowing, setConfirmShowing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [address, setAddress] = useState([]);

  /* input handling */
  const [data, setData] = useState({
    name: "", slug:"", description:"", price:"", stock:"", visible: false, status: "",
    brand:"", category:"", featured:false, width:0, height: 0, weight:0, files: []
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

  // image change handling
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if(file){

      setData(prev => ({...prev, file}));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }

      reader.readAsDataURL(file)
    }
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

  const handleSubmit = async(e) => {
    e.preventDefault();

    let mandatories = ['username', 'email', 'password', 'confirm'];
    // adding address field for validation
    if(address.length) mandatories = mandatories.concat(address);
    const validateValues = mandatories.every(field => data[field]);
    if(validateValues){

      if(data.password !== data.confirm){
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
          ...ApiBucket.addUser,
          data: finalData
        })

        if(response.data.success){

          const file = finalData.file;
          let newAvatar = "";

          if(file){
            newAvatar =  await uploadAvatar(response.data.user._id,file);
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
        }
        
      } catch (error) {
        console.log(error.response.data)
        AxiosToast(error)
      }finally{
        dispatch(setLoading(false))
      }

      return

    }else{
      toast.error("Please fill all mandatories")
    }

  };

  /* image handling */
  let imgs = [
    { id: 'cat', value: 'https://i.imgur.com/CzXTtJV.jpg' },
    { id: 'dog', value: 'https://i.imgur.com/OB0y6MR.jpg' },
    { id: 'cheetah', value: 'https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg' },
    { id: 'bird', value: 'https://farm4.staticflickr.com/3075/3168662394_7d7103de7d_z_d.jpg' },
    { id: 'whale', value: 'https://farm9.staticflickr.com/8505/8441256181_4e98d8bff5_z_d.jpg' },
    { id: 'bridge', value: 'https://i.imgur.com/OnwEDW3.jpg' }
  ]
  const productImageDimen = {width:1024, height: 1024}
  const resetRef = useRef(null);
  const [viewImages, setViewImages] = useState([])
  const [finalImages, setFinalImages] = useState([])

  /* handling add thumb action */
  const handleAddThumb = () => {
    
    if(resetRef.current){
      resetRef.current.reset();
    }
    if(finalImages.length >= 5){
      toast.error('Maximum limit reached');
    }
  }

  /* handle crop image */
  const handleCropImage = async(file) => {
    
    if(file){

      setFinalImages(prev => [...prev, file]);

      /* for dispalying images on thumbs */
      try {
        const src = await imageFileToSrc(file);
        
        setViewImages(prev => [...prev,  {id: file.id, value: src}]);
        
      } catch (err) {
        console.error('Error reading file:', err);
      }

    }
  }

  /* handle delete thumb */
  const handleThumbDelete = (id) => {
    setViewImages(prev => prev.filter(item => item.id !== id))
    setFinalImages(prev => prev.filter(item => item.id !== id))
    if(resetRef.current){
      resetRef.current.reset();
    }
  }

  return (

    <section className='flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Create New Product</h3>
          <span className='sub-title'>Enter product details below</span>
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
            onClick={() => navigate('/admin/products')} 
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
            <span>Create Now</span>
          </button>
        </div>
        
      </div>

      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2 text-gray-400'>
          <span>Products</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Add Product</span>
        </div>
      </div>


      <div className="flex flex-col space-y-2">
        
        {/* form */}
        <form onSubmit={handleSubmit}  className="grid grid-cols-[2fr_1fr] gap-2">
          {/* basic Information */}
          <div className="break-inside-avoid space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">
              Basic
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div>
                <label className="mandatory">Product name</label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label  className="mandatory">Slug</label>
                <input
                  name="slug"
                  value={data.slug}
                  onChange={handleChange}
                  type="text"
                  placeholder="@eg: product-name"
                />
              </div>
              <div>
                <label  className="mandatory">Price</label>
                <input
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter product price"
                />
              </div>
              <div>
                <label  className="mandatory">Stock</label>
                <input
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter product stock"
                />
              </div>
              <div className="col-span-2">
                <label  className="mandatory">Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  rows='5'
                  placeholder="Enter product stock"
                  className="!h-auto !p-2"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Organaization Information */}
          <div className="h-fit space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">Organization</h2>

            {/* category, brand, status */}
            <div className="flex flex-col gap-3">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <ComboBox
                  value={data.category}
                  placeholder="Browse category"
                  onChange={(category) => setStatus(category)}
                  items={[
                    { id: 1, label: 'category1' },
                    { id: 2, label: 'category2' },
                  ]} />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <ComboBox
                  value={data.brand}
                  onChange={(brand) => setStatus(brand)}
                  placeholder="Browse brand"
                  items={[
                    { id: 1, label: 'Active' },
                    { id: 2, label: 'Inactive' },
                    { id: 3, label: 'Blocked' },
                  ]} />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <ComboBox
                  value={data.status}
                  onChange={(status) => setStatus(status)}
                  placeholder="Browse brand"
                  items={[
                    { id: 1, label: 'Active' },
                    { id: 2, label: 'Inactive' },
                    { id: 3, label: 'Blocked' },
                  ]} />
              </div>
            </div>

            {/* features and visible */}
            <div className='flex items-center gap-8 w-full py-2 mt-2'>
              <div className="inline-flex gap-2 items-center">
                <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Featured</label>
                <ToggleSwitch
                  onChange={(value) => setData(prev => ({...prev,featured:value}))}
                  />
              </div>
              <div className="inline-flex gap-2 items-center">
                <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Visible</label>
                <ToggleSwitch
                  onChange={(value) => setData(prev => ({...prev,visible:value}))}
                  />
              </div>
            </div>

          </div>
        </form>

        {/* product images */}
        <div className="grid grid-cols-[2fr_1fr] gap-2">

          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2 pb-4">Images</h2>
            
            <div className="flex space-x-30">
              
              <div className="grid grid-cols-2 gap-5 h-fit">

                {viewImages.length > 0 && viewImages.map(img => 
                  <ImageThumb
                    key={img.id} 
                    src={img.value}
                    thumbClass='relative w-fit'
                    imgClass='rounded-xl border w-25 h-25 overflow-hidden'
                    Actions={() => {
                      return(
                        <div 
                          onClick={() => {handleThumbDelete(img.id)}}
                          className="absolute -top-2 -right-2 inline-flex items-center text-white bg-red-500
                          p-0.5 rounded-full border border-white shadow-md/40 cursor-pointer transition-all duration-300
                          hover:bg-red-600 hover:scale-110">
                          <IoClose size={15} />
                        </div>
                      )
                    }}
                  />
                )}

                <ImageThumb
                  onClick={handleAddThumb}
                  imgClass='rounded-xl border border-gray-300 w-25 h-25 overflow-hidden'
                  />

              </div>

              <CropperWindow
                ref={resetRef}
                onImageCrop={handleCropImage}
                outputFormat='webp'
                outPutDimen={productImageDimen}
                cropperClass="flex w-81 h-81 rounded-3xl overflow-hidden border border-gray-300"
                buttonsClass="flex justify-center gap-2 py-4"
              />

            </div>

          </div>

        </div>
      </div>

    </section>

  );
};

export default AddProduct;
