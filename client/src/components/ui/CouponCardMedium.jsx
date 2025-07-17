import clsx from 'clsx'
import React from 'react'
import { format } from 'date-fns'

function CouponCardMedium({
  coupon,
  className = "",
  containerClass = ""
}) {
  return (
    <div className={`flex min-w-1/2 min-h-20 ${className}`}>
      <div className='flex w-full'>
        {/* left */}
        <div className='w-[20%] h-full shrink-0 inline-flex items-center justify-center 
          border-2 border-pink-400 rounded-lg bg-white'>
          <div className="-rotate-90 w-fit">
            <p className='font-bold text-pink-400'>COUPON</p>
          </div>
        </div>
        {/* right */}
        <div className='flex-grow bg-pink-400 text-white leading-4
          inline-flex flex-col items-center py-3 px-2 rounded-lg relative'
        >
          <span className='absolute -left-1 top-1/2 -translate-y-1/2 
            border-l-5 border-white h-[80%] border-dotted'></span>
          <p className='text-[8.5px]'>Valid up to - {format(new Date(coupon?.expiry), 'dd-MM-yyyy')}</p>
          <p className='text-2xl space-x-1 flex items-center'>
            <span className={clsx('font-bold before:text-white after:text-white',
              coupon?.discountType === 'fixed' ? 
                'content-before content-before:text-[15px]' 
                : 'content-after content-after:content-["%"]'
            )}>{coupon?.discountValue}</span>
            <span className='text-pink-200'>OFF</span>
          </p>
          <div className={clsx('flex space-x-1 px-1 w-full text-center',
            coupon?.minPurchase > 0 ? 'justify-between' : 'justify-center'
          )}>
            <p className='text-[11px]'>UP TO <span className='content-before:content-["₹"] font-bold'>{coupon?.maxDiscount}</span></p>
            {coupon?.minPurchase > 0 && <p className='text-[11px]'>On - {coupon?.minPurchase}</p>}
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default CouponCardMedium