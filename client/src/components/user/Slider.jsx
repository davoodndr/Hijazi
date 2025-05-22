import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from "react";


function SliderComponent({slides, className = ''}) {


  return (
    <div className={`relative py-20 ${className}`}>

      {/* pagination */}
      <div className="swiper-pagination absolute !bottom-13
        z-100 w-full flex justify-center"></div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        speed={800}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
        }}
        wrapperClass="flex items-center h-full"
        loop={true}
        effect="fade"
        navigation={{
          nextEl: '.custom-swiper-button-next',
          prevEl: '.custom-swiper-button-prev'
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="peer"
      >
        {slides.map((el, i) =>{

          return (
            <SwiperSlide key={i}
              className="!h-100 bg-white">
              <div className="flex items-center h-9/10">
                <div className="flex-5/12 !h-full inline-flex items-start">
                  <div className="ms-14 h-full inline-flex flex-col space-y-2 justify-center w-[80%]">
                    <h4 className="text-[25px] animate-in-x-100">{el?.title_1}</h4>
                    <h2 className="text-[40px] capitalize animate-in-x-200">{el?.title_2}</h2>
                    <h1 className="text-[60px] !font-bold capitalize animate-in-x-300">{el?.title_3}</h1>
                    <p className="text-[16px] animate-in-x-400 ">{el?.title_4}</p>
                    <div className="flex py-3 px-8 animate-in-x-500">
                      <span className="text-[14px] bg-sky-400 py-2 px-7" > 
                        {el?.button_text} 
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-7/12 ps-5 inline-flex animate-in-x-600">
                  <img className="object-cover !w-11/12" src={el?.image} alt=""/>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* nav buttons */}
      <div className={`custom-swiper-button-next nav-btn absolute -right-7 opacity-0 peer-hover:opacity-100 
        peer-hover:-right-10 !top-[38%] !p-2 !bg-primary-25 hover:!bg-primary-300`}>
          <IoIosArrowForward className="text-2xl" />
        </div>

      <div className={`custom-swiper-button-prev nav-btn absolute -left-7 opacity-0 peer-hover:opacity-100 
        peer-hover:-left-10 !top-[38%] !p-2 !bg-primary-25 hover:!bg-primary-300`}>
          <IoIosArrowBack className="text-2xl" />
        </div>
      
    </div>
  )
}

const Slider = React.memo(SliderComponent);

export default Slider