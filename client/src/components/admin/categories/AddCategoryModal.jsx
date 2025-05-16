
import { AnimatePresence } from 'motion/react';
import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb';
import CustomSelect from '../../ui/CustomSelect';
import Switch from '../../ui/ToggleSwitch';
import CropperWindow from '../../ui/CropperWindow';
import toast from 'react-hot-toast'
import { finalizeValues, findDuplicateAttribute, getImageDimensions, isValidDatas, isValidFile, isValidName } from '../../../utils/Utils';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { uploadCategoryImage } from '../../../services/ApiActions';
import { ClipLoader } from 'react-spinners'
import LoadingButton from '../../ui/LoadingButton';
import DynamicInputList from '../../ui/DynamicInputList';

function AddCategoryModal({categories, isOpen, onCreate, onClose}) {

  
  const [loading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [parent, setParent] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const categoryImagedimen = {width:600, height: 600}
    

  /* data input handling */
  const [data, setData] = useState({
    file: "", name:"", slug:"", parentId:"", status:"", 
    featured:false, visible:false, attributes: []
  });

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

  const handleAttributes = (inputs) => {
    
    if(inputs?.length){

      const attrs = inputs.filter(item => !item.parent).map(item => {
        return {
          name: item.data?.name,
          values: item.data.value?.split(',').filter(Boolean)
        }
      })

      if(findDuplicateAttribute([...attributes, ...attrs])){
        toast.error("This attribute alredy exists", {position:'top-center'});
      }
      
      setData(prev => ({...prev, attributes:attrs}))
    }
  }

  const handleStatusChange = (val) => {
    setStatus(val);
    setData(prev => ({...prev,status:val.label.toLowerCase()}))
  }

  const handleParentChange = (val) => {
    setParent(val);
    setData(prev => ({...prev,parentId:val?.id}));
    const cat = categories?.find(item => item._id === val.id)
    
    if(cat?.attributes){
      const attrs = cat.attributes.map(item => ({...item, parent: true}))
      setAttributes(attrs)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(isValidDatas(['name','slug','file'], data)){
      
      if(!isValidName(data['name']) || !isValidName(data['slug'])){
        toast.error('Name and slug should have minimum 3 letters')
        return
      }

      if(!data['file']){
        toast.error("Image is mandatory to create category");
        return
      }

      if(!isValidFile(data['file'])){
        toast.error("You selected invalid file");
        return
      }
      

      setIsLoading(true)

      try {

        const dimen = await getImageDimensions(data['file']);
      
        if(dimen.width !== categoryImagedimen.width || dimen.height !== categoryImagedimen.height){
          toast.error("Image dimention does not match");
          return
        }

        const finalData = finalizeValues(data);

        if(finalData.attributes && 
          findDuplicateAttribute([...attributes, ...finalData.attributes])){
          toast.error("Duplicate attributes not allowed", {position:'top-center'});
          return
        }
        
        const response = await Axios({
          ...ApiBucket.addCategory,
          data: finalData
        })

        if(response.data.success){

          const newCategory = response.data.category;

          const image = await uploadCategoryImage(newCategory._id,'categories','image',finalData.file);
          
          newCategory.image = image;

          AxiosToast(response, false);
          setData({
            file: "", name:"", slug:"", parentId:"", status:"", featured:false, visible:false
          })
          setStatus(null);
          setParent(null);

          onCreate(newCategory);

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
    setData({
      file: "", name:"", slug:"", parentId:"", status:"", featured:false, visible:false
    })
    setStatus(null);
    setParent(null);
    onClose();
  }
  
  return (

    <AnimatePresence>
      {/* should keep this pattern to maintain exit animation */}
      {isOpen && <Modal isOpen={isOpen}>

        <div className='w-250 flex flex-col'>

          {/* header */}
          <div className='flex gap-4 mb-5 border-b border-gray-200'>
            <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className='text-xl'>Create Category</h1>
              <p>Give necessary details about new category</p>
            </div>
          </div>

          {/* form inputs */}
          <form onSubmit={handleSubmit} className='grid grid-cols-[1fr_1.5fr_1fr] overflow-hidden gap-y-2 gap-x-4' id='new-category-form'>
            
            {/* inputs fields */}
            <div className="flex flex-col gap-2">
              <div className='flex flex-col w-full'>
                <label className="mandatory">Name</label>
                <input type="text" name='name' value={data.name} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Enter category name'/>
              </div>
              <div className='flex flex-col w-full'>
                <label className="mandatory">Slug</label>
                <input type="text" name='slug' 
                  value={data.slug} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='@ex: category-name'/>
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor="">Parent</label>
                
                <CustomSelect
                  value={parent}
                  onChange={handleParentChange}
                  options={categories?.filter(item => !item.parentId).map(category => 
                    ({ id: category._id, label: category.name })
                  )}
                />
                
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor="">Status</label>
                
                <CustomSelect
                  value={status}
                  onChange={handleStatusChange}
                  options={[
                    { id: 1, label: 'Active' },
                    { id: 2, label: 'Inactive' },
                  ]}
                />
                
              </div>
              <div className='flex items-center gap-8 w-full py-2 mt-2'>

                <div className="inline-flex gap-2 items-center">
                  <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Featured</label>
                  <Switch
                    onChange={(value) => setData(prev => ({...prev,featured:value}))}
                  />
                </div>
                <div className="inline-flex gap-2 items-center">
                  <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Visible</label>
                  <Switch
                    onChange={(value) => setData(prev => ({...prev,visible:value}))}
                  />
                </div>
              </div>
            </div>

            {/* attributes */}
            <div className="flex flex-col gap-2">
              <DynamicInputList
                title='Attributes'
                value={attributes}
                onChange={handleAttributes}
                containerClass='flex flex-col max-h-[50vh] overflow-y-auto scroll-basic'
                inputContainerClass='grid grid-cols-[0.5fr_1fr_0.1fr_auto] gap-x-2 mb-2 items-center'
                removeBtnClass='!p-2 w-fit h-fit !bg-red-400 hover:!bg-red-500'
              />
            </div>

            {/* Image */}
            <div className='flex flex-col items-center'>
              <label className="flex text-sm font-medium w-60">
                <span>Image</span>
                <span className="text-xl leading-none ms-1 text-red-500">*</span>
              </label>
              <CropperWindow
                onImageCrop={(file) => setData(prev => ({...prev,file}))}
                outPutDimen={categoryImagedimen}
                outputFormat='webp'
                cropperClass="flex items-center justify-center !h-60 !w-60 rounded-2xl overflow-hidden border border-gray-300"
                buttonsClass="flex items-center justify-center w-60 gap-2 py-2"
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
              loading={loading}
              text='Create Now'
              loadingText='Creating . . . . .'
              type='submit'
              form='new-category-form'
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

export default AddCategoryModal