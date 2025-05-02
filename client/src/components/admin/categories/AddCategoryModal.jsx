
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb';
import ComboBox from '../../ui/ComboBox';
import ListBox from '../../ui/ListBox';
import Switch from '../../ui/ToggleSwitch';
import CropperWindow from '../../ui/CropperWindow';

function AddCategoryModal({isOpen, onClose}) {

  
  const [loading, setIsLoading] = useState(false);
    

  /* data input handling */
  const [data, setData] = useState({
    file: "", name:"", slug:"", parent:"", status:"", featured:false, visible:false
  });

  const handleChange = (e) => {
    
    const { name, value } = e.target;

    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
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
              <h1 className='text-xl'>Create Category</h1>
              <p>Give necessary details about new category</p>
            </div>
          </div>

          {/* form inputs */}
          <form action="" className='grid grid-cols-2 gap-y-2 gap-x-4'>
            
            <div className="flex flex-col gap-2">
              <div className='flex flex-col w-full'>
                <label htmlFor="" className='text-neutral-600! font-semibold!'>Name</label>
                <input type="text" name='name' value={data.name} onChange={handleChange} 
                  placeholder='Enter category name'/>
              </div>
              <div className='flex flex-col w-full'>
              <label htmlFor="" className='text-neutral-600! font-semibold!'>Slug</label>
              <input type="text" name='slug' value={data.slug} onChange={handleChange} 
                placeholder='@ex: category-name'/>
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor="" className='text-neutral-600! font-semibold!'>Parent</label>
                
                <ComboBox
                  onChange={(value) => setData(prev => ({...prev,parent:value}))}
                  items={[
                    { id: 1, label: 'Durward Reynolds' },
                    { id: 2, label: 'Kenton Towne' },
                    { id: 3, label: 'Therese Wunsch' },
                    { id: 4, label: 'Benedict Kessler' },
                    { id: 5, label: 'Katelyn Rohan' },
                  ]}
                />
                
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor="" className='text-neutral-600! font-semibold!'>Status</label>
                
                <ListBox
                  onChange={(value) => setData(prev => ({...prev,status:value}))}
                  items={[
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

            {/* Image */}
            <div className='flex flex-col gap-2 pt-5'>
              
              <CropperWindow
                onImageCrop={(file) => setData(prev => ({...prev,file}))}
                outPutDimen={600}
                outputFormat='webp'
                cropperClass="flex items-center justify-center !h-60 !w-60 rounded-2xl overflow-hidden border border-gray-300"
                buttonsClass="flex items-center justify-between w-60 gap-2 py-2"
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

            <button className={`px-4! rounded-3xl! inline-flex items-center
              transition-all duration-300`}>

              <span className='me-2'>Create Now</span>
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="spinner"
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{ width: 23, height: 23, opacity: 1 }}
                    exit={{ width: 0, height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                  >
                    <ClipLoader color="white" size={23} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>

        </Modal>}
    </AnimatePresence>
  )
  
  
}

export default AddCategoryModal