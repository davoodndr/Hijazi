import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

function CancelOrderSummeryComponent({
  cancelSummeries = [],
  originals
}) {

  const [refund, setRefund] = useState(null);
  const [totalRefunded, setTotalRefunded] = useState(null);

  useEffect(() => {

    let refunds = 0, refunded = 0;

    for(const item of cancelSummeries){
      const itemsPrice = item?.price * item?.quantity + item?.tax;
      const itemDisc = item?.discount;
      const couponDiscount = item?.appliedCoupon?.appliedAmount || 0;
      const offDiscount = item?.cartOffer?.appliedAmount || 0;

      refunds += itemsPrice - (itemDisc + couponDiscount + offDiscount);
      if(item?.refundStatus === 'refunded') 
        refunded += itemsPrice - (itemDisc + couponDiscount + offDiscount);
    }

    const roundedRefund = Math.floor(refunds);
    const roundedRefunded = Math.floor(refunded);
    setRefund({total: roundedRefund, roundOff: refunds - roundedRefund});
    setTotalRefunded({total: roundedRefunded, roundOff: refunded - roundedRefunded});

  },[cancelSummeries])

  return (
    <div className="flex flex-col bg-white p-6 shade rounded-3xl">
      <h3 className='text-lg mb-3'>Cancel Summery</h3>

      {/* original totals */}
      <div className='flex flex-col border-b border-theme-divider'>
        <div className='flex items-center justify-between'>
          <p>Original Subtotal
            <span className='ml-1 text-gray-400'>
              ({originals?.count} {originals?.count > 1 ? 'items' : 'item'})
            </span>
          </p>
          <span className='font-bold price-before text-base'>
            {Number(originals?.subTotal || 0).toFixed(2)}
          </span>
        </div>

        <p className='flex items-center justify-between'>
          <span>Tax <span className='text-gray-400'>(5% GST included)</span></span>
          <span className='font-bold price-before text-base'>
            {Number(originals?.tax || 0).toFixed(2)}
          </span>
        </p>

        {originals?.discount > 0 &&
          <div className='flex items-center justify-between'>
            <span>Discount</span>
            <p>- <span className='font-bold price-before price-before:text-red-300 text-base text-red-400'>
              {Number(originals?.discount).toFixed(2)}
            </span></p>
          </div>
        }

        {originals?.roundOff > 0 &&
          <div className='flex items-center justify-between'>
            <span>Round off</span>
            <p>- <span
              className='font-bold price-before price-before:text-red-300 text-base text-red-400'>
              {Number(originals?.roundOff).toFixed(2)}</span>
            </p>
          </div>
        }
        
      </div>

      <div className='flex items-center justify-between mb-5'>
        <h3>Total</h3>
        <p className='price-before text-lg font-bold'>{Number(originals?.total).toFixed(2)}</p>
      </div>

      {/* cancelled items */}
      <ul className='flex flex-col space-y-2 mb-3'>
        {cancelSummeries?.length > 0 &&
          cancelSummeries?.map((item, i) => {
            
            const itemTotal = item?.price * item?.quantity + item?.tax - item?.discount;
            const coupon = item?.appliedCoupon;
            const cartOff = item?.cartOffer;
            
            return(
              <li 
                key={item?._id}
                className='flex flex-col'
              >
                <div className='flex items-center justify-between'>
                  <div className='inline-flex items-center leading-4'>
                    <div className='flex items-center point-before point-before:me-4 text-sm'>
                      <span className='text-orange-400'>Cancelled:</span>
                      <p className='inline-block max-w-45 truncate ml-2 capitalize'>{item?.itemName}</p>
                    </div>
                    <span className='text-gray-400/60 mx-1'>|</span>
                    <span>{item?.price} x {item?.quantity}</span>
                    <span className='text-gray-400/60 mx-1'>|</span>
                    <p className='inline'>
                      +{item?.tax}<span className='mx-1 text-gray-400'>(tax)</span>
                    </p>
                    {item?.discount > 0 &&
                      <>
                        <span className='text-gray-400/60 mx-1'>|</span>
                        <p className='inline'>
                          -{item?.discount}<span className='mx-1 text-gray-400'>(item offer)</span>
                        </p>
                      </>
                    }
                  </div>
                  <span className='price-before text-base font-bold'>
                    {Number(itemTotal).toFixed(2)}
                  </span>
                </div>
                {coupon &&
                  <div className='flex items-center justify-between'>
                    <span className='text-orange-400 ml-6'>Removed coupon</span>
                    <p>- <span className='price-before text-red-400 text-base font-bold'>
                        {Number(coupon?.appliedAmount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                }
                {cartOff &&
                  <div className='flex items-center justify-between'>
                    <span className='text-orange-400 ml-6'>Removed cart offer</span>
                    <p>- <span className='price-before text-red-400 text-base font-bold'>
                        {Number(cartOff?.appliedAmount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                }
                <div className='flex items-center space-x-2 ml-6'>
                  <p>Total - </p>
                  <p className='price-before font-bold'>
                    {Number(itemTotal - (coupon?.appliedAmount || 0) - (cartOff?.appliedAmount || 0)).toFixed(2)}
                  </p>
                  <p className='capitalize text-xs text-gray-400'>({item?.refundStatus})</p>
                </div>
              </li>
            )
          })
        }
      </ul>

      {/* totals */}
      <hr className='border-theme-divider mt-2' />
      {refund?.roundOff > 0 &&
        <div className='flex items-center justify-between'>
          <span className='text-gray-500 ml-6'>Roundoff</span>
          <p>- <span className='price-before text-red-400 text-base font-bold'>
              {Number(refund?.roundOff).toFixed(2)}
            </span>
          </p>
        </div>
      }
      <div className='flex items-center justify-between ml-6'>
        <h3>Net cancelled amount</h3>
        <p className='price-before text-lg font-bold'>
          {Number(refund?.total || 0).toFixed(2)}
        </p>
      </div>
      {totalRefunded?.total > 0 &&
        <>
          <div className='flex items-center justify-between ml-6'>
            <p className='bg-primary-300 text-white px-2 rounded-2xl rounded-l-none'
            >Refunded</p>
            <p>- <span className='price-before text-base font-bold text-white bg-primary-300
              px-1 rounded-2xl rounded-r-none price-before:text-gray-200'>
              {Number(totalRefunded?.total).toFixed(2)}</span>
            </p>
          </div>
          <hr className='border-theme-divider mt-2' />
          <div className='flex items-center justify-between ml-6'>
            <h3>Balance</h3>
            <p className='price-before text-lg font-bold'>
              {Number(refund?.total - totalRefunded?.total).toFixed(2)}
            </p>
          </div>
        </>
      }

    </div>
  )
}

const CancelOrderSummery = React.memo(CancelOrderSummeryComponent);

export default CancelOrderSummery