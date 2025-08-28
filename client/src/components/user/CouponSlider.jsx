import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import CouponCardSmall from '../ui/CouponCardSmall';
import clsx from 'clsx';

function CouponSliderComponent({
  coupons = [],
  onSelect = () => {},
  activeCoupon
}) {

  const handleCouponSelect = (coupon) => {
    onSelect(coupon)
  }

  return (
    <div className="px-1 py-2 border border-gray-200 rounded-lg">
      <div className={clsx('relative',coupons?.length > 1 ? 'px-4' : 'px-1')}>

        {/* nav buttons */}
        <div className={`swiper-prev absolute -left-1 top-0
          inline-flex h-full items-center cursor-pointer`}>
          <IoIosArrowBack className="text-lg" />
        </div>
        <div className={`swiper-next absolute -right-1 top-0
          inline-flex h-full items-center cursor-pointer`}>
          <IoIosArrowForward className="text-lg" />
        </div>

        <Swiper
          slidesPerView="auto"
          modules={[Navigation]}
          spaceBetween={0}
          freeMode={true}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev'
          }}
        >
          {coupons?.map((coupon, i) => 
            <SwiperSlide key={i}
              onClick={() => handleCouponSelect(coupon)} 
              className='!inline-flex px-0.5 bg-white !w-fit h-fit cursor-pointer'
            >
              <CouponCardSmall
                coupon={coupon}
                containerClass={clsx(
                  activeCoupon?._id !== coupon?._id && "!bg-pink-400"
                )}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  )
}

const CouponSlider = React.memo(CouponSliderComponent);

export default CouponSlider