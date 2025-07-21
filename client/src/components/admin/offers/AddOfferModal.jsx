
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
import CustomSelect from '../../ui/CustomSelect'
import MyDatePicker from '../../ui/MyDatePicker';
import MultiSelectCheck from '../../ui/MultiSelectCheck';
import { useSelector } from 'react-redux';

function AddOfferModal({isOpen, onCreate, onClose}) {

  const ruleLength = { min:5 }
  const { categoryList } = useSelector(state => state.categories);
  const { items:productList } = useSelector(state => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const [offerType, setOfferType] = useState(null)
  const [discountType, setDicountType] = useState(null)
    
  /* data input handling */
  const [data, setData] = useState({
    title: "", type: "", code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
    startDate: "", endDate: "", usageLimit: "", usagePerUser: "", active:true 
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

  const handleChangeOfferType = (item) => {
    setDicountType(item)
    setData(prev => ({...prev, type: item.value}))
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
      if(offerRule.wordCount < ruleLength.min){
        toast.error(`Offer rule shuold have minimum ${ruleLength.min} words!`);
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
        offerRule: data?.rule
      }

      try {
        
        const response = await Axios({
          ...ApiBucket.addOffer,
          data: finalData
        })

        if(response.data.success){

          const newOffer = response.data.offer;

          AxiosToast(response, false);
          setData({
            code: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
            expiry: "", usageLimit: "", active:true, rule: ""
          })
          setDicountType(null)

          onCreate(newOffer);

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
      {isOpen && <Modal isOpen={isOpen} modalContentClass='overflow-visible'>

        <div className='w-170 flex flex-col'>

          <div className='flex gap-4 mb-5 border-b border-gray-300'>
            <div className='p-3 mb-3 border border-primary-300 rounded-2xl bg-primary-50'>
              <TbCategoryPlus size={20} />
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className='text-xl'>Create New Offer</h1>
              <p>Give necessary details for new offer</p>
            </div>
          </div>

          {/* form inputs */}
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-y-2 gap-x-4' id='new-offer-form'>
            
            {/* code */}
            <div className='flex flex-col w-full'>
              <label className="flex mandatory">Title</label>
              <input type="text" name='title' value={data?.title} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter offer title'/>
            </div>

            {/* offer type */}
            <div className='flex flex-col w-full'>
              <label className="flex text-sm font-medium mandatory">Offer type</label>
              <CustomSelect
                value={offerType}
                onChange={handleChangeOfferType}
                options={[
                  {value: 'offer', label: 'offer'},
                  {value: 'coupon', label: 'coupon'},
                ]} />
            </div>

            {/* discount type */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium mandatory">Discount type</label>
                <CustomSelect
                  value={discountType}
                  onChange={handleChangeDiscountType}
                  options={[
                    {value: 'fixed', label: 'fixed'},
                    {value: 'percentage', label: 'percentage'},
                    {value: 'bogo', label: 'by one get one'},
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
            </div>

            {/* minimum purchase value */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">Min. purchase Value</label>
                <input type="number" name='minPurchase' value={data.minPurchase} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='@ex: 0000'/>
              </div>

              {/* max disocunt */}
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">Max Discount</label>
                <input type="number" name='maxDiscount' value={data.maxDiscount} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='@ex: 0000'/>
              </div>
            </div>

            {/* start date */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium mandatory">Start date</label>
                <MyDatePicker
                  value={data?.startDate ?? ''}
                  onChange={handleDateChange} 
                  placeholder="Offer start date"
                />
              </div>

              {/* end date */}
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">End date</label>
                <MyDatePicker
                  value={data?.endDate ?? ''}
                  onChange={handleDateChange}
                  placeholder="Offer end date"
                />
              </div>
            </div>

            {/* usage limit */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">Max. usage limit</label>
                <input type="number" name='usageLimit' value={data.usageLimit} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Enter max offer count'/>
              </div>

              {/* usage per user */}
              <div className='flex flex-col w-full'>
                <label className="flex text-sm font-medium">Usage per user</label>
                <input type="number" name='usageLimit' value={data.usageLimit} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Enter count per user'/>
              </div>
            </div>

            {/* applicable categories */}
            <div className='flex flex-col w-full  overflow-visible'>
              <label className="flex text-sm font-medium">Applicable Categories</label>
              <MultiSelectCheck 
                className='border-neutral-300'
                /* options={categoryList?.map(category => 
                  ({value: category?._id, label: category?.name})
                )} */
               options={[
                {value: "option1", label: "Option 1"},
                {value: "option2", label: "Option 2"},
                /* {value: "option3", label: "Option 3"},
                {value: "option4", label: "Option 4"}, */
               ]}
              />
            </div>

            {/* applicable categories */}
            <div className='flex flex-col w-full  overflow-visible'>
              <label className="flex text-sm font-medium">Applicable Products</label>
              <MultiSelectCheck
                searchable={true} 
                className='border-neutral-300'
                options={productList?.flatMap(product =>{
                  const list = []
                  if(product?.variants?.length){
                    product?.variants?.forEach(p => 
                      list.push({value: p?.sku, label: `${p?.sku} | ${product?.name}`})
                    )
                  }else{
                    list.push({value: product?.sku, label: `${product?.sku} | ${product?.name}`})
                  }
                  return list
                })}
              />
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
              form='new-offer-form'
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

export default AddOfferModal