
import { AnimatePresence } from 'motion/react';
import React, { useCallback, useState } from 'react'
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
import CustomSelect from '../../../components/ui/CustomSelect'
import MyDatePicker from '../../ui/MyDatePicker';
import WordCountInput from '../../ui/WordCountInput';

function AddCouponModal({isOpen, onCreate, onClose}) {

  const ruleLength = { min:5 }
  const [isLoading, setIsLoading] = useState(false);
  const [discountType, setDicountType] = useState(null)
  const [couponRule, setCouponRule] = useState(null);
    
  /* data input handling */
  const [data, setData] = useState({
    code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
    expiry: "", usageLimit: "", active:true, rule: ""
  });

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

    if(isValidDatas(['code','discountType','discountValue', 'expiry'], data)){

      if(data.discountValue < 1 || (data?.discountType !== 'fixed' && data.maxDiscount < 1)){
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
      if(couponRule.wordCount < ruleLength.min){
        toast.error(`Coupon rule shuold have minimum ${ruleLength.min} words!`);
        return
      }
      
      setIsLoading(true)

      const finalData = {
        ...data,
        expiry: utcDate(data.expiry),
        status: data?.active ? 'active' : 'inactive',
        discountValue: parseFloat(data?.discountValue),
        minPurchase: parseFloat(data?.minPurchase || 0),
        maxDiscount: parseFloat(data?.maxDiscount || 0),
        usageLimit: parseInt(data?.usageLimit || 1),
        couponRule: data?.rule
      }

      try {
        
        const response = await Axios({
          ...ApiBucket.addCoupon,
          data: finalData
        })

        if(response.data.success){

          const newCoupon = response.data.coupon;

          AxiosToast(response, false);
          setData({
            code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
            expiry: "", usageLimit: "", active:true, rule: ""
          })
          setDicountType(null)

          onCreate(newCoupon);

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
              <h1 className='text-xl'>Create Coupon</h1>
              <p>Give necessary details for new coupon</p>
            </div>
          </div>

          {/* form inputs */}
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-y-2 gap-x-4' id='new-category-form'>
            
            {/* code */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Coupon code</label>
              <input type="text" name='code' value={data?.code} 
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
              <input type="number" name='discountValue' value={data.discountValue} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter discount value'/>
            </div>

            {/* minimum purchase value */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium">Min. purchase Value</label>
              <input type="number" name='minPurchase' value={data.minPurchase} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter minimum purchase value'/>
            </div>

            {/* max disocunt */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Max Discount</label>
              <input type="number" name='maxDiscount' value={data.maxDiscount} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter maxmimum discount allowed'/>
            </div>

            {/* expiery date */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Expiry date</label>
              <MyDatePicker
                value={data?.expiry ?? ''}
                onChange={handleDateChange} 
              />
            </div>

            {/* detail */}
            <div className="flex flex-col w-full col-span-2">
              <label className="flex text-sm font-medium">Detail</label>
              <WordCountInput
                onChange={(values) => {
                  setData(prev => ({...prev, detail: values.detail}));
                  setCouponRule(values)
                }}
              />
            </div>

            {/* usage limit */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium">Usage Limit</label>
              <input type="number" name='usageLimit' value={data.usageLimit} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter coupon count allowed per user'/>
            </div>

            {/* status */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium">Status</label>
              <div className="h-[40px] inline-flex gap-2 items-center 
                border border-neutral-300 rounded-input-border px-3.5">
                <label htmlFor="" className='!text-sm text-neutral-600! font-semibold!'>Active</label>
                <ToggleSwitch
                  value={data.active}
                  onChange={(value) => setData(prev => ({...prev, active:value}))}
                />
              </div>
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

export default AddCouponModal