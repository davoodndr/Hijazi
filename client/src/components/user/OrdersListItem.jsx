import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { format } from 'date-fns'
import clsx from 'clsx';
import { FaRegEye } from "react-icons/fa";
import { MdSimCardDownload } from "react-icons/md";
import SaleInvoice from '../ui/SaleInvoice';

function OrdersListItemComponent({order}) {

  const navigate = useNavigate();
  const cancelledStatuses = ['cancelled', 'refunded', 'returned'];

  const title = order?.itemsCount > 1 ? `${order?.itemsCount} items includes` 
    : order?.name;

  const isPaid = order?.isPaid ? 'Paid' : 'Unpaid';
  const payment = order?.paymentMethod === 'cod' ? 'cash on delivery' : order?.paymentMethod;
  const cancelled = cancelledStatuses.includes(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      key={order?._id}
      className=' relative overflow-hidden'
    >

      {cancelled &&
        <div className="absolute top-[15%] -left-[3%] text-xs z-2">
          <p className='-rotate-45 bg-red-500 text-white leading-4 px-6 py-0.5 shadow-md/20 capitalize'
          >{order?.status}</p>
        </div>
      }

      <div
        className={clsx(`grid grid-cols-[100px_0.75fr_0.5fr_0.5fr_0.5fr_180px_0.5fr]
          items-center space-x-3 p-2 border border-gray-300 rounded-3xl`,
          cancelled ? 'disabled-el pointer-events-auto cursor-auto' : ' bg-white' 
      )}>

        {/* thumb */}
        <div className='w-20 rounded-2xl overflow-hidden'>
          <img src={order?.image} alt={order?.name} />
        </div>

        {/* title */}
        <div className='inline-flex flex-col'>
          <p className='text-xs'><span className='text-gray-400'>Order </span>#{order?.order_no}</p>
          <p className='capitalize font-semibold'>{title}</p>
          <p className='capitalize text-xs'>
            <span className='text-gray-400'>Date: </span>
            <span>{format(new Date(order?.createdAt), 'MMM dd, yyyy')}</span>
          </p>
        </div>

        {/* status */}
        <div className='inline-flex flex-col'>
          <span className='text-xs text-gray-400'>Order Status</span>
          <span className='capitalize'>{order?.status}</span>
        </div>

        {/* total */}
        <div className='inline-flex flex-col'>
          <span className='text-xs text-gray-400'>Order Total</span>
          <span className='price-before'>{order?.cancelledTotal || order?.totalPrice}</span>
        </div>

        {/* paid by */}
        <div className='inline-flex flex-col'>
          <span className='text-xs text-gray-400'>Payment</span>
          <span className='capitalize text-[13px]'>{payment}</span>
        </div>

        {/* ship to */}
        <div className='inline-flex flex-col px-2'>
          <span className='text-xs text-gray-400'>Ship to</span>
          <p className='capitalize text-xs leading-4 line-clamp-3'>
            {Object.values(order?.shippingAddress).join(', ')}
          </p>
        </div>

        {/* actions */}
        <div className='inline-flex flex-col justify-between text-xs space-y-1 capitalize'>

          <div 
            onClick={() => {
              navigate(`/my-order/${order?.order_no}`,{
                state: { order }
              })
            }}
            className='smooth hover:underline hover:text-primary-400
              cursor-pointer inline-flex items-center space-x-1'
          >
            <span><FaRegEye className='text-base' /></span>
            <span>View Order</span>
          </div>

          {/* invoice */}
          <div 
            onClick={() => {
              if(order?.status !== 'cancelled'){
                setIsModalOpen(true)
              }
            }}
            className={clsx(`smooth hover:underline hover:text-primary-400
              cursor-pointer inline-flex items-center space-x-0.5`,
              order?.status === 'cancelled' && 'pointer-events-none'
            )}
          >
            <span><MdSimCardDownload className='text-lg' /></span>
            <span>Invoice</span>
          </div>

        </div>
      </div>

      <SaleInvoice
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order?._id}
      />

    </div>
  )
}

const OrdersListItem = React.memo(OrdersListItemComponent);

export default OrdersListItem