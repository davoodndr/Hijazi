import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// @ts-check
import React from "react";

/**
 * @typedef {Object} MultiCardSliderSettings
 * @property {number} [cardCount] - Number of cards in view
 * @property {number} [space] - Space between cards
 * @property {React.ReactNode[]} cards - Cards list
 * @property {React.ReactNode[] | string} [title] - Title for Slider
 * @property {string} [className] - Classes for Slider
 * @property {string} [slideClass] - Classes for single slide
 * @property {string} [titleClass] - Classes for title wrapper
 * @property {string} [buttonClass] - Classes for button wrapper
 * @property {boolean} [showButtons] - Show/hide navigation buttons
 */

/**
 * @param {MultiCardSliderSettings} props
 */
function MulticardSliderComponent ({
  cardCount = 7, space = 100, cards, title, 
  className = '', slideClass = '', titleClass = '', buttonClass = '',
  showButtons = true
}){

  return (
    <div className={`relative group ${className}`}>

      <div className={`flex items-center justify-between ${titleClass}`}>
        {title}
        {showButtons && 
          <div className={`relative inline-flex gap-2 ${buttonClass}`}>
            {/* nav buttons */}
            <div className={`custom-swiper-button-prev nav-btn `}>
              <IoIosArrowBack className="text-lg" />
            </div>
            <div className={`custom-swiper-button-next nav-btn `}>
              <IoIosArrowForward className="text-lg" />
            </div>
          </div>
        }
      </div>

      {/* pagination */}
      <div className="custom-swiper-pagination absolute !bottom-8
        z-100 w-full flex justify-center"></div>

      <Swiper
        slidesPerView={cardCount}
        spaceBetween={space}
        speed={800}
        autoplay={{ 
          delay: 3000,
          pauseOnMouseEnter: true
        }}
        loop={true}
        pagination={{
          el: '.custom-swiper-pagination',
          clickable: true,
        }}
        wrapperClass="flex items-center h-full my-5"
        navigation={{
          nextEl: '.custom-swiper-button-next',
          prevEl: '.custom-swiper-button-prev'
        }}
        modules={[Autoplay, Navigation]}
      >
        {cards.map((el, i) =>{

          return (
            <SwiperSlide key={i} className={slideClass}>
              {el}
            </SwiperSlide>
          )
        })}
      </Swiper>
      
    </div>
  )
};

const MulticardSlider = React.memo(MulticardSliderComponent)

export default MulticardSlider