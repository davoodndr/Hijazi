import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCartCount, getCartTax, getItemsTotal, setAppliedCoupon } from '../../store/slices/CartSlice';
import { IoWallet } from "react-icons/io5";
import ToggleSwitch  from '../../components/ui/ToggleSwitch'
import { CiDeliveryTruck } from 'react-icons/ci';
import { GoLocation } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { LuHousePlus } from "react-icons/lu";
import razorpay from '../../assets/razorpay-icon.svg'
import { RiCoupon3Fill } from "react-icons/ri";
import { useNavigate } from 'react-router';
import { setLoading } from '../../store/slices/CommonSlices';
import Alert from '../../components/ui/Alert'
import { capitalize } from '../../utils/Utils';
import toast from 'react-hot-toast';
import AddressModal from '../../components/user/AddressModal';
import { fetchAddresses } from '../../store/slices/AddressSlice';
import { IoMdCall } from "react-icons/io";
import { addToOrders } from '../../store/slices/OrderSlice';
import { placeOrderAction, processRazorpayAction, verifyRazorpayAction } from '../../services/ApiActions';
import { format } from 'date-fns'
import clsx from 'clsx';
import CouponCardMedium from '../../components/ui/CouponCardMedium';


function Checkout() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, checkoutItems, appliedCoupon, appliedCartOffer } = useSelector(state => state.cart);
  const { addressList } = useSelector(state => state.address);
  const { offersList } = useSelector(state => state.offers);
  const cartCount = useSelector(getCartCount);
  const subTotal = useSelector(getItemsTotal);
  const cartTax = useSelector(getCartTax);
  const [data, setData] = useState({
    payment_method: null, bill_address: null, ship_address: null
  });
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [cartOffer, setCartOffer] = useState(null);
  const [couponApplied, setCouponApplied] = useState(null);
  const [discounts, setDiscounts] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addressType, setAddresType] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses())
    dispatch(setLoading(false))
  },[])

  useEffect(() => {
    /* checkout items are set on cart redirect, won't effect on state update */
    const updatedItems = checkoutItems?.map(item => {
      const off = offersList?.find(el => el?._id === item?.appliedOffer?.id);
      
      if(off){
        return {
          ...off,
          appliedAmount: item?.appliedOffer?.value * item?.quantity
        }
      }
    }).filter(Boolean);

    /* filter for expired offer */
    let cartOff = offersList?.find(el => el._id === appliedCartOffer?.id);
    if(cartOff){
      cartOff = {
        ...cartOff,
        appliedAmount: appliedCartOffer?.value
      }
    }
    let coupon = offersList?.find(el => el._id === appliedCoupon?._id);
    if(coupon){
      coupon = {
        ...coupon,
        appliedAmount: appliedCoupon?.appliedAmount
      }
    }

    const offs = [...updatedItems, cartOff].filter(Boolean)
    setCartOffer(cartOff);
    setCouponApplied(coupon);
    setAppliedOffers(offs);

    const offDiscount = offs?.reduce((val, cur) => (cur?.appliedAmount ?? 0) + val,0)
    const totalDiscount = offDiscount + (coupon?.appliedAmount || 0);
    const rawTotal = Number(subTotal) + Number(cartTax) - totalDiscount;
    const roundedTotal = Math.floor(rawTotal);
    const roundOffValueAmount = (rawTotal - roundedTotal);

    setDiscounts(totalDiscount || 0);
    setRoundOff(roundOffValueAmount || 0)
    setCartTotal(roundedTotal || 0)

  },[offersList, checkoutItems, appliedCartOffer, appliedCoupon]);

  // handle select payment method
  const handleMethodChange = (e) => {
    if(e?.target?.type === 'radio'){
      setData(prev => ({...prev, payment_method:e.target.id}));
    }
  }

  const validateData = () => {
    const empty = Object.keys(data).find(key => !data[key]);
    const output = empty?.split?.('_').map(el => capitalize(el)).join(' ');
    let type;
    switch(empty){

      case 'payment_method': 
        type = 'choose';
        break;
      case 'bill_address' || 'ship_address' : 
        type = 'add';
        break;

      default:   type = 'fill';
    }

    return {field: output, type}
  }

  // handie final order placing
  const handlePlaceOrder = async() => {

    const { field:emptyField, type } = validateData();

    if(emptyField) {
      toast.error(`Please ${type} ${emptyField}!`,{position: 'top-center'});
    }else{

      const cartItems = checkoutItems.map(item => {
        let off = item?.appliedOffer;
        if(off){
          off = {
            _id: off.id,
            appliedAmount: off.value * item?.quantity
          }
        }
        return {
          ...item,
          appliedOffer: off,
          variant_id: item.product_id === item.id ? null : item.id,
          image: item?.image?.thumb || item?.image?.url,
        }
      })


      let order = {
        cartItems,
        shippingAddress: data.ship_address,
        billingAddress: data.bill_address,
        paymentMethod: data.payment_method,
        itemsPrice: Number(subTotal),
        taxAmount: Number(cartTax),
        shippingPrice: 0,
        discount: discounts,
        roundOff,
        appliedCoupon: {
          _id:couponApplied?._id,
          appliedAmount: couponApplied?.appliedAmount
        },
        cartOffer: {
          _id:cartOffer?._id,
          appliedAmount: cartOffer?.appliedAmount
        },
        totalPrice: cartTotal,
        isPaid: false,
        isDelivered: false
      }

      dispatch(setLoading(true))

      try {

        if(data?.payment_method === 'cod'){
          const response = await placeOrderAction(order);
          if(response.success){
            dispatch(addToOrders(response.order));
            showAlert(response.order)
          }
        }else{

          const paymentResponse = await processRazorpayAction(order);
          const result = await verifyRazorpayAction(paymentResponse);
          order = {
            ...order,
            paymentResult:result.paymentResult,
            isPaid: true,
            paidAt: result.paidAt
          }
          const response = await placeOrderAction(order);
          if(response.success){
            dispatch(addToOrders(response.order));
            showAlert(response.order)
          }

        }  

      } catch (error) {
        AxiosToast(error)
      }finally{
        dispatch(setLoading(false))
      }
    }
  }

  const showAlert = (order) => {

    Alert({
      title:'Order Placed successfully',
      text: 'Thank you for puchasing the product from us. You can view it on the order detail page.',
      icon: 'success',
      customClass: {
        title: '!text-2xl !text-primary-300',
        htmlContainer: '!text-gray-400',
        popup: '!max-w-[430px]',
        icon: '!size-[5em]',
        confirmButton: 'border border-primary-400',
        cancelButton: '!bg-white border border-primary-400 !text-primary-400',
        actions: '!justify-center'
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonText: 'Continue shoping',
      confirmButtonText: 'View my Order',
    })
    .then(res => {
      if(res.isConfirmed){
        navigate(`/my-order/${order.order_no}`,{state: {order}})
      }else{
        navigate('/collections')
      }
    })
    
  }

  const handleAddressSelect = (id) => {

    const address = addressList.find(item => item._id === id);
    if(addressType === 'bill'){
      setData(prev => {
        return {
          ...prev,
          bill_address: address
        }
      })
    }else{
      setData(prev => {
        return {
          ...prev,
          ship_address: address
        }
      })
    }
    setIsAddOpen(false);
    setAddresType(null);
  }

  const handleRemoveCoupon = () => {
    const couponDisc = appliedCoupon?.appliedAmount || 0
    setDiscounts(prev => prev - couponDisc)
    dispatch(setAppliedCoupon(null))
  }

  return (
    <section className='flex-grow w-full bg-gray-50 flex flex-col items-center py-15'>

      <div className='flex w-9/10 space-x-10'>
        {/* left side */}
        <div className="flex flex-col flex-grow space-y-6">

          {/* items */}
          <div className='bg-primary-50 rounded-3xl'>
            {/* header */}
            <div className='flex p-6 space-x-4'>
              <h3 className='text-xl'>Order Summery</h3>
              {cartCount ? 
                (<p className='text-gray-400 bg-primary-25 px-2 rounded-2xl'>
                  {cartCount}
                  {cartCount > 1 ? ' items' : ' item'}
                </p>)
                :
                (<span>Bag is empty</span>)
              }
            </div>
          
            <ul className='bg-white p-6 space-y-5 shadow-lg rounded-3xl'>
              {/* item */}
              {items?.length ? items?.map((item, index) => {
                const attributes = item?.attributes ? Object.entries(item.attributes) : [];
                const itemTotal = item.quantity * item.price;
                
                return (
                  <li key={`${item.id}-${index}`} className='grid grid-cols-[2fr_1fr_1fr] not-last:pb-5 not-last:border-b border-gray-200'>
                    <div className='inline-flex space-x-4'>
                      <div className='w-20 h-20 border border-gray-200 rounded-lg overflow-hidden'>
                        <img src={item.image.thumb} alt={item.name} />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <div>
                          <p className='uppercase text-xs text-gray-400/80 mb-1'>{item.category}</p>
                          <h3 className='capitalize mb-1.5'>{item.name}</h3>
                        </div>
                        <ul className='flex space-x-2'>
                          {attributes.length > 0 && attributes.map(([name, val]) => 
                            (name === 'color' || name === 'colour') ?
                            (<li
                              key={name}
                              style={{ "--dynamic": val }}
                              className='point-before point-before:!p-1.5 point-before:!me-0.5 
                              point-before:!bg-(--dynamic) point-before:!rounded-sm'
                            ></li>)
                            :
                            (<li key={name}
                              
                              className={clsx(`not-first:point-before point-before:!bg-gray-500 
                              point-before:!p-0.5 point-before:!me-2 !text-sm !text-gray-400`,
                              name === 'size' ? 'uppercase' : 'capitalize'
                            )}
                            >{val}</li>)
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className='inline-flex space-x-2 items-center justify-end relative
                      before:content-["rate"] before:capitalize before:absolute before:top-2 before:text-gray-300'>
                      <h3 className='price-before price-before:font-normal'>{item.price}</h3>
                      <p className='text-gray-500'>x</p>
                      <h3>{item.quantity}</h3>
                    </div>
                    <div className='inline-flex flex-col justify-center items-end capitalize relative
                      before:content-["total"] before:absolute before:top-2 before:text-gray-300'>
                      <h3 className='price-before price-before:font-normal price-before:text-sm text-lg items-start'>{itemTotal}</h3>
                    </div>
                  </li>
                )})
                :
                (<li className='mb-5 text-center py-3 text-lg bg-primary-25 rounded-xl'>
                  Bag is emply
                </li>)
              }
            </ul>
          </div>

          {/* applied offers */}
          <div className='bg-white p-6 shadow-lg rounded-3xl'>
            <div className='flex flex-col'>
              <h3 className='text-lg mb-3'>Applied Offers</h3>
              <div className="flex items-center border 
                border-gray-300 rounded-2xl p-4 space-x-5">
                  {couponApplied && (
                    <CouponCardMedium
                      className='!w-[180px] h-[76px] !min-w-[180px]'
                      coupon={couponApplied} />
                    )
                  }
                  {appliedOffers?.length > 0 && 
                    appliedOffers?.map(item => 
                      <div key={item?._id ?? item?.id} 
                       className='inline-flex p-0.5 relative h-full w-[160px]'
                      >
                        <div className="absolute rounded-xl border-4 border-dotted border-amber-300 inset-0"></div>
                        <div 
                          className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white
                          px-1 pt-0.5 leading-3 text-[9px] capitalize rounded-t-lg'
                        >{item?.type} Offer</div>
                        <div className="flex flex-col leading-5 bg-amber-300 rounded-xl px-2.5 py-3 h-full w-full
                          items-center justify-center"
                        >
                          <span className='font-bold text-xs text-black'>{item?.title}</span>
                          <p className='text-[11px]'>On order above
                            <span className='content-before ml-1'
                            >{item?.minPurchase ?? item?.min}</span>
                          </p>
                          {item?.endDate &&
                            <p className='text-[10px] font-bold text-amber-700'>Offer ends on  
                              <span className='ml-1'>
                                {format(new Date(item?.endDate), 'dd-MM-yyyy')}
                              </span>
                            </p>
                          }
                        </div>
                      </div>
                    )
                  }
                
                                 
                {!couponApplied && !appliedOffers?.length && (
                  <span className="text-gray-400">No offer applied</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-[30%] shrink-0 bg-white rounded-3xl flex flex-col shadow-lg'>
          {/* wallet activation */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className="flex items-center space-x-3">
                <span className='inline-flex w-10 h-10 items-center justify-center bg-primary-25 rounded-full'>
                  <IoWallet className='text-xl text-primary-300'/>
                </span>
                <div className='inline-flex flex-col leading-4.5'>
                  <h3>Use Credit for this purchase</h3>
                  <p className='text-gray-400'>Available balance: 
                    <span className='ms-1 price-before font-semibold text-primary-400'>500</span>
                  </p>
                </div>
              </div>
              <ToggleSwitch />
            </div>
            <p className='text-gray-400/70'>
              Your wallet balance are not sufficient to pay the order, please select an additional payment method to cover the balance of 
              <span className='ms-1 price-before price-before:text-red-300 text-red-400'>0</span>
            </p>
          </div>

          {/* payment methods */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h3>Choose How to pay</h3>
              {/* <span className='text-primary-400 inline-flex leading-normal cursor-pointer
                  rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ New</span> */}
            </div>
            <ul className='space-y-2' onClick={handleMethodChange}>
              <li className='flex items-center justify-between px-4 border border-gray-200 rounded-2xl
                smooth hover:bg-primary-50 hover:border-primary-300'>
                <label 
                  htmlFor="razor-pay"
                  className='!text-sm flex w-full cursor-pointer py-5 !text-gray-500 !font-bold'
                >
                  <img src={razorpay} alt="razorpay-logo" className='w-25' />
                </label>
                <input type="radio" name="payment-method" id="razor-pay" />
              </li>
              <li className='flex items-center justify-between px-4 border border-gray-200 rounded-2xl
                smooth hover:bg-primary-50 hover:border-primary-300'>
                <label 
                  htmlFor="cod"
                  className='!text-base flex w-full cursor-pointer py-5 !text-gray-500 !font-bold'
                >
                  Cash on delivery
                </label>
                <input type="radio" name="payment-method" id="cod" />
              </li>
            </ul>
          </div>

          {/* addresses */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            {/* billing address */}
            <div>
              <div className='flex items-center justify-between'>
                <h3 className='mb-2 flex items-center'>
                  <GoLocation className='me-2 text-xl'/>
                  Billing Address
                </h3>
                {data?.bill_address ? 
                  (<span 
                    onClick={() => {
                      setIsAddOpen(true);
                      setAddresType('bill')
                    }}
                    className='p-0.5 rounded-lg text-gray-400 cursor-pointer 
                    smooth hover:bg-primary-50 hover:shadow hover:text-black'>
                    <MdEdit className='text-xl' />
                  </span>)
                  :
                  (<span 
                    onClick={() => {
                      setIsAddOpen(true);
                      setAddresType('bill')
                    }}
                    className='text-primary-400 inline-flex leading-normal cursor-pointer
                    rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ Add</span>)
                }
              </div>
              {data?.bill_address ? 
                (<p className='capitalize text-sm text-gray-500 ms-7 flex flex-col space-y-1'>
                  <span>
                    {Object.keys(data.bill_address)
                    .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
                    .map(key => data.bill_address[key]).join(', ')}
                  </span>
                  <span className='inline-flex items-center'>
                    <IoMdCall className='text-lg me-1' />
                    {data.bill_address['mobile']}
                  </span>
                </p>)
                :
                (<p className='text-sm text-gray-300 ms-7'>Not addded</p>)
              }
            </div>

            {/* shipping address */}
            <div>
              <div className='flex items-center justify-between'>
                <h3 className='mb-2 flex items-center'>
                  <GoLocation className='me-2 text-xl'/>
                  Shipping Address
                </h3>
                {data?.ship_address ? 
                  (<span 
                    onClick={() => {
                      setIsAddOpen(true);
                      setAddresType('ship')
                    }}
                    className='p-0.5 rounded-lg text-gray-400 cursor-pointer 
                    smooth hover:bg-primary-50 hover:shadow hover:text-black'>
                    <MdEdit className='text-xl' />
                  </span>)
                  :
                  (<span 
                    onClick={() => {
                      setIsAddOpen(true);
                      setAddresType('ship')
                    }}
                    className='text-primary-400 inline-flex leading-normal cursor-pointer
                    rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ Add</span>)
                }
              </div>
              {data?.ship_address ? 
                (<p className='capitalize text-sm text-gray-500 ms-7 flex flex-col space-y-1'>
                  <span>
                    {Object.keys(data.ship_address)
                    .filter(key => key !== '_id' && key !== 'is_default' && key !== 'mobile')
                    .map(key => data.ship_address[key]).join(', ')}
                  </span>
                  <span className='inline-flex items-center'>
                    <IoMdCall className='text-lg me-1' />
                    {data.ship_address['mobile']}
                  </span>
                </p>)
                :
                (<p className='text-sm text-gray-300 ms-7'>Not addded</p>)
              }
            </div>

            <AddressModal
              isOpen={isAddOpen}
              onClose={() => {
                setIsAddOpen(false);
                setAddresType(null);
              }}
              onChange={handleAddressSelect}
            />

          </div>

          {/* applied coupon */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <h3 className='flex items-center'>Coupon code</h3>
            <div>
              <div className='border border-gray-200 rounded-lg p-3 flex items-center justify-between'>
                <div className='inline-flex items-center space-x-2 '>
                  <RiCoupon3Fill className={clsx('text-lg', couponApplied ? 'text-primary-300' : 'text-gray-400/60')} />
                  <p className={clsx('!leading-normal',
                    couponApplied ? '!text-primary-400 uppercase' : 'text-gray-400'
                  )}>
                    {couponApplied ? 
                      `${couponApplied?.couponCode} | ${couponApplied?.discountType === 'fixed' ? ' ₹' : ''}${couponApplied?.discountValue}${couponApplied?.discountType !== 'fixed' ? '%' : ''} OFF`
                      : "No coupon applied"
                    }
                  </p>
                </div>
                <span
                  onClick={handleRemoveCoupon}
                  className={clsx('leading-normal smooth text-gray-400',
                    couponApplied && 'text-red-300 hover:text-red-500 cursor-pointer'
                  )}
                >{couponApplied && 'Remove'}</span>
              </div>
              {couponApplied && <span className='text-xs text-primary-300'>Coupon code is valid</span>}
            </div>
          </div>
          
          {/* totals */}
          <div className='flex flex-col p-5 space-y-2'>
            <p className='flex items-center justify-between text-base'>
              <span>Subtotal ({cartCount} {cartCount > 1 ? 'items' : 'item'})</span>
              <span className='price-before price-before:!font-normal font-bold'>{Number(subTotal).toFixed(2)}</span>
            </p>
            <div className='flex items-center justify-between text-base'>
              <span>Tax (GST)</span>
              <span className='price-before price-before:!font-normal font-bold'>{Number(cartTax).toFixed(2)}</span>
            </div>
            {discounts > 0 &&
              <div className='flex items-center justify-between text-base'>
                <span>Discount</span>
                <p>-<span className='ms-1 price-before price-before:text-red-300 price-before:!font-normal font-bold text-red-400'>
                  {Number(discounts).toFixed(2)}</span>
                </p>
              </div>
            }
            {roundOff > 0 &&
              <div className='flex items-center justify-between text-base'>
                <span>Round off</span>
                <p>-<span className='ms-1 price-before price-before:text-red-300 price-before:!font-normal font-bold text-red-400'>
                  {Number(roundOff).toFixed(2)}</span>
                </p>
              </div>
            }

            {/* total */}
            <h3 className='mt-4 flex items-center justify-between text-gray-400 text-lg'>
              <span>Total</span>
              <span className='price-before price-before:!font-normal'>{Number(cartTotal).toFixed(2)}</span>
            </h3>
          </div>

          <div className='flex p-5'>
            <button
              onClick={handlePlaceOrder} 
              className='w-full font-bold'>Place Order</button>
          </div>
        </div>

      </div>
      
    </section>
  )
}

export default Checkout