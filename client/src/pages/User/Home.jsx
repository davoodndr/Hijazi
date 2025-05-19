import React from 'react'
import Slider from '../../components/user/Slider'
import slider_1 from "../../assets/slides/slider-1.png"
import slider_2 from "../../assets/slides/slider-2.png"
import slider_3 from "../../assets/slides/slider-3.png"
import category_1 from "../../assets/categories/category-thumb-1.jpg"
import category_2 from "../../assets/categories/category-thumb-2.jpg"
import category_3 from "../../assets/categories/category-thumb-3.jpg"
import category_4 from "../../assets/categories/category-thumb-4.jpg"
import category_5 from "../../assets/categories/category-thumb-5.jpg"
import category_6 from "../../assets/categories/category-thumb-6.jpg"
import category_7 from "../../assets/categories/category-thumb-7.jpg"
import category_8 from "../../assets/categories/category-thumb-8.jpg"
import banner_1 from "../../assets/banners/banner-4.png"
import banner_2 from "../../assets/banners/banner-1.png"
import banner_3 from "../../assets/banners/banner-2.png"
import banner_4 from "../../assets/banners/banner-3.png"
import MulticardSlider from '../../components/user/MulticardSlider'
import CategoryCard from '../../components/user/CategoryCard'
import { useMemo } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import ProducCardSmall from '../../components/user/ProducCardSmall'

const Home = () => {
  return (
    <div className='flex flex-col w-9/10'>
      {/* slider */}
      <Slider slides={useMemo(() => [
          { image: slider_1, 
            title_1: 'Trade-in offer',
            title_2: 'Supper value deals',
            title_3: 'On all products',
            title_4: 'Save more with coupons & up to 70% off',
            button_text: 'Shop Now'
          },
          { image: slider_2, 
            title_1: 'Hot promotions',
            title_2: 'Fashion Trending',
            title_3: 'Great Collection',
            title_4: 'Save more with coupons & up to 20% off',
            button_text: 'Discover Now'
          },
          { image: slider_3, 
            title_1: 'Upcoming Offer',
            title_2: 'Big Deals From',
            title_3: 'Manufacturer',
            title_4: 'Clothing, Shoes, Bags, Wallets...',
            button_text: 'Shop Now'
          },
        ],[])}
      />

      {/* Banner-1 */}
      <section className="py-4 mb-10">
        <div className="relative">
            <img src={banner_1} alt=""/>
            <div className="absolute top-1/2 z-2 -translate-y-1/2 py-[20px] px-[30px]">
              <h4 className="font-bold mb-[15px] mt-4 !text-primary-400 text-xl">Repair Services</h4>
              <h1 className="font-bold text-5xl leading-1.5 mb-2">We're an Apple <br/>Authorised Service Provider</h1>
              <button className="inline-flex items-center gap-1 !px-5 smooth hover:gap-2">Learn More 
                <IoMdArrowForward className='text-xl' />
              </button>
            </div>
        </div>
      </section>

      {/* popular categories */}
      <MulticardSlider className='mb-10'
        title={
          <h3 className="text-slider-header-title">
            <span className="text-primary-400">Popular</span> Categories
          </h3>
        } 
        cards={useMemo(() => [
          <CategoryCard image={category_1} categoryName='T-Shirt' />,
          <CategoryCard image={category_2} categoryName='Bags' />,
          <CategoryCard image={category_3} categoryName='Sandan' />,
          <CategoryCard image={category_4} categoryName='Scarf Cap' />,
          <CategoryCard image={category_5} categoryName='Shoes' />,
          <CategoryCard image={category_6} categoryName='Pillowcase' />,
          <CategoryCard image={category_7} categoryName='Jumpsuits' />,
          <CategoryCard image={category_8} categoryName='Hats' />,
        ],[])}
      />

      {/* banner-2 */}
      <section className='mb-10 flex gap-7'>
        <div class="flex-4">
          <div class="relative">
            <img src={banner_2} alt=""/>
            <div class="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
              <span className='text-md'>Smart Offer</span>
              <h4 className='text-xl mb-5'>Save 20% on <br/>Woman Bag</h4>
              <a className='inline-flex items-center text-sm cursor-pointer gap-0.5
                smooth hover:text-primary-400 hover:gap-2'
                >Shop Now 
                <IoMdArrowForward className='text-md' />
              </a>
            </div>
          </div>
        </div>
        <div class="flex-4">
          <div class="relative">
            <img src={banner_3} alt=""/>
            <div class="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
              <span className='text-md'>Smart Offer</span>
              <h4 className='text-xl mb-5'>Save 20% on <br/>Woman Bag</h4>
              <a className='inline-flex items-center text-sm cursor-pointer gap-0.5
                smooth hover:text-primary-400 hover:gap-2'
                >Shop Now 
                <IoMdArrowForward className='text-md' />
              </a>
            </div>
          </div>
        </div>
        <div class="flex-4">
          <div class="relative">
            <img src={banner_4} alt=""/>
            <div class="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
              <span className='text-md'>Smart Offer</span>
              <h4 className='text-xl mb-5'>Save 20% on <br/>Woman Bag</h4>
              <a className='inline-flex items-center text-sm cursor-pointer gap-0.5
                smooth hover:text-primary-400 hover:gap-2'
                >Shop Now 
                <IoMdArrowForward className='text-md' />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* new  arrivals */}
      <MulticardSlider className='mb-10'
        title={
          <h3 className="text-slider-header-title">
            <span className="text-primary-400">New</span> Arrivals
          </h3>
        } 
        cards={[
          <ProducCardSmall image={category_1} />,
          <ProducCardSmall image={category_2} />,
          <ProducCardSmall image={category_3} />,
          <ProducCardSmall image={category_4} />,
          <ProducCardSmall image={category_5} />,
          <ProducCardSmall image={category_6} />,
          <ProducCardSmall image={category_7} />,
          <ProducCardSmall image={category_8} />,
        ]}
      />

    </div>
  )
}

export default Home