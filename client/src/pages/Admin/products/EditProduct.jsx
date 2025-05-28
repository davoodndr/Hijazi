import { useEffect, useRef, useState } from "react";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import AxiosToast from "../../../utils/AxiosToast";
import toast from "react-hot-toast";
import { IoClose, IoImage } from "react-icons/io5";
import CustomSelect from "../../../components/ui/CustomSelect";
import { Axios } from "../../../utils/AxiosSetup";
import ApiBucket from "../../../services/ApiBucket";
import { useDispatch } from 'react-redux'
import { setLoading } from '../../../store/slices/CommonSlices'
import { TbArrowBackUp } from "react-icons/tb";
import { HiHome } from "react-icons/hi2";
import { uploadProductImages } from '../../../services/ApiActions'
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import ImageThumb from "../../../components/ui/ImageThumb";
import { capitalize, fetchImageAsFile, finalizeValues, imageFileToSrc, isValidDatas, isValidFile, isValidName } from "../../../utils/Utils";
import CropperModal from "../../../components/ui/CropperModal";
import DynamicInputList from "../../../components/ui/DynamicInputList";
import VariantsTable from "../../../components/admin/products/VariantsTable";
import { useCallback } from "react";

const EditProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { categories, brands, currentProduct } = state || {};
  const [status, setStatus] = useState(null);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);
  const [finalAttributes, setFinalAttributes] = useState([]);
  const [variants, setVariants] = useState([])
  
  /* image handling */
  const [viewImages, setViewImages] = useState([])
  const [variantImages, setVariantImages] = useState([])
  const [disableMessage, setDisableMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const maxLimit =  5;
  const productImageDimen = {width:1200, height: 1200}
  const productThumbDimen = {width:450, height: 450}

  /* input handling */
  const [data, setData] = useState({
    name: "", slug:"", sku:'', description:"", price:"", stock:"", visible: true, status: "active",
    brand:"", category:"", featured:false, width:0, height: 0, weight:0, files: [], customAttributes: []
  })

  /* initial data from item */
  useEffect(() => {
    
    if(currentProduct){
      /* setting general datas */
      setData(prev => ({
        ...prev,
        name: currentProduct?.name,
        sku: currentProduct?.sku,
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
      handleChangeCategory({
        id:currentProduct.category._id,
        label:currentProduct.category.name,
      })
      setBrand({id:currentProduct?.brand?._id, label:currentProduct?.brand?.name})
      setStatus({value: currentProduct?.status, label:currentProduct?.status})
      setViewImages(currentProduct?.images?.map(img => {
          return {id:img.public_id, value: img.thumb}
        })
      )
      if(currentProduct?.customAttributes.length){
        setCustomAttributes(currentProduct.customAttributes)
        setFinalAttributes(prev => [...prev, ...currentProduct.customAttributes])
      }
      if(currentProduct.variants.length){
        setVariants(currentProduct.variants.map(variant => {
          return {
            ...variant,
            id: variant._id,
            files: variant.image,
            preview: variant.image?.thumb || null
          }
        }))
        setVariantImages(currentProduct.variants.map(variant => variant.image?.public_id ).filter(Boolean))
      }
    }

  },[])

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

    /* handles category change */
  const handleChangeCategory = (val) => {
    setCategory(val);
    setVariants([])
    setVariantImages([])
    setData(prev => ({...prev, category: val.id}))
    const cat = categories.find(item => item._id === val.id);
    setAttributes([...cat?.parentId?.attributes,...cat?.attributes].filter(Boolean));
    setFinalAttributes([...cat?.parentId?.attributes,...cat?.attributes,...customAttributes].filter(Boolean));

  }

  /* handle crop image */
  const handleCropImage = async(files) => {
    
    if(files){

      setData(prev => ({
        ...prev, 
        files:[...prev.files, files]
      }));

      /* for dispalying images on thumbs */
      try {
        const src = await imageFileToSrc(files.thumb);
        
        setViewImages(prev => [...prev,  {id: files.thumb.id, value: src}]);
        
      } catch (err) {
        console.error('Error reading file:', err);
      }

    }
    setIsModalOpen(false)
  }

  /* handle delete thumb */
  const handleThumbDelete = (id, isVariant) => {
    if(isVariant){
      setVariantImages(prev => prev.filter(item => item !== id))
      setVariants(prev => prev.map(item => {
        if(item.id !== id) return item;
        return {
          ...item,
          files: null,
          image: null,
          preview: null
        }
      }))
    }else{
      setViewImages(prev => prev.filter(item => item.id !== id))
      setData(prev => ({
        ...prev,
        files: prev.files.filter(item => item.file.id !== id),
      }))
    }
  }

  /* handle custom attributes */
  const handleCustomAttributes = useCallback((result) => {
    const newAttributes = result?.map(item => {
      return {
        id: item.id,
        name: item.data.name,
        values: item.data.value.replaceAll(' ','').split(',').filter(boolean)
      }
    })
    setData({...data, customAttributes: newAttributes})
  },[customAttributes, data]);

  /* handling delete custom attribute */
  const handleDeleteCustomAttribute = (id) => {

    const remaining = data?.customAttributes.filter(attr => attr.id !== id)
    setData(prev => ({...prev,  customAttributes:  remaining}))
    setCustomAttributes(remaining)
    setFinalAttributes([...attributes, ...remaining])

    //setup for remove the attribute from variant
    /* custom attr will be stored in variants attributes 
    through final attributes */
    const removedVariatns = variants.map(variant => {
      
      return {
        ...variant,
        attributes: [...attributes, ...remaining].reduce((acc, attr) => {
          acc[attr.name] = '';
          return acc
        },{})
      }
    })

    setVariants(removedVariatns)
  }

  /* handle apply custom attributes */
  const handleApplyAttributes = () => {
                  
    const allAttrs = [...attributes, ...data?.customAttributes];
    setCustomAttributes(data?.customAttributes)
    setFinalAttributes(allAttrs)

    // reset the variant attributes with new
    setVariants(prev => prev.map(variant => {
      return {
        ...variant,
        attributes: allAttrs.reduce((acc, attr) => {
                      acc[attr.name] = '';
                      return acc;
                    }, {})
      }
    }))
    
  }

  /* handle actions on variants */
  const handleVariantActions = (data) => {
    const { type, list, isAttr, rowIndex, field, value  } = data;

    switch(type){

      case 'insert': 
        setVariants(prev => ([...prev, value]));
        break;
      case 'update': 
        setVariants(prev => {
          const updated = [...prev];
          if (isAttr) {
            updated[rowIndex].attributes[field] = value;
          } else {
            updated[rowIndex][field] = value;
            if(field === 'preview'){
              setVariantImages(prev => [...prev, updated[rowIndex].id])
            }
          }
          return updated;
        })
        break;
      case 'delete': 
        setVariants(prev => prev.filter(item => !list?.includes(item.id)))
        setVariantImages(prev => prev.filter(item => !list?.includes(item)))
        break;

      default: null
    }
    
  }

  function validateProduct(product) {

    if (!product.name?.trim()) throw("Name is required");
    if (!product.slug?.trim()) throw("Slug is required"); 
    if (!product.category?.trim()) throw("Category is required"); 
    if (!product.brand?.trim()) throw("Brand is required");
    if (!product.description?.trim()) throw("Description is required");
    if (!product.files?.length && !viewImages.length) throw("At least one image is required")

    const isUsingVariants = product.variants?.length > 0;

    if (!isUsingVariants) {
      if (!product.sku?.trim()) throw("SKU is required") 
      if (!product.price || product.price <= 0) throw("Valid price required") 
      if (!product.stock || product.stock == null || product.stock < 0) throw("Stock must be 0 or more") 
    } else {
      product.variants.map((variant, index) => {
        if (!variant.sku?.trim()) throw("Variant SKU is required") 
        if (!variant.price || variant.price <= 0) throw("Variant Price must be greater than 0") 
        if (!variant.stock || variant.stock < 0) throw("Variant Stock is required") 
        if (!variant.attributes || Object.values(variant.attributes).some(v => !v))
          throw("All attributes must be filled") 
      });

    }

  }

  function validateVariants(product){
    const attributes = product.variants.map(item => {
      return {
        ...item.attributes,
        sku: item.sku
      }
    });

    const set = new Set();
    for(let attr of attributes) {
      
      const flatted = Object.entries(attr).filter(([key, val]) => key !== 'sku').flat().join('').trim();
      if(set.has(attr.sku)){
        console.log(attr, flatted)
        throw("Duplicate sku not allowed in variant")
      }
      if(set.has(flatted)){
        console.log(attr, flatted)
        throw("Duplicate variant not allowed")
      }
      set.add(attr.sku)
      set.add(flatted)
      
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

      let product = {
        ...data,
        variants
      }


      if(!isValidName(product['name']) || !isValidName(product['slug'])){
        toast.error('Name and slug should have minimum 3 letters')
        return
      }

      let remove_ids = []
      const initialImageList = currentProduct?.images?.map(el => el?.public_id);
      const updatedImageList = viewImages?.map(img => img?.id);      
      
      if(product['files'].length){

        const invalidFile = product.files.find(item => !isValidFile(item.file));

        if(invalidFile){
          toast.error('Some of your image files are invalid');
          return;
        }

        const maintainedList = initialImageList.filter(img => updatedImageList.includes(img));

        if(product['files'].length + maintainedList.length > maxLimit){
          toast.error(`Maximum ${maxLimit} files allowed to upload`);
          return
        }

        // place temp items to arrange the files to get missing index
        const indexList = maintainedList?.map(el => {
          return {
            index: Number(el.split('_').filter(Boolean).pop()) - 1,
            value: el
          }
        })
        if(maintainedList.length){
          let list = new Array(maintainedList.length + product.files.length).fill(null);
          
          indexList.forEach(({index, value}) => {
            list[index] = value
          })

          let fileIndex = 0;
          for(let i = 0; i < list.length; i++){
            if(list[i] === null && fileIndex < list.length){
              list[i] = product.files[fileIndex++];
            }
          }
          
          product.files = list;
            
        };

      }

      //deleted images hadnling
      if(updatedImageList.length < initialImageList.length){
        remove_ids = [...remove_ids, ...initialImageList.filter(el => !updatedImageList.includes(el))]
      }

      //variant image delete handling
      const initialVariantImages = currentProduct?.variants.map(el => el?.image?.public_id).filter(Boolean);
      const updatedVariantImages = product.variants.map(el => el?.image?.public_id).filter(Boolean);
      if(updatedVariantImages.length < initialVariantImages.length){
        remove_ids = [...remove_ids, ...initialVariantImages.filter(el => !updatedVariantImages.includes(el))];
      }

      // if the variant sku is changed the image url & public_id should be changed
      // this code is to find chages and download file to reupload
      const oldVariants = currentProduct.variants;
      const modifiedVariants = oldVariants.map(variant => {
        const modified = product.variants.find(el => el.id === variant._id && el.sku !== variant.sku)
        // checking is sku differ old & not changed the image file
        if(modified && modified.image && !modified?.files?.file){
          remove_ids.push(modified.image.public_id)
          return {id: modified.id, image: modified.image}
        }
      }).filter(Boolean)

      dispatch(setLoading(true));

      try {

        const downloads = await Promise.all(
          modifiedVariants.map(async item => {
            const file = await fetchImageAsFile(item.image.url, `${item.id}`);
            const thumb = await fetchImageAsFile(item.image.thumb, `${item.id}`);

            return {file, thumb}
          })
        )

        // update variants with downloaded images
        if(downloads.length){
          product.variants = product.variants.map(variant => {
            const modified = downloads.find(img => img.file.name === variant.id);
            if(modified){
              return {
                ...variant,
                files: modified
              }
            }
            return variant;
          })
        }
        
        validateProduct(product)
        validateVariants(product)

        product.variants = product?.variants.map(variant => {
          return {
            ...variant,
            preview: null
          }
        })

        const response = await Axios({
          ...ApiBucket.updateProduct,
          data: {
            ...product,
            product_id: currentProduct._id
          }
        })

        if(response?.data?.success){
          await uploadProductImages(product, currentProduct._id, remove_ids);

          AxiosToast(response, false);
          setData({
            name: "", slug:"", sku:"", description:"", price:"", stock:"", visible: true, status: "active",
            brand:"", category:"", featured:false, width:0, height: 0, weight:0, files: [], customAttributes: []
          })
          setBrand(null);
          setStatus(null);
          setCategory(null);
          setVariants([]);
          setAttributes([]);
          setCustomAttributes([])
          setFinalAttributes([])
          setViewImages([]);
          setVariantImages([])
          setDisableMessage('');
          navigate('/admin/products')
        }
        
      } catch (error) {

        console.log(error?.response?.data || error)
        AxiosToast(error)

      }finally{
        dispatch(setLoading(false))
      }

  };

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
                  value={data?.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label  className="mandatory">SKU / Product Code</label>
                <input
                  name="sku"
                  value={data?.sku ?? ""}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter product code"
                />
              </div>
              <div>
                <label  className="mandatory">Slug</label>
                <input
                  name="slug"
                  value={data?.slug}
                  onChange={handleChange}
                  type="text"
                  placeholder="@eg: product-name"
                  className="lowercase"
                />
              </div>
              <div>
                <label  className="mandatory">Price</label>
                <input
                  name="price"
                  value={data?.price ?? ""}
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
                  value={data?.stock ?? ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter product stock"
                />
              </div>
              <div className="col-span-2">
                <label  className="mandatory">Description</label>
                <textarea
                  name="description"
                  value={data?.description ?? ""}
                  onChange={handleChange}
                  rows='5'
                  placeholder="Enter product stock"
                  className="!h-auto !p-2"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Organaization Information */}
          <div className="h-full space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2">Organization</h2>

            {/* category, brand, status */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="mandatory">Category</label>
                <CustomSelect
                  value={category}
                  onChange={handleChangeCategory}
                  options={
                    categories?.filter(cat => cat.parentId !== null).map(item => ({id: item._id, label: item.name})) || []
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

        {/* product images & custom attributes */}
        <div className="grid grid-cols-[2fr_1fr] gap-2">

          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-xs">
            <h2 className="text-md font-medium text-gray-900 flex items-center gap-2 pb-4">Images</h2>

            <div className="flex flex-col">
              <div className="grid grid-cols-4 justify-items-center gap-4">
              
                {viewImages.length > 0 && viewImages.map(img => 
                  <ImageThumb
                    key={img.id} 
                    src={img.value}
                    thumbClass='relative w-fit'
                    imgClass='rounded-xl border border-gray-300 w-30 h-30 overflow-hidden'
                    Actions={() => {
                      return(
                        <div 
                          onClick={() => {handleThumbDelete(img.id, false)}}
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
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                  imgClass='rounded-xl border border-gray-300 w-30 h-30 overflow-hidden'
                  />

              </div>

              {variantImages.length > 0 && 
              
                <>
                  <span className="mt-10 ps-4 relative before:content-[''] before:bg-sky-400 before:p-1
                      before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:rounded-full"
                      >Variant Images</span>
                  <div className="grid grid-cols-4 justify-items-center gap-4 mt-4">
                    {variants?.map(variant => {
                      if(variant.preview){
                        return (
                          <ImageThumb
                            key={variant.id || variant._id} 
                            src={variant?.preview}
                            thumbClass='relative w-fit'
                            imgClass='rounded-xl border border-gray-300 w-30 h-37 overflow-hidden'
                            Actions={() => {
                              return(
                                <>
                                  <div 
                                    onClick={() => {handleThumbDelete(variant.id, true)}}
                                    className="absolute -top-2 -right-2 inline-flex items-center text-white bg-red-500
                                    p-0.5 rounded-full border border-white shadow-md/40 cursor-pointer transition-all duration-300
                                    hover:bg-red-600 hover:scale-110">
                                    <IoClose size={15} />
                                  </div>
                                  <div className="border-t border-gray-300 flex gap-2 items-center 
                                    justify-center h-7 w-full absolute bottom-0 rounded-b-xl">
                                    {Object.keys(variant?.attributes).slice(0,2).map((key,index) => 
                                      <span key={index} className={`capitalize text-xs relative`}>
                                        {variant?.attributes[key]}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )
                            }}
                          />
                        )
                      }
                    })}
                  </div>
                </>

              }

            </div>

            <CropperModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              dimen={{width: 450}}
              title="Crop Image"
              subTitle="Crop images as per the required dimention"
              headerIcon={IoImage}
              onResult={handleCropImage}
              cropper={{
                outputFormat: 'webp',
                validFormats: ['jpg','jpeg','png','bmp','webp'],
                outPutDimen: productImageDimen,
                thumbDimen: productThumbDimen,
                disableMessage
              }}
            />

          </div>

          {/* custom attributes */}
          <div 
            className="h-full w-auto space-y-6 border border-gray-200 bg-white p-6 rounded-lg shadow-xs
            flex flex-col justify-between">

            <div className="">
              <h2 className="mb-2 text-md font-medium text-gray-900 flex items-center gap-2">Use Custom Attributes</h2>

              <DynamicInputList
                value={customAttributes}
                onChange={handleCustomAttributes}
                onRemove={handleDeleteCustomAttribute}
                containerClass='flex flex-col gap-2 max-h-[250px] overflow-y-auto scroll-basic'
                inputContainerClass='relative'
                removeBtnClass='!p-2 absolute top-0.5 right-0.5'
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleApplyAttributes}
                type="button"
                className="!px-4 !py-2"
              >Apply</button>
            </div>

          </div>

        </div>

        {/* variants */}
        {finalAttributes?.length > 0 && 
          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-xs">

            <VariantsTable
              attributes={finalAttributes}
              variants={variants}
              setVariants={handleVariantActions}
              outPutDimen={productImageDimen}
            />

          </div>
        }

      </div>

    </section>

  );
};

export default EditProduct;
