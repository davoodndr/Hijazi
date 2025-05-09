import { useEffect, useRef, useState } from "react";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import AxiosToast from "../../../utils/AxiosToast";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import CustomSelect from "../../../components/ui/CustomSelect";
import { Axios } from "../../../utils/AxiosSetup";
import ApiBucket from "../../../services/ApiBucket";
import { useDispatch } from 'react-redux'
import { setLoading } from '../../../store/slices/CommonSlices'
import { TbArrowBackUp } from "react-icons/tb";
import { HiHome } from "react-icons/hi2";
import { uploadProductImages } from '../../../services/ApiActions'
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import CropperWindow from "../../../components/ui/CropperWindow";
import ImageThumb from "../../../components/ui/ImageThumb";
import { capitalize, finalizeValues, imageFileToSrc, isValidDatas, isValidFile, isValidName } from "../../../utils/Utils";

const EditProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { categories, brands, currentProduct } = state || {};
  const [status, setStatus] = useState(null);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  
  /* image handling */
  const resetRef = useRef(null);
  const [viewImages, setViewImages] = useState([])
  const [disableMessage, setDisableMessage] = useState("");
  const maxLimit =  5;
  const productImageDimen = {width:1024, height: 1024}

  /* input handling */
  const [data, setData] = useState({
    name: "", slug:"", description:"", price:"", stock:"", visible: true, status: "active",
    brand:"", category:"", featured:false, width:0, height: 0, weight:0, files: []
  })

  /* initial data from item */
  useEffect(() => {
    
    if(currentProduct){
      /* setting general datas */
      setData(prev => ({
        ...prev,
        name: currentProduct?.name,
        slug: currentProduct?.slug,
        price: currentProduct?.price,
        stock: currentProduct?.stock,
        description: currentProduct?.description,
        category: currentProduct?.category?._id,
        brand: currentProduct?.brand?._id,
        status: currentProduct?.status,
        featured: currentProduct?.featured,
        visible: currentProduct?.visible
      }));
      /* setting dropdown items */
      setCategory({id:currentProduct?.category?._id, label:currentProduct?.category?.name})
      setBrand({id:currentProduct?.brand?._id, label:currentProduct?.brand?.name})
      setStatus({value: currentProduct?.status, label:currentProduct?.status})
      setViewImages(currentProduct?.images.map(img => {
          const id = img.split('/').filter(Boolean).pop().split('.')[0];
          return {id, value: img}
        })
      )
    }

  },[currentProduct])

  /* limits image on maximum */
  useEffect(() => {
    if(data.files.length >= maxLimit || viewImages.length >= maxLimit){
      setDisableMessage('Maximum image limit reached')
    }else{
      setDisableMessage(null)
    }
  },[data.files, viewImages])

  const handleChange = (e) => {
    let { name, value} = e.target;
    if(name === 'name') setData(prev => ({...prev, slug:value.replace(/\s+/g, '-')}))
    if(name === 'slug') value = value.replace(/\s+/g, '-');

    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(isValidDatas(['name','slug','price','stock','description','category','brand'],data)){

      if(!isValidName(data['name']) || !isValidName(data['slug'])){
        toast.error('Name and slug should have minimum 3 letters')
        return
      }

      const initialList = currentProduct.images;
      const updatedImageList = viewImages.map(img => img.id);
      
      if(data['files'].length){

        const maintainedList = initialList.filter(img => {
          const id = img.split('/').filter(Boolean).pop().split('.')[0];
          if(updatedImageList.includes(id)) return id;
        }).filter(item => Boolean(item));

        console.log(maintainedList.length, data['files'].length)
        
        if(data['files'].length + maintainedList.length > maxLimit){
          toast.error(`Maximum ${maxLimit} files allowed to upload`);
          return
        }

        const invalidFile = data.files.find(imgFile => !isValidFile(imgFile));

        if(invalidFile){
          toast.error('Some of your image files are invalid');
          return;
        }
      }

      dispatch(setLoading(true));
      
      try {

        /* dimension is checked on image select */
        
        const finalData = finalizeValues(data);
        
        const response = await Axios({
          ...ApiBucket.updateProduct,
          data: {
            ...finalData,
            product_id: currentProduct._id
          }
        })

        if(response.data.success){

          if(finalData.files.length){
            
            const files = finalData.files;
            const public_ids = initialList.map(img => {
              const id = img.split('/').filter(Boolean).pop().split('.')[0];
              if(!updatedImageList.includes(id)) return id;
            }).filter(item => Boolean(item));

            const product = response.data.product;
            const folder = `products/${product.slug.replaceAll('-','_')}`;
            
            await uploadProductImages(product._id, folder, files, public_ids);
          }

          AxiosToast(response, false);
          setData({
            name: "", slug:"", description:"", price:"", stock:"", visible: true, status: "active",
            brand:"", category:"", featured:false, width:0, height: 0, weight:0, files: []
          })
          setBrand(null);
          setStatus(null);
          setCategory(null);
          setViewImages([]);
          setDisableMessage('');
          if(resetRef.current) resetRef.current.reset();
          navigate('/admin/products')
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

  /* handling add thumb action */
  const handleAddThumb = () => {
    
    if(resetRef.current){
      resetRef.current.reset();
    }
    if(data.files.length >= maxLimit){
      toast.error('Maximum image limit reached');
    }
  }

  /* handle crop image */
  const handleCropImage = async(file) => {
    
    if(file){

      setData(prev => ({...prev, files:[...prev.files,file]}));

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
    setData(prev => ({...prev, files: prev.files.filter(item => item.id !== id)}))
    if(resetRef.current){
      resetRef.current.reset();
    }
  }

  return (

    <section className='flex flex-col p-6 bg-gray-100'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Edit Product</h3>
          <span className='sub-title'>Change product details bellow</span>
        </div>
        <div className="inline-flex items-stretch gap-5">
          <button
            onClick={() => navigate('/admin/products')} 
            className='!ps-2 !pe-4 !bg-white border border-gray-300 !text-gray-400 
              inline-flex items-center gap-2 hover:!text-primary-400 hover:!border-primary-300'>
            <TbArrowBackUp size={25} />
            <span>Back</span>
          </button>
          <button 
            form="add-product-form"
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
          <span>Products</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Edit Product</span>
        </div>
      </div>


      <div className="flex flex-col space-y-2">
        
        {/* form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-[2fr_1fr] gap-2" id="add-product-form">
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
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g,''))}
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
              <div>
                <label className="mandatory">Category</label>
                <CustomSelect
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setData(prev => ({...prev, category: val.id}))
                  }}
                  options={
                    categories?.map(item => ({id: item._id, label: item.name})) || []
                  } />
              </div>
              <div>
                <label className="mandatory">Brand</label>
                <CustomSelect
                  value={brand}
                  onChange={(val) => {
                    setBrand(val);
                    setData(prev => ({...prev, brand: val.id}))
                  }}
                  options={
                    brands?.map(item => ({id: item._id, label: item.name})) || []
                  } />
              </div>
              <div>
                <label className="mandatory">Status</label>
                <CustomSelect
                  value={status || { value: 'active', label: 'Active' }}
                  onChange={(val) => {
                    setStatus(val);
                    setData(prev => ({...prev, status: val.value}))
                  }}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
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
                  value={data.visible}
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
            
            <div className="flex justify-between space-x-auto">
              
              <div className="flex w-65 p-4 max-h-95 overflow-y-auto scroll-basic">
                <div className="grid grid-cols-2 gap-5 h-fit">

                  {viewImages.length > 0 && viewImages.map(img => 
                    <ImageThumb
                      key={img.id} 
                      src={img.value}
                      thumbClass='relative w-fit'
                      imgClass='rounded-xl border border-gray-300 w-25 h-25 overflow-hidden'
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
              </div>
              

              <CropperWindow
                ref={resetRef}
                onImageCrop={handleCropImage}
                validFormats={['jpg','jpeg','png','bmp','webp']}
                outputFormat='webp'
                outPutDimen={productImageDimen}
                disableMessage={disableMessage}
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

export default EditProduct;
