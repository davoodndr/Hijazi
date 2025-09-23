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
import clsx from 'clsx';
import { HiHome } from 'react-icons/hi2';
import { TbArrowBackUp, TbCancel } from 'react-icons/tb';
import CouponCardMedium from '../../../components/ui/CouponCardMedium';
import CancelOrderModal from '../../../components/ui/CancelOrderModal';
import toast from 'react-hot-toast';
import { getOrder } from '../../../services/ApiActions';
import CancelOrderSummery from '../../../components/ui/CancelOrderSummery';

function ViewOrder() {

  const location = useLocation();
  const navigate = useNavigate();
  const currentOrder = location.state?.order;
  const ordersList = location.state?.orders;
  const [order, setOrder] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [cancelSummeries, setCancelSummeries] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [originalTotals, setOriginalTotals] = useState(null);

  useEffect(() => {
    if(!currentOrder) navigate("/admin/orders")
  },[])

  useEffect(() => {

    const fetchOrder = async() => {
      try {
        
        const data = await getOrder(currentOrder._id);

        setupData(data)

      } catch (error) {
        console.log(error)
      }
    }

    fetchOrder();

  },[currentOrder]);

  const setupData = (data) => {

    let payMethod = null;
    switch (data?.paymentInfo?.paymentMethod) {
      case 'cod':
        payMethod = 'Cash on delvery';
        break;
      case 'razor-pay':
        payMethod = 'Razorpay';
        break;
      default: payMethod = 'Wallet'
        break;
    }
    
    const payInfo = {
      ...data?.paymentInfo,
      paymentMethod: payMethod
    }

    const offs = [], cancelInfos = [];
    let count = 0, oCount = 0, oSubTotal = 0, oTax = 0, oDisc = 0, oRawTotal = 0;
    let cancelledTotal = 0, cancelledTax = 0, cancelledDisc = 0, cancelledCount = 0;
    let dt = data && format(new Date(data?.createdAt), "dd.MM.yyyy 'at' hh.mm a");
    let cancelled = false;
    
    if(data?.cartOffer) offs.push(data?.cartOffer);
    if(data?.appliedCoupon) offs.push(data?.appliedCoupon);

    for(const item of data?.cartItems){

      // original count
      oCount += item?.quantity;
      oSubTotal += item?.price * item?.quantity;
      oTax += item?.tax;
      oDisc += item?.appliedOffer?.appliedAmount || 0;

      if(item?.status === 'cancelled'){
        cancelledCount += item?.quantity;
        cancelledTax += item?.tax
        cancelledDisc += item?.appliedOffer?.appliedAmount
        cancelledTotal += item?.price * item?.quantity;
        cancelled = true;

        if(item?.cancelSummery){
        
          const c = item?.cancelSummery?.appliedCoupon;
          const cartOff = item?.cancelSummery?.cartOffer;
          
          if(c) offs?.push(c);
          if(cartOff) offs?.push(cartOff);
          oDisc += ((c?.appliedAmount || 0) + (cartOff?.appliedAmount || 0));

          const summ = {
            ...item?.cancelSummery,
            quantity: item?.quantity,
            price: item?.price,
            tax: item?.tax,
            discount: item?.appliedOffer?.appliedAmount || 0,
            itemName: item?.name
          }
          cancelInfos.push(summ)
        }

      }else{
        count += item?.quantity;
      }
      if(item?.appliedOffer) offs?.push(item?.appliedOffer)
      

    }
    
    oRawTotal = oSubTotal + oTax - oDisc;
    const originals = {
      count: oCount,
      subTotal: oSubTotal,
      tax: oTax,
      discount: oDisc,
      roundOff: oRawTotal - Math.floor(oRawTotal),
      total: Math.floor(oRawTotal)
    }

    setOrder(data)
    setFormattedDate(dt);
    setItemsCount(count);
    setAppliedOffers(offs)
    setPaymentInfo(payInfo);
    if(cancelled){
      setOriginalTotals(originals)
      setCancelSummeries(cancelInfos);
    }
  }

  const resetDatas = () => {
    setOrder(null)
    setIsPaid(null)
    setFormattedDate(null)
    setItemsCount(0)
    setCancelSummeries([])
    setPaymentInfo(null)
    setAppliedOffers([])
    setOriginalTotals(null)
  }

  /* handling cancel order */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelItem, setCancelItem] = useState(null);

  const handleCancelOrderPop = (item) => {
    if(order?.status === 'pending'){
      if(item) setCancelItem(item)
      setIsModalOpen(true);
    }else{
      toast.error("You can cancel order only on pending state", {position: "top-center"})
    }
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

            <p 
              className={clsx(`font-bold px-2 py-1 rounded-md text-sm 
              inline-flex leading-4`,
              paymentInfo?.isPaid ? 'bg-green-200 text-primary-400' 
              : 'bg-gray-200 text-gray-400'
            )}
            >{paymentInfo?.isPaid ? 'Paid' : 'Unpaid'}</p>
            <p 
              className={clsx(`px-2 py-1 rounded-md text-sm inline-flex leading-4`,
              order?.status === "pending" && 'bg-yellow-200 text-orange-500',
              order?.isDelivered && 'bg-green-200 text-primary-400',
              order?.status === "cancelled" && 'bg-red-200 text-red-500'
            )}
            >{order?.status}</p>
            <span className='border-r border-gray-200 w-px h-6'></span>
            <div className={clsx('inline-flex items-center space-x-1',
              order?.status === 'cancelled' && 'text-red-400'
            )}>
              <CiCalendar className='text-xl' />
              <span>{formattedDate}</span>
            </div>

            {/* navigation buttons */}
            <div className='ml-auto inline-flex space-x-2'>
              {/* prev */}
              <span 
                onClick={() => {
                  const index = ordersList?.findIndex(el => el._id === order._id);
                  if(index > 0) {
                    resetDatas()
                    const foundOrder = ordersList.find((_,i) => i === index - 1);
                    navigate(`/admin/orders/view-order/${foundOrder?.order_no}`, {
                      state: { order: foundOrder, orders: ordersList }
                    })
                  }else{
                    toast.error("No more order found!", { position: 'top-center'})
                  }
                }}
                className='inline-flex bg-primary-100 p-1 rounded-full cursor-pointer
                smooth hover:shadow-md/30 hover:text-primary-400'>
                <IoMdArrowRoundBack className='text-xl' />
              </span>
              {/* next */}
              <span 
                onClick={() => {
                  const index = ordersList?.findIndex(el => el._id === order._id);
                  if(index < ordersList.length - 1) {
                    resetDatas()
                    const foundOrder = ordersList.find((_,i) => i === index + 1);
                    navigate(`/admin/orders/view-order/${foundOrder?.order_no}`, {
                      state: { order: foundOrder, orders: ordersList }
                    })
                  }else{
                    toast.error("No more order found!", { position: 'top-center'})
                  }
                }}
                className='inline-flex bg-primary-100 p-1 rounded-full cursor-pointer
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
            <div 
              onClick={() => handleCancelOrderPop(null)}
              className='button px-5 space-x-2 border-gray-300 text-gray-400 hover-shade hover:border-red-400 hover:text-red-400'>
              <TbCancel className='text-xl' />
              <span>Cancel</span>
            </div>
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
            <ul className='bg-white shade rounded-3xl overflow-hidden divide-y divide-theme-divider'>
              {order?.cartItems?.map((item, index) => {
                const attributes = item?.attributes ? Object.entries(item?.attributes) : [];
                const itemTotal = item?.quantity * item.price;
                
                return (
                  <li 
                    key={`${item?.id}-${index}`} 
                    className='relative overflow-hidden'
                  >
                    {item?.status === 'cancelled' &&
                      <div className="absolute top-[12%] -left-[3%] text-xs z-2">
                        <p className='-rotate-45 bg-red-500 text-white leading-4 px-6 py-0.5 shadow-md/20'
                        >Cancelled</p>
                      </div>
                    }
                    <div
                      className={clsx('grid grid-cols-[2fr_1fr_1fr_0.5fr] p-5 not-last:border-b border-gray-200',
                        item?.status === 'cancelled' && 'disabled-el'
                      )}
                    >
                      <div className='inline-flex space-x-4'>
                        <div className='w-20 h-20 border border-gray-200 rounded-lg overflow-hidden'>
                          <img src={item?.image} alt={item?.name} />
                        </div>
                        <div className='flex flex-col justify-center'>
                          <div>
                            <p className='uppercase text-xs text-gray-400/80 mb-1'>{item?.category.name}</p>
                            <h3 className='capitalize mb-1.5'>{item?.name}</h3>
                          </div>

                          {/* attributes */}
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
                                  
                                  className={clsx(`not-first:point-before point-before:!bg-gray-400/80 point-before:!p-0.5 
                                  point-before:!me-2 !text-sm !text-gray-500`,
                                  name === 'size' ? 'uppercase' : 'capitalize'
                                )}
                                >{val}</li>)
                              
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className='inline-flex space-x-2 items-center justify-end relative
                        before:content-["rate"] before:capitalize before:absolute before:top-2 before:text-gray-300'>
                        <h3 className='price-before price-before:font-normal'>{item?.price}</h3>
                        <p className='text-gray-500'>x</p>
                        <h3>{item?.quantity}</h3>
                      </div>
                      <div className='inline-flex flex-col justify-center items-end capitalize relative
                        before:content-["total"] before:absolute before:top-2 before:text-gray-300'>
                        <h3 className='price-before price-before:font-normal price-before:text-sm text-lg items-start'>{itemTotal}</h3>
                      </div>
                      <div className='inline-flex items-center justify-end'>
                        <span
                          onClick={() => {
                            if(item?.status !== 'cancelled'){
                              handleCancelOrderPop(item)
                            }
                          }} 
                          className={clsx(`text-xs bg-gray-100 px-3 py-1 rounded-lg cursor-pointer
                            smooth hover:shadow-md hover:bg-red-300 hover:text-white`,
                            item?.status === 'cancelled' && 'disabled-el'
                          )}
                        >Cancel</span>
                      </div>
                    </div>
                  </li>
                )})}
            </ul>

            {/* cancel summery */}
            {originalTotals && (
              <CancelOrderSummery
                cancelSummeries={cancelSummeries}
                originals={originalTotals}
              />
            )}

            {/* payment summery */}
            <div className='grid grid-cols-2 space-x-6 bg-white p-6 shade rounded-3xl'>

              {/* payment method */}
              <div className="flex flex-col">
                <h3 className='text-lg mb-3'>Payment Info</h3>
                <div className="p-4 border w-fit border-gray-300 rounded-xl">
                  <p className='inline-flex space-x-3 items-center'>
                    <span className='text-sm text-gray-400'>Method:</span>
                    <span>{paymentInfo?.paymentMethod}</span>
                  </p>
                </div>
              </div>
              
              {/* paymment summery */}
              <div className="flex flex-col">
                  <h3 className='text-lg mb-3'>Payment Summery</h3>

                  <div className="flex flex-col">
                    <div className='flex items-center justify-between'>
                      <p>Subtotal
                        <span className='ml-1 text-gray-400'>
                          ({itemsCount} {itemsCount > 1 ? 'items' : 'item'})
                        </span>
                      </p>
                      <span className='font-bold price-before text-base'>
                        {Number(order?.subTotal || 0).toFixed(2)}
                      </span>
                    </div>
                    {/* <p className='flex items-center justify-between'>
                      <span>Delivery</span>
                      <span className='font-bold price-before text-base'>0</span>
                    </p> */}

                    <p className='flex items-center justify-between'>
                      <span>Tax <span className='text-gray-400'>(5% GST included)</span></span>
                      <span className='font-bold price-before text-base'>
                        {Number(order?.taxAmount || 0).toFixed(2)}
                      </span>
                    </p>

                    {order?.discount > 0 &&
                      <div className='flex items-center justify-between'>
                        <span>Discount</span>
                        <p>- <span className='font-bold price-before price-before:text-red-300 text-base text-red-400'>
                          {Number(order?.discount).toFixed(2)}
                        </span></p>
                      </div>
                    }

                    {order?.roundOff > 0 &&
                      <div className='flex items-center justify-between'>
                        <span>Round off</span>
                        <p>- <span
                          className='font-bold price-before price-before:text-red-300 text-base text-red-400'>
                          {Number(order?.roundOff).toFixed(2)}</span>
                        </p>
                      </div>
                    }
                    
                    <span className='w-full border-b border-gray-200 my-4'></span>
                    <p className='flex items-center justify-between font-bold'>
                      <span className='text-base'>Net {paymentInfo?.isPaid ? 'Paid' : 'Payable'} Amount</span>
                      <span className='price-before text-lg'>
                        {Number(order?.totalPrice || 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
            </div>

            {/* applied offers */}
            <div className='grid grid-cols-2 bg-white p-6 shade rounded-3xl'>
              <div className='flex flex-col'>
                <h3 className='text-lg mb-3'>Applied Offers</h3>
                <div className="grid grid-cols-2 border 
                  border-gray-300 rounded-2xl p-4 gap-5">
                  
                  {appliedOffers?.length > 0 && 
                    appliedOffers.map(offer => {

                      const cancelled = offer?.status === 'cancelled';
                      
                      if(offer?.type === 'coupon'){
                        return (
                          <CouponCardMedium
                            key={offer?._id}
                            coupon={offer}
                          />
                        )
                      }
                      
                      return (
                        <div key={offer?._id} 
                          className='inline-flex p-0.5 relative h-[88px] w-full overflow-hidden'
                        >
                          {cancelled && 
                            <div className="absolute top-[10%] -left-[8%] text-[11px] z-2">
                              <p className='-rotate-45 bg-red-500 text-white leading-3 px-5 pb-0.5 shadow-md/20'
                              >Lost</p>
                            </div>
                          }

                          <div className={clsx("absolute rounded-xl border-4 border-dotted inset-0",
                            cancelled ? "border-gray-300" : "border-amber-300"
                          )}></div>

                          <div 
                            className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white
                            px-1 pt-0.5 leading-3 text-[9px] capitalize rounded-t-lg z-1'
                          >{offer?.type} Offer</div>

                          <div className={clsx(`flex flex-col leading-5 rounded-xl p-2 h-full w-full
                            items-center justify-center`,
                            cancelled ? 'disabled-el' : 'bg-amber-300'
                          )}>
                            <span className={clsx('font-bold text-xs',
                              cancelled ? '' : 'text-black'
                            )}>{offer?.title}</span>

                            <p className='text-[11px]'>On order above
                              <span className='content-before ml-1'
                              >{offer?.minPurchase}</span>
                            </p>
                            {offer?.endDate &&
                              <p className={clsx('text-[10px] font-bold',
                                cancelled ? "" : "text-amber-700"
                              )}>Offer ends on  
                                <span className='ml-1'>
                                  {format(new Date(offer?.endDate), 'dd-MM-yyyy')}
                                </span>
                              </p>
                            }
                          </div>
                        </div>
                      )
                    })
                  }                  
                  {!appliedOffers?.length > 0 && (
                    <span className="text-gray-400">No offers applied</span>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          {/* right */}
          <div className="flex flex-col w-[30%] shrink-0 rounded-3xl shade overflow-hidden h-fit">
            {/* customer details */}
            <div className="flex flex-col bg-white p-6 divide-y divide-theme-divider">
              <h3 className='text-lg mb-2 border-0'>Customer</h3>
              
              {/* profile */}
              <div className='flex items-center justify-between capitalize py-3'>
                <div className='inline-flex items-center space-x-2'>
                  <span className='bg-gray-100 p-2.5 rounded-full'>
                    <LuUserRound className='text-xl' />
                  </span>
                  <p className='font-bold'>{order?.billingAddress?.name}</p>
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
                <p className='font-bold'>{order?.shippingAddress?.name}</p>
                <p>{order?.shippingAddress?.address_line}</p>
                <p>{order?.shippingAddress?.landmark}</p>
                <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state}, {order?.shippingAddress?.country}</p>
                <p>{order?.shippingAddress?.pincode}</p>
              </div>

              {/* billing address */}
              <div className='flex flex-col capitalize py-3'>
                <h3 className='mb-3'>Billing Address</h3>
                <p className='font-bold'>{order?.billingAddress?.name}</p>
                <p>{order?.billingAddress?.address_line}</p>
                <p>{order?.billingAddress?.landmark}</p>
                <p>{order?.billingAddress?.city}, {order?.billingAddress?.state}, {order?.billingAddress?.country}</p>
                <p>{order?.billingAddress?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        <CancelOrderModal
          onSubmit={(orderData) => {
            setOrder(orderData)
            setIsModalOpen(false);
            if(cancelItem) setCancelItem(null);
          }}
          isOpen={isModalOpen}
          order={{_id:order?._id}}
          item={cancelItem ? {_id: cancelItem?._id}: null}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      </div>

    </section>
  )
}

export default ViewOrder