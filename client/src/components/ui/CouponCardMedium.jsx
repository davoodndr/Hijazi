import clsx from 'clsx'
import React from 'react'
import { format } from 'date-fns'

function CouponCardMediumComponent({
  coupon,
  className = "",
  containerClass = ""
}) {

  const cancelled = coupon?.status === 'cancelled';
  
  return (
    <div className={`flex min-w-1/2 min-h-20 ${className}`}>
      <div className='flex w-full relative overflow-hidden'>
        
        {/* left */}
        <div className={clsx(`w-[20%] h-full shrink-0 inline-flex items-center justify-center 
          border-2  rounded-lg bg-white relative z-3`,
          cancelled ? 'border-gray-300/60' : 'border-pink-400'
        )}>
          <div className="-rotate-90 w-fit">
            <p className={clsx('font-bold', cancelled ? 'text-gray-400/60' : 'text-pink-400')}>COUPON</p>
          </div>
          <span className={`absolute -right-1 top-1/2 -translate-y-1/2 
            border-l-5 h-[80%] border-dotted z-3 border-white`}></span>
        </div>
        {/* right */}
        <div className='flex-grow relative'>

          {cancelled && 
            <div className="absolute top-[10%] -left-[12%] text-[11px] z-1">
              <p className='-rotate-45 bg-red-500 text-white leading-3 px-5 pb-0.5 shadow-md/20'
              >Lost</p>
            </div>
          }

          <div
            className={clsx(`absolute inset-0 leading-4
            inline-flex flex-col items-center py-3 px-2 rounded-lg overflow-hidden`,
            cancelled ? 'bg-gray-300 opacity-50' : 'bg-pink-400 text-white'
          )}
          >
            
            <p className='text-[8.5px]'>
              Valid up to - {coupon?.endDate ? format(new Date(coupon?.endDate), 'dd-MM-yyyy') : 'upcoming days'}
            </p>
            <p className='text-2xl space-x-1 flex items-center'>
              <span className={clsx('font-bold',
                cancelled ? '' : 'before:text-white after:text-white',
                coupon?.discountType === 'fixed' ? 
                  'content-before content-before:font-normal' 
                  : 'content-after content-after:content-["%"]'
              )}>{coupon?.discountValue}</span>
              <span className={clsx(cancelled ? '' : 'text-pink-100')}>OFF</span>
            </p>
            <div className={clsx('flex space-x-1 px-1 w-full text-center',
              coupon?.discountType === 'percentage' && coupon?.minPurchase &&  coupon?.maxDiscount> 0 ? 
              'justify-between' : 'justify-center'
            )}>
              
              {coupon?.maxDiscount && coupon?.discountType === 'percentage' &&
                <p className='text-[11px]'>
                  UP TO 
                  <span className='content-before:content-["₹"] font-bold ms-1'>{coupon?.maxDiscount}</span>
                </p>
              }
              {coupon?.minPurchase > 0 && 
                <p className='text-[11px]'>
                  On - <span className={clsx('content-before',
                    cancelled ? '' : 'content-before:text-white'
                  )}
                  >{coupon?.minPurchase}</span>
                </p>
              }
            </div>
          </div>
            
        </div>
      </div>
    </div>
  )
}

const CouponCardMedium = React.memo(CouponCardMediumComponent)

export default CouponCardMedium