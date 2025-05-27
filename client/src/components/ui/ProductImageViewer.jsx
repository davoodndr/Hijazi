import React, { useEffect, useRef, useState } from 'react';
import ImageZoomOnHover from '../../lib/image-magnify'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import MyFadeLoader from '../ui/MyFadeLoader'

const ProductImageViewerComponent = ({className = '', images = []}) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(images[0]);
  
  return (
    <div className={className}>
      {/* Main Zoom Image */}
      <div className="mb-4 flex-grow border border-primary-50">
        {activeImage?.thumb ? 
          (<ImageZoomOnHover
            className='group'
            mainImage={{src: activeImage?.thumb, alt: activeImage.public_id}}
            zoomImage={{src: activeImage?.url, alt: activeImage.public_id}}
            distance={30}
            zoomContainerWidth={730}
            zoomContainerHeight={555}
            zoomClass='opacity-0 h-100 border border-gray-300 group-hover:opacity-100
              rounded-xl shadow-lg/30'
            loadingIndicator={
              <div className='w-full h-full relative flex items-center justify-center opacity-50'>
                <MyFadeLoader size={30} radius={5} width={15} height={15} color='var(--color-primary-300)' />
              </div>
            }
          />) 
          :
          (<div className='w-full h-full relative flex items-center justify-center opacity-50'>
            <MyFadeLoader size={30} radius={5} width={15} height={15} color='var(--color-primary-300)' />
          </div>)
        }       
      </div>

      {/* Thumbnails Swiper */}
      <div className={`relative ${images.length > 5 ? 'px-5' : ''} h-[100px] shrink-0`}>

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
          slidesPerView={5}
          modules={[Navigation]}
          spaceBetween={0}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev'
          }}
        >
          {images.map((img, i) => 
            <SwiperSlide key={i}
              onClick={() => {
                setActiveIndex(i);
                setActiveImage(images[i])
              }} 
              className='!inline-flex p-1 bg-white !w-fit h-fit'
            >
              <div className={`inline-flex w-[100px] h-[100px] border border-gray-200 smooth hover:border-primary-300 cursor-pointer
                opacity-60 ${i === activeIndex ? 'opacity-100 border-primary-300' : ''}`}>
                {img?.thumb ?
                  <img src={img?.thumb} alt={img?.public_id} className='bg-gray-200 object-cover w-full' />
                  :
                  (<div className='w-full h-full relative flex items-center justify-center opacity-50'>
                    <MyFadeLoader size={30} radius={5} width={15} height={15} color='var(--color-primary-300)' />
                  </div>)
                }
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

const ProductImageViewer = React.memo(ProductImageViewerComponent)

export default ProductImageViewer;