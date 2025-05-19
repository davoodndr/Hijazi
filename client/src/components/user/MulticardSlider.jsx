import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


function MulticardSlider({cards}) {

  return (
    <section className="relative group">

      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-slider-header-title"><span className="text-primary-400">Popular</span> Categories</h3>
        <div className="relative inline-flex gap-2">
          {/* nav buttons */}
          <div className={`custom-swiper-button-prev nav-btn `}>
            <IoIosArrowBack className="text-lg" />
          </div>
          <div className={`custom-swiper-button-next nav-btn `}>
            <IoIosArrowForward className="text-lg" />
          </div>
        </div>
      </div>

      {/* pagination */}
      <div className="custom-swiper-pagination absolute !bottom-8
        z-100 w-full flex justify-center"></div>

      

      <Swiper
        slidesPerView={7}
        spaceBetween={100}
        speed={800}
        autoplay={{ 
          delay: 3000,
          pauseOnMouseEnter: true
        }}
        pauseOnMouseEnter={true}
        loop={true}
        effect="fade"
        pagination={{
          el: '.custom-swiper-pagination',
          clickable: true,
        }}
        wrapperClass="flex items-center h-full"
        navigation={{
          nextEl: '.custom-swiper-button-next',
          prevEl: '.custom-swiper-button-prev'
        }}
        modules={[Autoplay,  /* Pagination, */Navigation]}
      >
        {cards.map((el, i) =>{

          return (
            <SwiperSlide key={i} className=" bg-white">
              {el}
            </SwiperSlide>
          )
        })}
      </Swiper>
      
    </section>
  )
}

export default MulticardSlider