import React, { useState } from 'react';
import ImageZoomOnHover from '../../lib/image-magnify'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ProductImageViewerComponent = ({className = ''}) => {
  const images = [
    {
      small: 'categories/category-thumb-1.jpg',
      large: 'categories/category-thumb-1.jpg',
    },
    {
      small: 'categories/category-thumb-2.jpg',
      large: 'categories/category-thumb-2.jpg',
    },
    {
      small: 'categories/category-thumb-3.jpg',
      large: 'categories/category-thumb-3.jpg',
    },
    {
      small: 'categories/category-thumb-4.jpg',
      large: 'categories/category-thumb-4.jpg',
    },
    {
      small: 'categories/category-thumb-5.jpg',
      large: 'categories/category-thumb-5.jpg',
    },
    {
      small: 'categories/category-thumb-6.jpg',
      large: 'categories/category-thumb-6.jpg',
    },
    {
      small: 'categories/category-thumb-7.jpg',
      large: 'categories/category-thumb-7.jpg',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className={className}>
      {/* Main Zoom Image */}
      <div className="mb-4">
        <ImageZoomOnHover
          className='group'
          mainImage={{src: activeImage.small, alt: ''}}
          zoomImage={{src: activeImage.large, alt: ''}}
          distance={65}
          zoomContainerWidth={630}
          zoomContainerHeight={630}
          zoomClass='!top-0 opacity-0 border border-gray-300 group-hover:opacity-100
            rounded-xl shadow-lg/30'
        >        
        
        </ImageZoomOnHover>
      </div>

      {/* Thumbnails Swiper */}
      <div className='relative px-5 py-2'>

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
              className='p-1 bg-white'>
              <div className={`border border-gray-200 smooth hover:border-primary-300 cursor-pointer
                opacity-60 ${i === activeIndex ? 'opacity-100 border-primary-300' : ''}`}>
                <img src={img.small} alt="" className='bg-gray-200' />
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
