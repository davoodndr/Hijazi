import React, { useEffect, useState } from 'react'
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteCartItem, getCartCount, getCartTax, getItemsTotal, removeFromCart, setAppliedCoupon,
  syncCartitem, setCheckoutItems, setAppliedCartOffer} from '../../store/slices/CartSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router'
import clsx from 'clsx'
import { setLoading } from '../../store/slices/CommonSlices'
import { BiSolidOffer } from "react-icons/bi";
import CouponCardSmall from '../../components/ui/CouponCardSmall';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdContentPaste } from 'react-icons/md';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BsTrash3 } from "react-icons/bs";
import { motion } from 'motion/react';
import { calculateDiscount, filterDiscountOffers, findBestOffer } from '../../utils/Utils'
import CouponSlider from '../../components/user/CouponSlider';
import { TbHeart } from 'react-icons/tb';
import { syncWishlistItem } from '../../store/slices/WishlistSlice';
import { useAddToCartMutation, useRemoveFromCartMutation } from '../../services/UserMutationHooks';
import AxiosToast from '../../utils/AxiosToast';

function UserCart(){

  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { items:cartItems } = useSelector(state => state.cart);
  const { items:productsList } = useSelector(state => state.products);
  const { user } = useSelector(state => state.user);
  const cartSubTotal = useSelector(getItemsTotal);
  const cartTax = useSelector(getCartTax);
  const { offersList } = useSelector(state => state.offers);
  const [items, setItems] = useState([]);
  const [invalidItems, setInvalidItems] = useState([]);
  const [itemsWithOffer, setItemsWithOffer] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [cartOffer, setCartOffer] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [offersDiscount, setOffersDiscount] = useState(0)
  const [roundOffValue, setRoundOffValue] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0);

  const addToCartMutation = useAddToCartMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();

  useEffect(()=> {
    dispatch(setLoading(false))
  },[])

  // initial
  const handleQuantityUpdate = async(item, type) => {
    const newitem = {
      _id: item?._id,
      product_id: item?.product_id,
      variant_id: item?.id,
      quantity: 1,
      attributes: item?.attributes,
      type
    }

    if(user?.roles?.includes('user')){

      const response = await addToCartMutation.mutateAsync(
        { item: newitem },
        {
          onError: (err)=> AxiosToast(err)
        }
      )
      
      if(response?.data?.success){
        
        const updated = response?.data?.cartItem;

        dispatch(addToCart(updated));
        AxiosToast(response, false);
      }

    }else{
      dispatch(addToCart({item: newitem, type:'update'}))
      toast.success("Item removed from cart",{position: 'top-center'})
    }
  }

  // handle remove cart item
  const handleRemoveCartItem = async(item_id) => {
  
    if(user?.roles.includes('user')){
      const response = await removeFromCartMutation.mutateAsync({ item_id });
      if(response?.data?.success){

        const removed_id = response?.data?.item_id;
        dispatch(removeFromCart(removed_id));
        AxiosToast(response, false);
      }
    }else{
      dispatch(removeFromCart(item_id));
      toast.success("Item removed from cart",{position: 'top-center'})
    }
  }

  /* coupon & offer handling */
  
  // reset the discount on logout
  useEffect(() => {
    if (!user) {
      setOffersDiscount(0);
      setGrandTotal(0);
    }
  }, [user]);

  // initial filtering
  useEffect(() => {

    const availableCoupons = offersList?.filter(off => 
      off?.type === 'coupon' &&  off?.minPurchase <= cartSubTotal  
    );
    const availableOffers = offersList?.filter(el => el?.type !== 'coupon' && el?.type !== 'cart');
    const cOffers = offersList?.filter(el => el?.type === 'cart')
    const cartBestOffer = findBestOffer(cOffers, cartSubTotal);
    
    setCoupons(availableCoupons)
    setOffers(availableOffers)

    const subTotal = Number(cartSubTotal);

    if(cartBestOffer){

      if(subTotal > cartBestOffer?.min){
        setCartOffer(cartBestOffer)
      }else{
        if(subTotal > 0){
          setCartOffer({
            need: Math.abs(subTotal - cartBestOffer?.min),
            max: cartBestOffer?.max
          })
        }
      }
      
    }

  },[offersList, cartSubTotal]);

  useEffect(() => {

    const cartList = cartItems?.map(item => {

      const p = productsList?.find(el => el?._id === item?.product_id);
      if(p){
        
        return {
          ...item,
          tax: item?.price * item?.quantity * p?.tax,
          category: {
            name: p?.category?.name,
            slug: p?.category?.slug,
            parentId: {
              slug: p?.category?.parentId?.slug
            }
          },
          variants: p?.variants
        }
      }else{
        return item
      }
    })

    const sorted = cartList?.sort((a,b)=> a?.createdAt?.localeCompare(b?.createdAt))
    
    setItems(sorted);

  },[productsList, cartItems])

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
    
    const discValue = Math.floor(calcCoupnDiscount(activeCoupon));
    setCouponDiscount(discValue)
    setGrandTotal(prev => prev - discValue)
    setActiveCoupon({
      ...activeCoupon,
      appliedAmount: discValue
    })
  }

  const handleRemoveCoupon = () => {
    const discValue = calcCoupnDiscount(activeCoupon);
    setCouponDiscount(0);
    setGrandTotal(prev => prev + discValue)
    setActiveCoupon(null)
  }

  const calcCoupnDiscount = (coupon) => {

    if (coupon?.discountType === 'percentage') {
      const calculated = cartSubTotal * (coupon?.discountValue / 100);
      return coupon?.maxDiscount ? Math.min(calculated, coupon?.maxDiscount) : calculated;
    }
    return coupon?.discountValue || 0;

  }

  /* initial total */
  useEffect(() => {
    const offerDisc = calculateOfferDiscount();
    const rawTotal = Number(cartSubTotal) + Number(cartTax) - offerDisc;
    const roundedTotal = Math.floor(rawTotal);
    const roundOffValueAmount = (rawTotal - roundedTotal);
    setGrandTotal(roundedTotal || 0);
    setOffersDiscount(offerDisc || 0);
    setRoundOffValue(roundOffValueAmount || 0);

    const stockless = items?.filter(item => {
      return item?.stock <= 0
    })

    setInvalidItems(stockless);

  },[items])

  const calculateOfferDiscount = () => {

    if(!items?.length){
      setOffersDiscount(0);
      setGrandTotal(0);
      return;
    }

    let offerDiscount = 0;
    let bestOffer;

    const updatedItems = items?.map(item => {
      const availableOffers  = filterDiscountOffers(offers, item, null);
      const itemBestOffer = findBestOffer(availableOffers, item?.price);
      
      if(item?.price > (itemBestOffer?.min ?? itemBestOffer?.value)){
        offerDiscount += itemBestOffer?.value * item?.quantity || 0
      }

      if(!bestOffer || itemBestOffer?.value > bestOffer?.value){
        const off = offers?.find(el => el?._id === itemBestOffer?.id);
        bestOffer = {
          ...off,
          appliedAmount: itemBestOffer?.value
        }
      }

      return {
        ...item,
        appliedOffer: item?.price > (itemBestOffer?.min ?? itemBestOffer?.value) ? itemBestOffer : null
      }
    })

    setItemsWithOffer(updatedItems)

    return offerDiscount + (cartOffer?.value || 0)
    
  }

  /* handle press checkout */
  const handleCheckout = () => {

    if(invalidItems?.length){
      toast.error("Please remove invalid items!",{position: 'top-center'});
      return
    }

    if(user?.roles?.includes('user')){
      dispatch(setAppliedCoupon(activeCoupon));
      dispatch(setAppliedCartOffer(cartOffer));
      dispatch(setCheckoutItems(itemsWithOffer));
      dispatch(setLoading(true));
      navigate('/checkout');
    }else{
      navigate("/login")
    }
  }

  const handleAddToWishlist = async(e, item) => {
    e.stopPropagation();
    
    const newitem = {
      id: item?.id,
      name:item?.name,
      category:item?.category.name,
      sku:item?.sku,
      price:item?.price,
      stock: item?.stock,
      quantity: 1,
      image:item?.image,
      attributes:item?.attributes,
      product_id: item?.product_id
    }

    if(user?.roles?.includes('user')){
      await dispatch(deleteCartItem({item}))
      const {payload: data} = await dispatch(syncWishlistItem({item: newitem}))
      if(data?.success){
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }
  
  return (

    <section className='w-full flex justify-center bg-primary-50 border-b border-gray-300'>
      <div className="w-9/10 flex items-start my-10 space-x-8">

        {/* left side */}
        <div className='grow'>
          <h3 className='text-xl'>Shopping Bag</h3>
          {items?.length ? 
            (<p><span className='font-bold'>{items?.length}
              {items?.length > 1 ? ' items' : ' item'} </span> in your bag
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
              <span>rate</span>
              <span>quantity</span>
              <span>total price</span>
              <span>Actions</span>
            </li>

            {/* item */}
            {items?.length > 0 ? 
            
              items?.map(item => {

                const attributes = item?.attributes ? Object.entries(item?.attributes) : [];
                
                const availableOffers = filterDiscountOffers(offers, item, null)
                
                const bestOffer = findBestOffer(availableOffers, item?.price);
                const offerPrice = item?.price - bestOffer?.value;
                const itemTotal = item?.quantity * item?.price;

                return (
                  <li key={item?._id} className='grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] pb-5 justify-items-center'>
                    <div className='flex w-full items-center space-x-4 relative'>

                      {item?.stock <= 0 &&
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: 1.1 }}
                          exit={{ scale: 1 }}
                          transition={{
                            type: "tween",
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 0.5,
                            ease: "easeInOut"
                          }}
                          className='absolute top-1/2 right-0 -translate-y-1/2 origin-center will-change-transform'
                        >
                          <div className="inline-block bg-red-500 px-1">
                            <p className="text-xs text-white">Out of Stock</p>
                          </div>
                        </motion.div>
                      }

                      {/* image */}
                      <div className='w-30 rounded-2xl overflow-hidden'>
                        <img src={item?.image?.thumb} alt="" />
                      </div>
                      {/* info */}
                      <div className='flex flex-col leading-normal'>
                        <div className='mb-1'>
                          <p className='uppercase text-[10px] text-gray-400'>{item?.category?.name}</p>
                          <p className='capitalize font-bold'>{item?.name}</p>
                        </div>
                        {/* attributes */}
                        {attributes.length > 0 && 
                          <div className='mb-2'>
                            {attributes.map(([name, value]) => 
                              <div key={name} className='grid grid-cols-3 capitalize'>
                                <span className='text-gray-400 text-xs'>{name}</span>
                                {name === 'color' || name === 'colour' ?
                                  <div className='point-before point-before:me-3! point-before:p-0.5!'>
                                    <span
                                      style={{"--dynamic": value}}
                                      className='w-3 h-3 bg-(--dynamic) rounded-sm'
                                    ></span>
                                  </div>
                                  :
                                  <span className='text-xs text-gray-600 point-before point-before:me-3! point-before:p-0.5!'>{value}</span>
                                }
                              </div>
                            )}
                          </div>
                        }

                        {/* offer detal */}
                        {offerPrice > 0 && bestOffer?.type === ('product' || 'category') &&
                          <div className='flex items-center text-xs space-x-1'>
                            <div className='relative inline-flex items-center'>
                              <p className='bg-amber-400 px-2 pe-4 text-black'>Offer</p>
                              <span className='inline-flex bg-white size-3 rotate-45 absolute -right-1.5'></span>
                            </div>
                            <p className='text-primary-400 z-1'>
                              {bestOffer?.title}
                            </p>
                          </div>
                        }
                      </div>
                    </div>

                    {/* item price */}
                    <span className='price-before text-base'>
                      {item?.price}
                    </span>

                    {/* quantity */}
                    <div className='flex items-center'>
                      <span 
                        onClick={() => 
                          item?.quantity > 1 && 
                          handleQuantityUpdate(item, 'decrement')
                        }
                        className='cursor-pointer'>
                        <CiSquareMinus className='text-3xl' />
                      </span>
                      <span className='px-2'>{item?.quantity}</span>
                      <span 
                        onClick={() => handleQuantityUpdate(item, 'increment')}
                        className='cursor-pointer'>
                        <CiSquarePlus className='text-3xl' />
                      </span>
                    </div>

                    {/* item total */}
                    <p className='price-before text-base! font-bold'>{itemTotal}</p>

                    {/* delete button */}
                    <div className='flex flex-col items-center justify-center'>
                      {/* {user?.roles?.includes('user') &&
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToWishlist(e, item);
                          }}
                          className='cursor-pointer p-1.5 rounded-xl smooth hover:shadow-lg/20
                          hover:scale-110 hover:text-red-500'>
                          <TbHeart className='text-2xl' />
                        </span>
                      } */}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCartItem(item?._id)
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
                Bag is empty
              </div>)
            }
            
          </ul>
        </div>

        {/* right side summery */}
        <motion.div layout className='w-[25%] shrink-0 p-2 rounded-2xl bg-white shade'>

          {/* coupon */}
          <motion.div layout className='flex flex-col p-3 pb-6 space-y-4'>

            <h3 className='text-base'>Coupon Code</h3>
            <p className='text-sm text-gray-400'>
              Have a coupon code? Select one from the available options below or enter your code manually to apply a discount to your order.
            </p>
            
            {/* available coupons */}
            {coupons?.length > 0 &&
              <motion.div layout>
                <p className='font-bold mb-2'>Availbale Coupons</p>
                <CouponSlider
                  coupons={coupons}
                  activeCoupon={activeCoupon}
                  onSelect={(coupon) => {
                    setActiveCoupon(coupon);
                  }}
                />
              </motion.div>
            }

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

          {/* cart offer display */}
          {cartOffer?.need > 0 ?
            (<motion.div layout className='text-green-600 pb-4 flex items-center space-x-1'>
              <BiSolidOffer className='text-2xl' />
              <p className='text-sm'>
                Spend
                <span className='content-before content-before:text-green-500 mx-1 font-bold'>{cartOffer?.need}</span> 
                more to get off up to
                <span className='content-before content-before:text-green-500 mx-1 font-bold'>{cartOffer?.max}</span>
              </p>
            </motion.div>)
          :
            cartOffer && (<motion.div layout className='bg-green-600 p-2 mb-3
              flex items-center space-x-1 rounded-xl'>
              <BiSolidOffer className='text-white text-2xl' />
              <p className='text-base'>
                <span className='text-gray-100'>You saved</span>
                <span 
                  className='content-before content-before:text-[15px] 
                  content-before:text-white mx-1 text-white font-bold'
                >
                  {cartOffer?.value}
                </span>
                <span className='text-gray-100'>on this cart</span>
              </p>
            </motion.div>)
          }

          {/* calculations */}
          <motion.div layout className='flex flex-col rounded-xl bg-primary-50 p-4'>
            <h3 className='mb-4 text-xl'>Cart Amount</h3>
            <ul className='mb-6'>
              <li className='flex w-full items-center justify-between'>
                <span>Cart Subtotal</span>
                <span className='price-before price-before:text-gray-400! font-bold'>
                  {Number(cartSubTotal).toFixed(2)}
                </span>
              </li>
              <li className='flex w-full items-center justify-between'>
                <span>Tax <span className='text-gray-400 text-xs'>5% GST included</span></span>
                <span className='font-bold price-before'>{cartTax}</span>
              </li>
              {(offersDiscount > 0 || couponDiscount > 0) &&
                <li className='flex w-full items-center justify-between'>
                  <span>Discount</span>
                  <p className='text-red-400'>-
                    <span className='price-before price-before:text-red-300! ps-0.5 font-bold'>
                      {Number(offersDiscount + couponDiscount).toFixed(2)}
                    </span>
                  </p>
                </li>
              }
              {roundOffValue > 0 &&
                <li className='flex w-full items-center justify-between'>
                  <span>Round off</span>
                  <p className=''>-
                    <span className='price-before price-before:text-red-300! ps-0.5 font-bold text-red-400'>
                      {Number(roundOffValue).toFixed(2)}
                    </span>
                  </p>
                </li>
              }
              <li className='my-1 border-t border-primary-500/20'></li>
              <li className='flex w-full items-center justify-between py-1'>
                <h3 className='text-base'>Cart Total</h3>
                <h3 className='price-before text-lg font-bold items-start!
                 price-before:text-gray-400! leading-5!'>
                  {Number(grandTotal).toFixed(2)}
                </h3>
              </li>
            </ul>
            <div className='flex w-full'>
              <button 
                onClick={handleCheckout}
                className={clsx('w-full',
                  !user?.roles?.includes('user') && 'bg-gray-300! pointer-events-none'
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