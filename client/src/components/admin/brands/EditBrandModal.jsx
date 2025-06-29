
import { AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb';
import ListBox from '../../ui/ListBox';
import Switch from '../../ui/ToggleSwitch';
import CropperWindow from '../../ui/CropperWindow';
import toast from 'react-hot-toast'
import { finalizeValues, getImageDimensions, isValidDatas, isValidFile, isValidName } from '../../../utils/Utils';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { ClipLoader } from 'react-spinners'
import LoadingButton from '../../ui/LoadingButton';
import { uploadBrandLogo } from '../../../services/ApiActions';

function EditBrandModal({list, brand, isOpen, onUpdate, onClose}) {

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const brandImageDimen = {width: 500, height: 195};
    

  /* data input handling */
  const [data, setData] = useState({
    file: "", name:"", slug:"", status:"", featured:false, visible:false
  });

  /* initial loading */
  useEffect(() => {
    
    if(brand){
      setData({...brand, file: brand?.logo});
      setStatus(brand?.status)
    }
    
  },[brand])

  const handleChange = (e) => {
    
    let { name, value } = e.target;
    if(name === 'name') setData(prev => ({...prev, slug:value.replace(/\s+/g, '-')}))
    if(name === 'slug') value = value.replace(/\s+/g, '-');
    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleStatusChange = (val) => {
    setStatus(val);
    setData(prev => ({...prev,status:val.label.toLowerCase()}))
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(isValidDatas(['name','slug','file'], data)){
      
      if(!isValidName(data['name']) || !isValidName(data['slug'])){
        toast.error('Name and slug should have minimum 3 letters')
        return
      }

      if(!data['file']){
        toast.error("Image is mandatory to create brand");
        return
      }

      setIsLoading(true)

      try {

        // here check dimen only if file changed
        if(isValidFile(data['file'])){
          const dimen = await getImageDimensions(data['file']);
      
          if(dimen.width !== brandImageDimen.width || dimen.height !== brandImageDimen.height){
            toast.error("Image dimention does not match");
            return
          }
        }

        const finalData = finalizeValues(data);
        
        const response = await Axios({
          ...ApiBucket.updateBrand,
          data: {
            ...finalData,
            brand_id: brand?._id
          }
        })

        if(response.data.success){

          const updatedBrand = response.data.brand;
          const public_id = updatedBrand.logo.split('/').filter(Boolean).pop().split('.')[0]

          if(isValidFile(finalData.file)){

            const logo = await uploadBrandLogo(updatedBrand._id, 'brands', finalData.file, public_id);
            updatedBrand.logo = logo;
            
          }

          AxiosToast(response, false);
          setData({
            file: "", name:"", slug:"", status:"", featured:false, visible:false
          })
          setStatus(null);

          onUpdate(updatedBrand);

        }

      } catch (error) {
        AxiosToast(error)
      }finally{
        setIsLoading(false)
      }

      return

    }else{
      toast.error('Please fill all mandatory fields')
    }

  }

  const handleClose = ()=>{
    onClose();
  }
  
  return (

    <AnimatePresence>
      {/* should keep this pattern to maintain exit animation */}
      {isOpen && <Modal isOpen={isOpen}>

        <div className='w-150 flex flex-col'>

          <div className='flex gap-4 mb-5 border-b border-gray-300'>
            <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className='text-xl'>Edit Brand</h1>
              <p>Change details about your brand</p>
            </div>
          </div>

          {/* form inputs */}
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-y-2 gap-x-4' id='new-brand-form'>
            
            <div className="flex flex-col gap-4">
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">
                  <span>Name</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input type="text" name='name' value={data.name} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Enter brand name'/>
              </div>
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">
                  <span>Slug</span>
                  <span className="text-xl leading-none ms-1 text-red-500">*</span>
                </label>
                <input type="text" name='slug' 
                  value={data.slug} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='@ex: brand-name'/>
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor="" className='text-neutral-600! font-semibold!'>Status</label>
                
                <ListBox
                  value={status}
                  onChange={handleStatusChange}
                  items={[
                    { id: 1, label: 'active' },
                    { id: 2, label: 'inactive' },
                  ]}
                />
                
              </div>
              <div className='flex items-center gap-8 w-full py-2 mt-2'>

                <div className="inline-flex gap-2 items-center">
                  <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Featured</label>
                  <Switch
                    value={data?.featured}
                    onChange={(value) => setData(prev => ({...prev,featured:value}))}
                  />
                </div>
                <div className="inline-flex gap-2 items-center">
                  <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Visible</label>
                  <Switch
                    value={data?.visible}
                    onChange={(value) => setData(prev => ({...prev,visible:value}))}
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className='flex flex-col items-center'>
              <label className="flex text-sm font-medium w-55">
                <span>Image</span>
                <span className="text-xl leading-none ms-1 text-red-500">*</span>
                <span className='ms-2 text-gray-400'>(jpg, png, webp, bmp) 500 x 195</span>
              </label>
              <CropperWindow
                src={data?.file}
                validFormats={['jpg','jpeg','png','bmp','webp']}
                onImageCrop={(file) => setData(prev => ({...prev,file}))}
                outPutDimen={brandImageDimen}
                outputFormat='webp'
                cropperClass="flex items-center justify-center !h-55 !w-55 rounded-2xl 
                  overflow-hidden border border-gray-300 bg-gray-500"
                buttonsClass="flex items-center justify-between w-55 gap-2 py-2"
              />
            </div>

          </form>

          {/* action buttons */}
          <div className='flex w-full items-center justify-end gap-2 pt-6'>
            
            <button
              onClick={handleClose}
              className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300 !text-gray-500 hover:!text-white !bg-gray-300 hover:!bg-gray-400`}>

              <span>Close</span>
            </button>

            <LoadingButton
              loading={isLoading}
              text='Update Now'
              loadingText='Updating . . . . .'
              type='submit'
              form='new-brand-form'
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

export default EditBrandModal