
import { AnimatePresence } from 'motion/react';
import React, { useCallback, useState } from 'react'
import Modal from '../../ui/Modal'
import { TbCategoryPlus } from 'react-icons/tb';
import ToggleSwitch from '../../ui/ToggleSwitch';
import toast from 'react-hot-toast'
import { finalizeValues, isValidDatas, utcDate } from '../../../utils/Utils';
import AxiosToast from '../../../utils/AxiosToast';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';
import { ClipLoader } from 'react-spinners'
import LoadingButton from '../../ui/LoadingButton';
import CustomSelect from '../../ui/CustomSelect'
import MyDatePicker from '../../ui/MyDatePicker';
import MultiSelectCheck from '../../ui/MultiSelectCheck';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useCreateOfferMutation } from '../../../services/MutationHooks';
import { addOffer } from '../../../store/slices/OfferSlice';

function AddOfferModal({isOpen, onCreate, onClose}) {

  const dispatch = useDispatch();
  const { categoryList } = useSelector(state => state.categories);
  const { items:productList } = useSelector(state => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const [offerType, setOfferType] = useState(null);
  const [discountType, setDicountType] = useState(null);
  const [applicableCategories, setApplicableCategories] = useState([]);
  const [applicableProducts, setApplicableProducts] = useState([]);
  const createOfferMutation = useCreateOfferMutation();

  const offerTypes = [
    {value: 'coupon', label: 'coupon'},
    {value: 'product', label: 'product'},
    {value: 'category', label: 'category'},
    {value: 'cart', label: 'cart'},
  ]
    
  /* data input handling */
  const [data, setData] = useState({
    title: "", type: "", detail:"", couponCode: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
    startDate: "", endDate: "", usageLimit: "", usagePerUser: "", active:true 
  });

  const handleChange = (e) => {
    
    let { name, value } = e.target;
    
    if(name === 'couponCode') value = value.trim().toUpperCase();

    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleChangeOfferType = (item) => {
    setOfferType(item)
    setData(prev => ({...prev, type: item.value}))
  }

  const handleChangeDiscountType = (item) => {
    setDicountType(item)
    setData(prev => ({...prev, discountType: item.value}))
  }

  const handleStartDateChange = useCallback((date) =>{
    setData(prev => ({...prev, startDate: date}))
  },[])

  const handleEndDateChange = useCallback((date) =>{
    setData(prev => ({...prev, endDate: date}))
  },[])

  const validateAmounts = () => {
    if(data?.discountValue && data?.discountValue < 1){
      toast.error("Please enter a valid amount!");
      return false
    }
    if(data?.minPurchase &&  data?.minPurchase < 1){
      toast.error("Please enter a valid amount!");
      return false
    }
    if(data?.maxDiscount &&  data?.maxDiscount < 1){
      toast.error("Please enter a valid amount!");
      return false
    }
    if(data?.usageLimit &&  data?.usageLimit < 1){
      toast.error("Please enter a valid count!");
      return false
    }
    if(data?.usagePerUser &&  data?.usagePerUser < 1){
      toast.error("Please enter a valid count!");
      return false
    }

    return true
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const isValid = isValidDatas(['title','startDate','discountType','discountValue', 'detail'], data)
    const isValidAmounts = validateAmounts();

    if(isValid && isValidAmounts){

      setIsLoading(true)

      const finalData = {
        ...data,
        startDate: utcDate(data?.startDate),
        endDate: utcDate(data?.endDate),
        status: data?.active ? 'active' : 'inactive',
        applicableCategories,
        applicableProducts
      }

      const finalized = finalizeValues(finalData);

      try {
        
        const response = await createOfferMutation
          .mutateAsync({ data: finalized })


        if(response?.data?.success){

          const newOffer = response?.data?.offer;

          AxiosToast(response, false);
          setData({
            title: "", type: "", detail: "", couponCode: "", discountType:"", discountValue:"", minPurchase: "", maxDiscount: "",
            startDate: "", endDate: "", usageLimit: "", usagePerUser: "", active:true 
          })
          setDicountType(null)

          dispatch(addOffer(newOffer))
          onClose();

        }

      } catch (error) {
        console.log(error)
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
            
            {/* title */}
            <div className='flex flex-col w-full'>
              <label className="flex mandatory">Title</label>
              <input type="text" name='title' value={data?.title} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter offer title'/>
            </div>

            {/* offer type */}
            <div className="flex space-x-4">
              
              <div className='flex flex-col w-full'>
                <label className="flex mandatory">Offer type</label>
                <CustomSelect
                  value={offerType}
                  onChange={handleChangeOfferType}
                  options={offerTypes} 
                />
              </div>

              {/* coupon code */}
              {offerType?.value === 'coupon'&&
                (
                  <div className='flex flex-col w-full'>
                    <label className="flex mandatory">Coupon code</label>
                    <input type="text" name='couponCode' value={data?.couponCode} 
                      onChange={handleChange}
                      spellCheck={false}
                      placeholder='Enter coupon code'/>
                  </div>
                )
              }
            </div>

            {/* discount type */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex mandatory">Discount type</label>
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
                <label className="flex mandatory">Discount Value</label>
                <input type="number" name='discountValue' value={data.discountValue} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Enter discount value'/>
              </div>
            </div>

            {/* minimum purchase value */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label>Min. purchase Value</label>
                <input type="number" name='minPurchase' value={data.minPurchase} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='@ex: 0000'/>
              </div>

              {/* max disocunt */}
              {data?.discountType === 'percentage' &&
                <div className='flex flex-col w-full'>
                  <label>Max Discount</label>
                  <input type="number" name='maxDiscount' value={data.maxDiscount} 
                    onChange={handleChange}
                    spellCheck={false}
                    placeholder='@ex: 0000'/>
                </div>
              }
            </div>

            {/* start date */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label className="flex mandatory">Start date</label>
                <MyDatePicker
                  value={data?.startDate ?? ''}
                  onChange={handleStartDateChange} 
                  placeholder="Offer start date"
                />
              </div>

              {/* end date */}
              <div className='flex flex-col w-full'>
                <label>End date</label>
                <MyDatePicker
                  value={data?.endDate ?? ''}
                  onChange={handleEndDateChange}
                  placeholder="Offer end date"
                />
              </div>
            </div>

            {/* usage limit */}
            <div className="flex space-x-4">
              <div className='flex flex-col w-full'>
                <label>Max. usage limit</label>
                <input type="number" name='usageLimit' value={data.usageLimit} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Max. offer count'/>
              </div>

              {/* usage per user */}
              <div className='flex flex-col w-full'>
                <label>Usage per user</label>
                <input type="number" name='usagePerUser' value={data.usagePerUser} 
                  onChange={handleChange}
                  spellCheck={false}
                  placeholder='Count per user'/>
              </div>
            </div>

            {/* applicable categories */}
            {offerType?.value !== 'cart' &&
              <>
                <div className='flex flex-col w-full  overflow-visible'>
                  <label>Applicable Categories</label>
                  <MultiSelectCheck
                    onSelect={(items) => {
                      setApplicableCategories(items)
                    }}
                    searchable={true}
                    searchPlaceholder='Search with slug'
                    className='border-neutral-300'
                    options={categoryList?.map(category => 
                      ({value: category?.slug, label: category?.name})
                    )}
                  />
                </div>

                {/* applicable products */}
                <div className={clsx('flex flex-col w-full overflow-visible',
                  offerType?.value === 'category' && 'pointer-events-none text-gray-300'
                )}>
                  <label>Applicable Products</label>
                  <MultiSelectCheck
                    onSelect={(items) => {
                      setApplicableProducts(items)
                    }}
                    searchable={true}
                    searchPlaceholder='Search with sku'
                    className={clsx('border-neutral-300', offerType?.value === 'category' && 'bg-gray-100')}
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
              </>
            }

            {/* detal */}
            <div className='flex flex-col w-full col-span-2'>
              <label className="flex mandatory">Detail</label>
              <input type="text" name='detail' value={data?.detail} 
                onChange={handleChange}
                spellCheck={false}
                placeholder='Enter a clean short description'/>
            </div>

            {/* status */}
            <div className='flex flex-col w-full'>
              <label>Status</label>
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