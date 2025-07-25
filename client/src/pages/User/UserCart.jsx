import React, { useEffect, useState } from 'react'
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteCartItem, getCartCount, getCartTax, getItemsTotal, removeFromCart, setAppliedCoupon, 
  setCartTotal, setCouponDiscount, setRoundOff, syncCartitem} from '../../store/slices/CartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router'
import clsx from 'clsx'
import { setLoading } from '../../store/slices/CommonSlices'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import CouponCardSmall from '../../components/ui/CouponCardSmall';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdContentPaste } from 'react-icons/md';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsTrash3 } from "react-icons/bs";
import { motion } from 'motion/react';

function UserCart(){

  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const cartSubTotal = useSelector(getItemsTotal);
  const cartCount = useSelector(getCartCount);
  const cartTax = useSelector(getCartTax);
  const { offersList } = useSelector(state => state.offers);
  const [coupons, setCoupons] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [discount, setDiscount] = useState(0)
  const [roundOffValue, setRoundOffValue] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0);


  // initial
  const handleQuantityUpdate = async(item, qty) => {
    const newitem = {
      ...item,
      quantity: item.quantity + qty
    }

    if(user?.roles?.includes('user')){
      const {payload: data} = await dispatch(syncCartitem({user_id: user._id, item: newitem, type: 'update'}))
      if(data?.success){
        toast.success(qty < 0 ? "Item removed from cart" : "Item added to cart",{position: 'top-center'})
      }
    }else{
      dispatch(addToCart({item: newitem, type:'update'}))
      toast.success("Item removed from cart",{position: 'top-center'})
    }
  }

  // handle remove cart item
  const handleRemoveCartItem = async(item) => {
  
    if(user?.roles.includes('user')){
      const { payload: data } = await dispatch(deleteCartItem({user_id: user._id, item}))
      if(data?.success){
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      dispatch(removeFromCart(item.id));
      toast.success("Item removed from cart",{position: 'top-center'})
    }
  }

  /* coupon handling */

  // initial filtering
  useEffect(() => {
    const availableCoupons = offersList?.filter(off => 
       off?.type === 'coupon' && off?.minPurchase <= cartSubTotal
    );
    setCoupons(availableCoupons)
  },[offersList]);

  // handling coupon input typing
  const handleCouponChange = (e) => {
    const value = e.target.value;
    const suggestedCoupon = coupons?.find(c => c.couponCode === value);
    if(suggestedCoupon){
      setActiveCoupon(suggestedCoupon);
    }
  }

  // fun for checking clipboard is empty or not
  const checkClipBoard = async() => {
    try {
      const text = await navigator.clipboard.readText();
      console.log(text)
      if (text.trim()) {
        return text.trim();
      }
      return null;
    } catch (err) {
      console.error("Clipboard read failed:", err);
      return null;
    }
  }

  const handleApplyCoupon = () => {
    
    const discValue = calculateDiscount();
    const rawTotal = Number(cartSubTotal) + Number(cartTax) - discValue;
    const roundedTotal = Math.floor(rawTotal);
    const roundOffValueAmount = (rawTotal - roundedTotal);

    setDiscount(discValue)
    setGrandTotal(roundedTotal)
    setRoundOffValue(roundOffValueAmount)
  }

  const handleRemoveCoupon = () => {
    setActiveCoupon(null)
    setDiscount(0);
    setGrandTotal(Number(cartSubTotal) + Number(cartTax))
  }

  const calculateDiscount = () => {

    let discountValue = 0;
    if(activeCoupon?.discountType === "percentage"){
      const reduction = (cartSubTotal * activeCoupon?.discountValue) / 100;
      discountValue = reduction < activeCoupon?.maxDiscount ? reduction : activeCoupon?.maxDiscount
    }else{
      discountValue = activeCoupon?.discountValue
    }
    return discountValue || 0;

  }

  /* total */
  useEffect(() => {
    let totalAmount = Number(cartSubTotal) + Number(cartTax) - Number(discount);
    setGrandTotal(totalAmount)
  },[])
  
  useEffect(() => {
    
    handleApplyCoupon();

  },[cartSubTotal])

  /* handle press checkout */
  const handleCheckout = () => {
    if(user?.roles?.includes('user')){
      dispatch(setCouponDiscount(discount));
      dispatch(setRoundOff(roundOffValue));
      dispatch(setCartTotal(grandTotal));
      dispatch(setAppliedCoupon(activeCoupon))
      dispatch(setLoading(true))
      navigate('/checkout')
    }else{
      navigate("/login")
    }
  }
  
  return (

    <section className='w-full flex justify-center bg-primary-50 border-b border-gray-300'>
      <div className="w-9/10 flex items-start my-10 space-x-8">

        {/* products */}
        <div className='flex-grow'>
          <h3 className='text-xl'>Shopping Bag</h3>
          {cartCount ? 
            (<p><span className='font-bold'>{cartCount}
              {cartCount > 1 ? ' items' : ' item'} </span> in your bag
            </p>)
            :
            (<span>Bag is empty</span>)
          }

          {/* products */}
          <ul className='flex flex-col p-5 pb-0 mt-8 rounded-2xl bg-white shade 
            divide-y divide-gray-300 space-y-5'>
            {/* header */}
            <li className='grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] 
              justify-items-center border-0 capitalize font-bold'>
              <span className='w-full'>product</span>
              <span>price</span>
              <span>quantity</span>
              <span>total price</span>
              <span></span>
            </li>

            {/* item */}
            {items.length > 0 ? 
            
              items.map(item => {

                const attributes = item?.attributes ? Object.entries(item.attributes) : [];
                const itemTotal = item.quantity * item.price;

                return (
                  <li key={item.id} className='grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] pb-5 justify-items-center'>
                    <div className='flex w-full items-center space-x-4'>
                      {/* image */}
                      <div className='w-30 rounded-2xl overflow-hidden'>
                        <img src={item.image?.thumb} alt="" />
                      </div>
                      {/* info */}
                      <div className='flex flex-col leading-normal'>
                        <div className='mb-2'>
                          <p className='uppercase text-[10px] text-gray-400'>{item?.category}</p>
                          <p className='capitalize font-bold'>{item.name}</p>
                        </div>
                        <div>
                          {attributes.length > 0 && attributes.map(([name, value]) => 
                            <div key={name} className='grid grid-cols-3 capitalize'>
                              <span className='text-gray-400 text-xs'>{name}</span>
                              {name === 'color' || name === 'colour' ?
                                <div className='point-before point-before:!me-3 point-before:!p-0.5'>
                                  <span
                                    style={{"--dynamic": value}}
                                    className='w-3 h-3 bg-(--dynamic) rounded-sm'
                                  ></span>
                                </div>
                                :
                                <span className='text-xs text-gray-600 point-before point-before:!me-3 point-before:!p-0.5'>{value}</span>
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className='price-before !text-base font-bold'>{item.price}</span>
                    <div className='flex items-center'>
                      <span 
                        onClick={() => 
                          item.quantity > 1 && 
                          handleQuantityUpdate(item, - 1)
                        }
                        className='cursor-pointer'>
                        <CiSquareMinus className='text-3xl' />
                      </span>
                      <span className='px-2'>{item.quantity}</span>
                      <span 
                        onClick={() => handleQuantityUpdate(item, 1)}
                        className='cursor-pointer'>
                        <CiSquarePlus className='text-3xl' />
                      </span>
                    </div>
                    <p className='price-before !text-base font-bold'>{itemTotal}</p>
                    {/* delete button */}
                    <div className='flex items-center'>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCartItem(item)
                        }} 
                        className='cursor-pointer p-2 rounded-xl smooth hover:shadow-lg/20
                          hover:scale-110 hover:text-red-500'>
                        <BsTrash3 className='text-xl' />
                      </span>
                    </div>
                  </li>
                )
              })
              :
              (<div className='mb-5 text-center py-3 text-lg bg-primary-25 rounded-xl'>
                Bag is emply
              </div>)
            }
            
          </ul>
        </div>

        {/* right side summery */}
        <motion.div layout className='w-[25%] shrink-0 p-2 rounded-2xl bg-white shade'>

          {/* coupon */}
          <motion.div layout className='flex flex-col p-3 pb-8 space-y-4'>
            <h3 className='text-lg'>Coupon Code</h3>
            <p
              className='text-sm text-gray-400'>
              {activeCoupon?.couponRule ? 
                activeCoupon?.couponRule
                : 'Have a coupon code? Select one from the available options below or enter your code manually to apply a discount to your order.'
              }
            </p>
            
            {/* available coupons */}
            <motion.div layout>
              <p className='font-bold mb-2'>Availbale Coupons</p>
              <div className='relative px-4'>

                {/* nav buttons */}
                <div className={`swiper-prev absolute -left-1 top-0
                  inline-flex h-full items-center cursor-pointer`}>
                  <IoIosArrowBack className="text-lg" />
                </div>
                <div className={`swiper-next absolute -right-1 top-0
                  inline-flex h-full items-center cursor-pointer`}>
                  <IoIosArrowForward className="text-lg" />
                </div>

                <Swiper
                  slidesPerView="auto"
                  modules={[Navigation]}
                  spaceBetween={0}
                  freeMode={true}
                  navigation={{
                    nextEl: '.swiper-next',
                    prevEl: '.swiper-prev'
                  }}
                >
                  {coupons?.map((coupon, i) => 
                    <SwiperSlide key={i}
                      onClick={() => {
                        setActiveCoupon(coupon)
                      }} 
                      className='!inline-flex px-0.5 bg-white !w-fit h-fit cursor-pointer'
                    >
                      <CouponCardSmall
                        coupon={coupon}
                        containerClass={clsx(
                          activeCoupon?._id !== coupon?._id && "!bg-pink-400"
                        )}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
            </motion.div>

            <motion.div layout className='relative'>
              <input 
                type="text"
                placeholder='Coupon code'
                onChange={handleCouponChange}
                value={
                  activeCoupon?.couponCode ?
                  `${activeCoupon?.couponCode} | ${activeCoupon?.discountType === 'fixed' ? ' ₹' : ''}${activeCoupon?.discountValue}${activeCoupon?.discountType !== 'fixed' ? '%' : ''} OFF`
                  : ""
                }
              />

              {/* copy paste buttons */}
              {activeCoupon?.couponCode ?
                <div 
                  onClick={handleRemoveCoupon}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 
                    smooth hover:text-pink-400 cursor-pointer`}>
                  <IoCloseCircleOutline className='text-2xl' />
                </div>
                :
                <div
                  onClick={async() => {
                    const clipboardText = await checkClipBoard();
                    if(clipboardText?.length){
                      const copiedCoupon = coupons?.find(c => c.couponCode === clipboardText)
                      if(copiedCoupon?.couponCode){
                        setActiveCoupon(copiedCoupon)
                      }else{
                        toast.error("Invalid coupon code!")
                      }
                    }else{
                      toast.error("Clipboard is empty!")
                    }
                  }}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 
                    smooth hover:text-pink-400 cursor-pointer`}
                >
                  <MdContentPaste className='text-xl' />
                </div>
              }

            </motion.div>

            {/* coupon aplly button */}
            <motion.div layout 
              onClick={handleApplyCoupon}
              className='button border-gray-300 hover:shadow-md hover:border-primary-300 hover:text-primary-400'
            >Apply</motion.div>

          </motion.div>

          {/* calculations */}
          <motion.div layout className='flex flex-col rounded-xl bg-primary-50 p-4'>
            <h3 className='mb-4 text-xl'>Cart Amount</h3>
            <ul className='mb-6'>
              <li className='flex w-full items-center justify-between'>
                <span>Cart Subtotal</span>
                <span className='price-before price-before:!text-gray-400 font-bold'>
                  {Number(cartSubTotal).toFixed(2)}
                </span>
              </li>
              <li className='flex w-full items-center justify-between'>
                <span>Tax <span className='text-gray-400 text-xs'>5% GST included</span></span>
                <span className='font-bold price-before'>{cartTax}</span>
              </li>
              <li className='flex w-full items-center justify-between'>
                <span>Discount</span>
                <p className=''>-
                  <span className='price-before price-before:!text-red-300 ps-0.5 font-bold text-red-400'>
                    {Number(discount).toFixed(2)}
                  </span>
                </p>
              </li>
              <li className='flex w-full items-center justify-between'>
                <span>Round off</span>
                <p className=''>-
                  <span className='price-before price-before:!text-red-300 ps-0.5 font-bold text-red-400'>
                    {Number(roundOffValue).toFixed(2)}
                  </span>
                </p>
              </li>
              <li className='my-1 border-t border-primary-500/20'></li>
              <li className='flex w-full items-center justify-between py-1'>
                <h3 className='text-base'>Cart Total</h3>
                <h3 className='price-before text-lg font-bold !items-start
                 price-before:!text-gray-400 !leading-5'>
                  {Number(grandTotal).toFixed(2)}
                </h3>
              </li>
            </ul>
            <div className='flex w-full'>
              <button 
                onClick={handleCheckout}
                className={clsx('w-full',
                  !user?.roles?.includes('user') && '!bg-gray-300 pointer-events-none'
                )}
                >Checkout</button>
            </div>
          </motion.div>
          
        </motion.div>

      </div>
    </section>
    
  )
}

export default UserCart