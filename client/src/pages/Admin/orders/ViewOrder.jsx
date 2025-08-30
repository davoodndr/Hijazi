import React, { useEffect, useState } from 'react'
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowForward, IoMdArrowRoundBack, IoMdMore } from "react-icons/io";
import { LuArrowUpRight, LuUserRound } from "react-icons/lu";
import { VscCloudDownload } from "react-icons/vsc";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { HiHome } from 'react-icons/hi2';
import { TbArrowBackUp } from 'react-icons/tb';
import CouponCardMedium from '../../../components/ui/CouponCardMedium';
import { Axios } from '../../../utils/AxiosSetup';
import ApiBucket from '../../../services/ApiBucket';

function ViewOrder() {

  const location = useLocation();
    const navigate = useNavigate();
    const currentOrder = location.state?.order;
    const [order, setOrder] = useState(null);
    const [isPaid, setIsPaid] = useState(null);
    const [isDelivered, setIsDelivered] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);
    const [itemsCount, setItemsCount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [appliedOffers, setAppliedOffers] = useState([]);
    const { ordersList } = useSelector(state => state.orders);
    
  
    useEffect(() => {
      if(currentOrder){
  
        const fetchOrder = async() => {
          try {
            
            const response = await Axios({
              ...ApiBucket.getOrder,
              params: {
                order_id: currentOrder?._id
              }
            });

            if(response.data?.success){
              setupOrder(response.data?.order)
            }
  
          } catch (error) {
            console.log(error)
          }
        }
  
        fetchOrder();
      }
    },[currentOrder]);

  const setupOrder = (data) => {
    const payment = data?.isPaid ? 'paid' : 'unpaid';
    const delivery = data?.isDelivered ? 'delivered' : 'not delivered';
    const dt = data ? 
      format(new Date(data?.paidAt || data?.createdAt), "dd.MM.yyyy 'at' hh.mm a")
      :
      null
    const count = data?.cartItems?.reduce((total, item) => total + item?.quantity, 0);
    const coupon = data?.appliedCoupon;
    const offs = data?.cartItems?.map(item => item?.appliedOffer).filter(Boolean);
    if(data?.cartOffer) offs.push(data?.cartOffer)

    setOrder(data)
    setIsPaid(payment);
    setIsDelivered(delivery);
    setFormattedDate(dt);
    setItemsCount(count);
    setAppliedCoupon(coupon);
    setAppliedOffers(offs)
  }

  return (
    <section className='flex flex-col p-6'>
      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Order Management</h3>
          <span className='sub-title'>View and manage orders</span>
        </div>
        <button 
          onClick={() => navigate('/admin/orders')}
          className='px-4! inline-flex items-center gap-2 !bg-white border !text-primary-400'>
          <TbArrowBackUp size={25} />
          <span>Back</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Orders</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>View Order</span>
        </div>
      </div>

      <div className='flex flex-col space-y-5'>
      
        {/* header */}
        <div className='flex items-center justify-between space-x-6'>

          {/* left */}
          <div className='inline-flex items-center space-x-3 capitalize w-full'>
            <h3 className='text-lg !font-extrabold space-x-2'>
              <span className='text-gray-400'>Order</span>
              <span>#{order?.order_no}</span>
            </h3>

            <span 
              className={clsx(`font-bold px-2 leading-normal rounded-md text-xs 
              inline-flex items-center h-fit`,
              order?.isPaid ? 'bg-green-200 text-primary-400' 
              : 'bg-gray-200 text-gray-400'
            )}
            >{isPaid}</span>
            <span 
              className={clsx(`leading-normal px-2 rounded-md text-xs 
              inline-flex items-center h-fit`,
              order?.isDelivered ? 'bg-green-200 text-primary-400' 
              : 'bg-yellow-200 text-yellow-500'
            )}
            >{isDelivered}</span>
            <span className='border-r border-gray-200 w-px h-6'></span>
            <div className='inline-flex items-center space-x-1'>
              <CiCalendar className='text-xl' />
              <span>{formattedDate}</span>
            </div>

            <div className='ml-auto inline-flex space-x-2'>
              <span className='inline-flex bg-primary-100 p-1 rounded-full cursor-pointer
                smooth hover:shadow-md/30 hover:text-primary-400'>
                <IoMdArrowRoundBack className='text-xl' />
              </span>
              <span className='inline-flex bg-primary-100 p-1 rounded-full cursor-pointer
                smooth hover:shadow-md/30 hover:text-primary-400'>
                <IoMdArrowRoundForward className='text-xl' />
              </span>
            </div>
          </div>

          {/* right */}
          <div className='inline-flex items-stretch space-x-2 justify-end w-[30%] shrink-0'>
            {/* <span className='inline-flex border border-gray-300 items-center px-1 rounded-input-border'>
              <IoMdMore className='text-3xl'/>
            </span> */}
            <button className='inline-flex items-center !px-5 !space-x-2'>
              <VscCloudDownload className='text-xl' />
              <span>Invoice</span>
            </button>
          </div>

        </div>

        {/* content */}
        <div className="flex space-x-6">
          {/* left */}
          <div className="flex flex-col flex-grow space-y-5">

            
            {/* items */}
            <ul className='bg-white p-6 space-y-5 shade rounded-3xl'>
              {order?.cartItems?.map((item, index) => {
                const attributes = item?.attributes ? Object.entries(item.attributes) : [];
                const itemTotal = item.quantity * item.price;
                
                return (
                  <li key={`${item.id}-${index}`} className='grid grid-cols-[2fr_1fr_1fr] not-last:pb-5 not-last:border-b border-gray-200'>
                    <div className='inline-flex space-x-4'>
                      <div className='w-20 h-20 border border-gray-200 rounded-lg overflow-hidden'>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <div>
                          <p className='uppercase text-xs text-gray-400/80 mb-1'>{item.category.name}</p>
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
                                
                                className={clsx(`not-first:point-before point-before:!bg-gray-500 point-before:!p-0.5 
                                point-before:!me-2 !text-sm !text-gray-400`,
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
                )})}
            </ul>

            {/* payment summery */}
            <div className='bg-white p-6 shade rounded-3xl'>
              <h3 className='text-lg mb-3'>Payment Summery</h3>
              <div className="flex flex-col">
                <p className='flex items-center justify-between'>
                  <span>Subtotal <span className='text-gray-400'>{itemsCount} {itemsCount > 1 ? 'items' : 'item'}</span></span>
                  <span className='font-bold price-before text-base'>{Number(order?.itemsPrice).toFixed(2)}</span>
                </p>
                {/* <p className='flex items-center justify-between'>
                  <span>Delivery</span>
                  <span className='font-bold price-before text-base'>0</span>
                </p> */}
                <p className='flex items-center justify-between'>
                  <span>Tax <span className='text-gray-400'>5% GST included</span></span>
                  <span className='font-bold price-before text-base'>{Number(order?.taxAmount).toFixed(2)}</span>
                </p>
                <div className='flex items-center justify-between'>
                  <span>Discount</span>
                  <p>- <span className='font-bold price-before price-before:text-red-300 text-base text-red-400'>{Number(order?.discount).toFixed(2)}</span></p>
                </div>
                {order?.roundOff > 0 &&
                  <div className='flex items-center justify-between'>
                    <span>Round off</span>
                    <p>- <span className='font-bold price-before price-before:text-red-300 text-base text-red-400'>{Number(order?.roundOff).toFixed(2)}</span></p>
                  </div>
                }
                <span className='w-full border-b border-gray-200 my-4'></span>
                <p className='flex items-center justify-between font-bold'>
                  <span className='text-base'>Total Amount</span>
                  <span className='price-before text-lg'>{Number(order?.totalPrice).toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* applied offers */}
            <div className='grid grid-cols-2 bg-white p-6 shade rounded-3xl'>
              <div className='flex flex-col'>
                <h3 className='text-lg mb-3'>Applied Offers</h3>
                <div className="grid grid-cols-2 border 
                  border-gray-300 rounded-2xl p-4 gap-5">
                  
                  {appliedOffers?.length > 0 && 
                    appliedOffers.map(offer => (
                      <div key={offer?._id} className='
                        inline-flex p-0.5 relative h-[88px] w-full'
                      >
                        <div className="absolute rounded-xl border-4 border-dotted border-amber-300 inset-0"></div>
                        <div 
                          className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white
                          px-1 pt-0.5 leading-3 text-[9px] capitalize rounded-t-lg'
                        >{offer?.type} Offer</div>
                        <div className="flex flex-col leading-5 bg-amber-300 rounded-xl p-2 h-full w-full
                          items-center justify-center"
                        >
                          <span className='font-bold text-xs text-black'>{offer?.title}</span>
                          <p className='text-[11px]'>On order above
                            <span className='content-before ml-1'
                            >{offer?.minPurchase}</span>
                          </p>
                          {offer?.endDate &&
                            <p className='text-[10px] font-bold text-amber-700'>Offer ends on  
                              <span className='ml-1'>
                                {format(new Date(offer?.endDate), 'dd-MM-yyyy')}
                              </span>
                            </p>
                          }
                        </div>
                      </div>
                    ))
                  }
                  {appliedCoupon && (
                    <CouponCardMedium coupon={appliedCoupon} />
                  )}                  
                  {!appliedCoupon && !appliedOffers.length && (
                    <span className="text-gray-400">No offers applied</span>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* right */}
          <div className="flex flex-col w-[30%] shrink-0 rounded-3xl shadow-md overflow-hidden h-fit">
            {/* customer details */}
            <div className="flex flex-col bg-white p-6 divide-y divide-gray-200">
              <h3 className='text-lg mb-2 border-0'>Customer</h3>
              
              {/* profile */}
              <div className='flex items-center justify-between capitalize py-3'>
                <div className='inline-flex items-center space-x-2'>
                  <span className='bg-gray-100 p-2.5 rounded-full'>
                    <LuUserRound className='text-xl' />
                  </span>
                  <p className='font-bold'>{order?.billingAddress.name}</p>
                </div>
                <span className='border border-gray-300 rounded-lg p-0.5 smooth
                  hover:scale-105 hover:shadow-md cursor-pointer'>
                  <LuArrowUpRight className='text-lg' />
                </span>
              </div>

              {/* orders link */}
              <div className='flex items-center justify-between capitalize py-3'>
                <div className='inline-flex items-center space-x-2'>
                  <span className='bg-blue-100 p-2.5 rounded-full'>
                    <IoDocumentTextOutline className='text-xl' />
                  </span>
                  <p className='font-bold'>{ordersList?.length} Orders</p>
                </div>
                <span className='border border-gray-300 rounded-lg p-0.5 smooth
                  hover:scale-105 hover:shadow-md cursor-pointer'>
                  <LuArrowUpRight className='text-lg' />
                </span>
              </div>

              {/* contact info */}
              <div className='flex flex-col capitalize py-3'>
                <h3 className='mb-3'>Contact Info</h3>
                <div className='inline-flex items-center space-x-2'>
                  <MdOutlineCall className='text-xl' />
                  <p>{order?.billingAddress?.mobile}</p>
                </div>
                <div className='inline-flex items-center space-x-2'>
                  <MdOutlineCall className='text-xl' />
                  <p>{order?.shippingAddress?.mobile}</p>
                </div>
              </div>

              {/* shipping address */}
              <div className='flex flex-col capitalize py-3'>
                <h3 className='mb-3'>Shipping Address</h3>
                <p className='font-bold'>{order?.shippingAddress.name}</p>
                <p>{order?.shippingAddress.address_line}</p>
                <p>{order?.shippingAddress.landmark}</p>
                <p>{order?.shippingAddress.city}, {order?.shippingAddress.state}, {order?.shippingAddress.country}</p>
                <p>{order?.shippingAddress.pincode}</p>
              </div>

              {/* billing address */}
              <div className='flex flex-col capitalize py-3'>
                <h3 className='mb-3'>Billing Address</h3>
                <p className='font-bold'>{order?.billingAddress.name}</p>
                <p>{order?.billingAddress.address_line}</p>
                <p>{order?.billingAddress.landmark}</p>
                <p>{order?.billingAddress.city}, {order?.billingAddress.state}, {order?.billingAddress.country}</p>
                <p>{order?.billingAddress.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default ViewOrder