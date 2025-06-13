import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { IoMdArrowRoundBack, IoMdMore } from "react-icons/io";
import { LuArrowUpRight, LuUserRound } from "react-icons/lu";
import { VscCloudDownload } from "react-icons/vsc";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useLocation } from 'react-router';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

function OrderDetail() {

  const location = useLocation();
  const { order } = location.state;
  const { ordersList } = useSelector(state => state.orders);
  const formattedDate = format(new Date(order?.paidAt || order?.createdAt), "dd.MM.yyyy 'at' hh.mm a")
  const isPaid = order?.isPaid ? 'paid' : 'unpaid';
  const isDelivered = order?.isDelivered ? 'delivered' : 'not delivered';

  return (
    <section className='flex-grow w-full flex flex-col items-center py-15 bg-primary-25'>
      <div className='w-9/10 flex flex-col space-y-5'>

        {/* header */}
        <div className='flex items-center justify-between space-x-6'>

          {/* left */}
          <div className='inline-flex items-center space-x-3 capitalize w-full'>
            <h3 className='text-xl !font-extrabold space-x-2'>
              <span className='text-gray-400'>Order</span>
              <span>#{order.order_no}</span>
            </h3>

            <span 
              className={clsx(`font-bold px-2 leading-normal rounded-md text-sm 
              inline-flex items-center h-fit`,
              order?.isPaid ? 'bg-green-200 text-primary-400' 
              : 'bg-gray-200 text-gray-400'
            )}
            >{isPaid}</span>
            <span 
              className={clsx(`leading-normal px-2 rounded-md text-sm 
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
            <ul className='bg-white p-6 space-y-5 shadow-md rounded-3xl'>
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
            <div className='bg-white p-6 shadow-md rounded-3xl'>
              <h3 className='text-lg mb-3'>Payment Summery</h3>
              <div className="flex flex-col">
                <p className='flex items-center justify-between'>
                  <span>Subtotal <span className='text-gray-400'>({order?.cartItems.length} items)</span></span>
                  <span className='font-bold price-before text-base'>{order?.itemsPrice}</span>
                </p>
                {/* <p className='flex items-center justify-between'>
                  <span>Delivery</span>
                  <span className='font-bold price-before text-base'>0</span>
                </p> */}
                <p className='flex items-center justify-between'>
                  <span>Tax <span className='text-gray-400'>5% GST included</span></span>
                  <span className='font-bold price-before text-base'>0</span>
                </p>
                <span className='w-full border-b border-gray-200 my-4'></span>
                <p className='flex items-center justify-between font-bold'>
                  <span className='text-base'>Total Amount</span>
                  <span className='price-before text-lg'>{order?.totalPrice}</span>
                </p>
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

export default OrderDetail