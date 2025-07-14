import clsx from 'clsx'
import React from 'react'

function CouponCardSmall({
  coupon,
  className = "",
  containerClass = ""
}) {
  return (
    <div className={`flex items-center space-x-2 overflow-hidden ${className}`}>
      <div className={`min-w-30 inline-flex flex-col items-center bg-pink-500 
        leading-2 py-1.5 space-y-2 relative
        before:inline-flex before:border-x-8 before:border-gray-100 before:border-dotted
        before:w-[calc(100%+8px)] before:h-full before:absolute top-0 ${containerClass}`}
      >
        <div className='text-sm text-white inline-flex items-center justify-center
          leading-2 space-x-1'>
          <span
            className={clsx('font-extrabold content-before:text-white content-after:text-white',
              coupon?.discountType === 'fixed' ? 
                'content-before content-before:text-[15px]' 
                : 'content-after content-after:content-["%"]'
            )}
          >{coupon?.discountValue}</span>
          <span className='inline-flex'>OFF</span>
        </div>
        {coupon?.discountType === 'percentage' ? 
          <p className='text-gray-200 text-xs leading-1.5'>Up to
            <span className='ms-1 content-before content-before:content-["₹"]
            content-before:text-white content-before:text-[11px]'>
              {coupon?.maxDiscount}
            </span>
          </p>
          :
          <span className='text-gray-200 text-xs leading-1.5'>
            On {coupon?.usageLimit > 1 ? 'purchase' : 'first purchase'}
          </span>
        }
      </div>
    </div>
  )
}

export default CouponCardSmall