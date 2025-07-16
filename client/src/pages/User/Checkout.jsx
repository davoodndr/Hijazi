import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCartCount, getCartTotal, setAppliedCoupon, setCartTotal, setCouponDiscount } from '../../store/slices/CartSlice';
import { IoWallet } from "react-icons/io5";
import ToggleSwitch  from '../../components/ui/ToggleSwitch'
import { CiDeliveryTruck } from 'react-icons/ci';
import { GoLocation } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { LuHousePlus } from "react-icons/lu";
import razorpay from '../../assets/razorpay-icon.svg'
import { RiCoupon3Fill } from "react-icons/ri";
import { useLocation, useNavigate } from 'react-router';
import { Axios } from '../../utils/AxiosSetup';
import ApiBucket from '../../services/ApiBucket';
import AxiosToast from '../../utils/AxiosToast';
import { setLoading } from '../../store/slices/CommonSlices';
import Alert from '../../components/ui/Alert'
import { capitalize, isValidDatas } from '../../utils/Utils';
import toast from 'react-hot-toast';
import AddressModal from '../../components/user/AddressModal';
import { fetchAddresses } from '../../store/slices/AddressSlice';
import { IoMdCall } from "react-icons/io";
import { addToOrders } from '../../store/slices/OrderSlice';
import { placeOrderAction, processRazorpayAction, verifyRazorpayAction } from '../../services/ApiActions';
import clsx from 'clsx';


function Checkout() {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items, couponDiscount, cartTotal, appliedCoupon } = useSelector(state => state.cart);
  const { addressList } = useSelector(state => state.address);
  const cartCount = useSelector(getCartCount);
  const subTotal = useSelector(getCartTotal);
  const [data, setData] = useState({
    payment_method: null, bill_address: null, ship_address: null
  });
  const [grandTotal, setGrandTotal] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addressType, setAddresType] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses())
    dispatch(setLoading(false))
  },[])

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

      const cartItems = items.map(item => {
        return {
          ...item,
          variant_id: item.product_id === item.id ? null : item.id,
          image: item?.image?.thumb || item?.image?.url,
        }
      })

      let order = {
        cartItems,
        shippingAddress: data.ship_address,
        billingAddress: data.bill_address,
        paymentMethod: data.payment_method,
        paymentResult: {},
        itemsPrice: subTotal,
        taxPrice: 0,
        shippingPrice: 0,
        discount: couponDiscount,
        couponApplied: {
          _id: appliedCoupon._id,
          appliedAmount: couponDiscount
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
    dispatch(setCartTotal(cartTotal + couponDiscount))
    dispatch(setCouponDiscount(0))
    dispatch(setAppliedCoupon(null))
  }

  return (
    <section className='flex-grow w-full bg-gray-50 flex flex-col items-center py-15'>

      <div className='flex w-9/10 space-x-10'>
        {/* left side */}
        <div className="flex flex-col flex-grow">

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
              <span className='ms-1 price-before text-red-400'>{grandTotal}</span>
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
                  <RiCoupon3Fill className={clsx('text-lg', appliedCoupon ? 'text-primary-300' : 'text-gray-400/60')} />
                  <p className={clsx('!leading-normal',
                    appliedCoupon ? '!text-primary-400 uppercase' : 'text-gray-400'
                  )}>
                    {appliedCoupon ? 
                      `${appliedCoupon?.code} | ${appliedCoupon?.discountType === 'fixed' ? ' ₹' : ''}${appliedCoupon?.discountValue}${appliedCoupon?.discountType !== 'fixed' ? '%' : ''} OFF`
                      : "No coupon applied"
                    }
                  </p>
                </div>
                <span
                  onClick={handleRemoveCoupon}
                  className={clsx('leading-normal smooth text-gray-400',
                    appliedCoupon && 'text-red-300 hover:text-red-500 cursor-pointer'
                  )}
                >Remove</span>
              </div>
              {appliedCoupon && <span className='text-xs text-primary-300'>Coupon code is valid</span>}
            </div>
          </div>
          
          {/* totals */}
          <div className='flex flex-col p-5 space-y-2'>
            <p className='text-sm text-orange-400'>Tax included on all single product</p>
            <p className='flex items-center justify-between text-base'>
              <span>Subtotal ({cartCount} {cartCount > 1 ? 'items' : 'item'})</span>
              <span className='price-before price-before:!font-normal font-bold'>{subTotal}</span>
            </p>
            <div className='flex items-center justify-between text-base'>
              <span>Discount</span>
              <p>-<span className='ms-1 price-before price-before:!font-normal font-bold text-red-400'>{couponDiscount}</span></p>
            </div>

            {/* total */}
            <h3 className='mt-4 flex items-center justify-between text-gray-400 text-lg'>
              <span>Total</span>
              <span className='price-before price-before:!font-normal'>{cartTotal}</span>
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