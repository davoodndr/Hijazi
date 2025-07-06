
import { AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb';
import ToggleSwitch from '../../ui/ToggleSwitch';
import toast from 'react-hot-toast'
import { isValidDatas, utcDate } from '../../../utils/Utils';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { ClipLoader } from 'react-spinners'
import LoadingButton from '../../ui/LoadingButton';
import CustomSelect from '../../ui/CustomSelect';
import MyDatePicker from '../../ui/MyDatePicker';

function EditCouponModal({coupon, isOpen, onUpdate, onClose}) {

  const [isLoading, setIsLoading] = useState(false);
  const [discountType, setDicountType] = useState(null)
    
  /* data input handling */
  const [data, setData] = useState({
    code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
    expiry: "", usageLimit: "", active:true
  });

  /* initial data */
  useEffect(() => {
    setData(prev => ({
      ...prev,
      code: coupon?.code,
      discountType: coupon?.discountType,
      discountValue: coupon?.discountValue,
      minPurchase: coupon?.minPurchase,
      maxDiscount: coupon?.maxDiscount,
      expiry: coupon?.expiry,
      usageLimit: coupon?.usageLimit,
      active: coupon?.status === 'active'
    }))
    setDicountType({value: coupon?.discountType, label: coupon?.discountType})
  },[coupon])

  const handleChange = (e) => {
    
    let { name, value } = e.target;
    
    if(name === 'code') value = value.trim().toUpperCase();

    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleChangeDiscountType = (item) => {
    setDicountType(item)
    setData(prev => ({...prev, discountType: item.value}))
  }

  const handleDateChange = useCallback((date) =>{
    setData(prev => ({...prev, expiry: date}))
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(isValidDatas(['code','discountType','discountValue', 'maxDiscount', 'expiry'], data)){

      if(data.discountValue < 1 || data.maxDiscount < 1){
        toast.error("Please enter a valid amount!");
        return
      }
      if(data.minPurchase &&  data.minPurchase < 1){
        toast.error("Please enter a valid amount!");
        return
      }
      if(data.usageLimit &&  data.usageLimit < 1){
        toast.error("Please enter a valid amount!");
        return
      }
      
      setIsLoading(true)

      const finalData = {
        ...data,
        coupon_id: coupon._id,
        expiry: utcDate(data.expiry instanceof Date ? data.expiry : new Date(data.expiry)),
        status: data?.active ? 'active' : 'inactive',
        discountValue: parseFloat(data?.discountValue),
        minPurchase: parseFloat(data?.minPurchase || 0),
        maxDiscount: parseFloat(data?.maxDiscount || 0),
        usageLimit: parseInt(data?.usageLimit || 1)
      }

      try {
        
        const response = await Axios({
          ...ApiBucket.updateCoupon,
          data: finalData
        })

        if(response.data.success){

          const newCoupon = response.data.coupon;

          AxiosToast(response, false);
          setData({
            code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
            expiry: "", usageLimit: "", active:true
          })
          setDicountType(null)

          onUpdate(newCoupon);

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
              <h1 className='text-xl'>Edit Coupon</h1>
              <p>Change details for the coupon</p>
            </div>
          </div>

          {/* form inputs */}
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-y-2 gap-x-4' id='edit-coupon-form'>
            
            {/* code */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Coupon code</label>
              <input type="text" name='code' value={data?.code ?? ''} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter coupon code'/>
            </div>

            {/* discount type */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Discount type</label>
              <CustomSelect
                value={discountType}
                onChange={handleChangeDiscountType}
                options={[
                  {value: 'fixed', label: 'fixed'},
                  {value: 'percentage', label: 'percentage'},
                ]} />
            </div>

            {/* discount value */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Discount Value</label>
              <input type="number" name='discountValue' value={data?.discountValue ?? ''} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter discount value'/>
            </div>

            {/* minimum purchase value */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium">Min. purchase Value</label>
              <input type="number" name='minPurchase' value={data?.minPurchase ?? ''} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter minimum purchase value'/>
            </div>

            {/* max disocunt */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Max Discount</label>
              <input type="number" name='maxDiscount' value={data.maxDiscount ?? ''} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter maxmimum discount allowed'/>
            </div>

            {/* expiery date */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Expiry date</label>
              <MyDatePicker 
                value={coupon?.expiry ?? ''}
                onChange={handleDateChange} 
              />
            </div>

            {/* usage limit */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium">Usage Limit</label>
              <input type="number" name='usageLimit' value={data.usageLimit ?? ''} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter coupon count allowed per user'/>
            </div>

            {/* visibility */}
            <div className="inline-flex gap-2 items-center">
              <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Active</label>
              <ToggleSwitch
                value={data.active}
                onChange={(value) => setData(prev => ({...prev, active:value}))}
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
              form='edit-coupon-form'
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

export default EditCouponModal