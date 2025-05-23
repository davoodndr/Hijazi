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
import banner_9 from "../../assets/banners/banner-9.jpg"
import banner_10 from "../../assets/banners/banner-10.jpg"
import brand_1 from "../../assets/brands/brand-1.png"
import brand_2 from "../../assets/brands/brand-2.png"
import brand_3 from "../../assets/brands/brand-3.png"
import brand_4 from "../../assets/brands/brand-4.png"
import brand_5 from "../../assets/brands/brand-5.png"
import brand_6 from "../../assets/brands/brand-6.png"
import brand_7 from "../../assets/brands/brand-7.png"
import brand_8 from "../../assets/brands/brand-8.png"
import MulticardSlider from '../../components/user/MulticardSlider'
import CategoryCard from '../../components/user/CategoryCard'
import { useMemo } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import ProducCardFrameless from '../../components/user/ProducCardFrameless.jsx'
import AnimateAppear from '../../components/user/AnimateAppear'
import BrandCard from '../../components/user/BrandCard'
import ProducCardSmall from '../../components/user/ProducCardSmall.jsx'
import ProducCard from '../../components/user/ProductCard.jsx'
import { Link } from 'react-router'
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setLoading } from '../../store/slices/CommonSlices.jsx'
import StarRating from '../../components/user/StarRating.jsx'

function HomeComponent(){

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setLoading(false))
  },[])

  return (
    <>
      <div className='flex flex-col w-9/10'>
        {/* slider */}
        <AnimateAppear>
          <Slider 
            slides={useMemo(() => [
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
        </AnimateAppear>

        {/* popular categories */}
        <AnimateAppear>
          <MulticardSlider className='mb-10'
            space={100}
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
        </AnimateAppear>

        {/* Banner-1 */}
        <AnimateAppear className='py-4 mb-10'>
          <div className="relative">
            <img src={banner_1} loading='lazy' alt=""/>
            <div className="absolute top-1/2 z-2 -translate-y-1/2 py-[20px] px-[30px]">
              <h4 className="font-bold mb-[15px] mt-4 !text-primary-400 text-xl">Repair Services</h4>
              <h1 className="font-bold text-5xl leading-1.5 mb-2">We're an Apple <br/>Authorised Service Provider</h1>
              <button className="inline-flex items-center gap-1 !px-5 smooth hover:gap-2">Learn More 
                <IoMdArrowForward className='text-xl' />
              </button>
            </div>
          </div>
        </AnimateAppear>

        {/* featured products */}
        <div className='flex flex-col mb-15'>
          <div className="flex w-full justify-between mb-5">
            <h3 className="text-slider-header-title">
              <span className="text-primary-400">Featured</span> Products
            </h3>

            <Link to='/collections'
              className='inline-flex gap-1 items-center text-gray-400 smooth
              hover:text-primary-400 point-before point-before:!p-0.75 underline'
            >
              <span className='font-semibold'>View All</span>
              <MdOutlineKeyboardDoubleArrowRight className='text-xl' />
            </Link>
          </div>
        
          <div className="flex flex-col items-center w-full bg-primary-25 py-10">
            
            <div className='grid grid-cols-4 gap-8 w-[92%]'>
              <ProducCard image={category_1} />
              <ProducCard image={category_2} />
              <ProducCard image={category_3} />
              <ProducCard image={category_4} />
              <ProducCard image={category_1} />
              <ProducCard image={category_2} />
              <ProducCard image={category_3} />
              <ProducCard image={category_4} />
            </div>
          </div>
        </div>

        {/* banner-2 */}
        <AnimateAppear>
          <div className='mb-10 flex gap-7'>
            <div className="flex-4">
              <div className="relative">
                <img src={banner_2} loading='lazy' alt=""/>
                <div className="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
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
            <div className="flex-4">
              <div className="relative">
                <img src={banner_3} loading='lazy' alt=""/>
                <div className="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
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
            <div className="flex-4">
              <div className="relative">
                <img src={banner_4} loading='lazy' alt=""/>
                <div className="absolute z-2 top-1/2 -translate-y-1/2 py-3 px-8">
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
          </div>
        </AnimateAppear>

        {/* new arrivals */}
        <AnimateAppear>
          <MulticardSlider className='mb-10'
            space={140}
            title={
              <h3 className="text-slider-header-title">
                <span className="text-primary-400">New</span> Arrivals
              </h3>
            } 
            cards={[
              <ProducCardFrameless image={category_1} />,
              <ProducCardFrameless image={category_2} />,
              <ProducCardFrameless image={category_3} />,
              <ProducCardFrameless image={category_4} />,
              <ProducCardFrameless image={category_5} />,
              <ProducCardFrameless image={category_6} />,
              <ProducCardFrameless image={category_7} />,
              <ProducCardFrameless image={category_8} />,
            ]}
          />
        </AnimateAppear>

        {/* brands */}
        <AnimateAppear>
          <MulticardSlider className='mb-10'
            space={60}
            title={
              <h3 className="text-slider-header-title">
                <span className="text-primary-400">Featured</span> Brands
              </h3>
            } 
            cards={useMemo(() => [
              <BrandCard image={brand_1} />,
              <BrandCard image={brand_2} />,
              <BrandCard image={brand_3} />,
              <BrandCard image={brand_4} />,
              <BrandCard image={brand_5} />,
              <BrandCard image={brand_6} />,
              <BrandCard image={brand_7} />,
              <BrandCard image={brand_8} />,
            ],[])}
          />
        </AnimateAppear>    
      </div>

      {/* monthly best sell*/}
      <AnimateAppear className='w-full'>
        <div className='flex w-full justify-center bg-gray-100 py-15 mb-10'>
          <div className="flex flex-col w-10/12">
            <h3 className="text-slider-header-title mb-8">
              <span className="text-primary-400">Monthly</span> Best Sell
            </h3>

            <div className="flex gap-3">

              <div className="w-[25%] h-[338px] inline-flex rounded-4xl overflow-hidden relative">
                <div className='absolute top-[40%] left-5 -translate-y-1/2 
                  inline-flex flex-col max-w-[40%]'>
                  <span className='text-gray-400 mb-1'>Womans Area</span>
                  <h3 className='text-lg mb-4 smooth hover:translate-x-2 !text-white'>Save 17% on All Items</h3>

                  <div className='text-primary-300 inline-flex items-center gap-1
                    smooth hover:gap-3 cursor-pointer'>
                    <span>Shop Now</span>
                    <IoMdArrowForward />
                  </div>
                </div>
                <img src={banner_9} loading='lazy' alt="" />
              </div>

              <div className="w-[75%]">
                <MulticardSlider titleClass='!justify-end'
                  cardCount={4}
                  space={30}
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
            </div>

          </div>
        </div>
      </AnimateAppear>

      {/* top selling */}
      <div className='flex w-10/12'>
        <AnimateAppear>
          <div className='grid grid-cols-4 mt-8 mb-18 gap-7'>
          
            <div className='w-full h-[300px] overflow-hidden relative'>
              <div className='absolute top-1/2 left-5 -translate-y-1/2 
                inline-flex flex-col max-w-[50%]'>
                <span className='text-gray-400 mb-1'>Shoes Zone</span>
                <h3 className='text-lg mb-4 smooth hover:translate-x-2'>Save 17% on All Items</h3>

                <div className='text-primary-400 inline-flex items-center gap-1
                  smooth hover:gap-3 cursor-pointer'>
                  <span>Shop Now</span>
                  <IoMdArrowForward />
                </div>
              </div>
              <img src={banner_10} loading='lazy' className='object-cover' alt="" />
            </div>

            <div className='flex flex-col'>
              <h4 className='lined-header-small'>Deals & Outlet</h4>

              <div className="flex flex-col h-full justify-between">
                {Array(3).fill(null).map((el, i) => 
                  <div key={i} className='flex gap-5 cursor-pointer'>
                    <div className='w-[25%]'>
                      <img src={`thumbnails/thumbnail-${++i}.jpg`} loading='lazy' className='w-100' alt="" />
                    </div>
                    <div className='flex-grow inline-flex flex-col justify-center space-y-0.5'>
                      <p className='capitalize font-semibold text-[15px] tracking-wide'>fish print pathced Bag</p>
                      <StarRating />
                      <div className='flex gap-1 items-center'>
                        <span className='text-[17px] font-semibold text-primary-400 price-before 
                          price-before:!text-[13px] !items-start leading-4.5'>238.85</span>
                        <span className="old-price price-before line-through text-gray-400">245.8</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
            <div className='flex flex-col'>
              <h4 className='lined-header-small'>Top Selling</h4>

              <div className="flex flex-col h-full justify-between">
                {Array(3).fill(null).map((el, i) => 
                  <div key={i} className='flex gap-5 cursor-pointer'>
                    <div className='w-[25%]'>
                      <img src={`thumbnails/thumbnail-${++i + 3}.jpg`} loading='lazy' className='w-100' alt="" />
                    </div>
                    <div className='flex-grow inline-flex flex-col justify-center space-y-0.5'>
                      <p className='capitalize font-semibold text-[15px] tracking-wide'>fish print pathced Bag</p>
                      <StarRating />
                      <div className='flex gap-1 items-center'>
                        <span className='text-[17px] font-semibold text-primary-400 price-before 
                          price-before:!text-[13px] !items-start leading-4.5'>238.85</span>
                        <span className="old-price price-before line-through text-gray-400">245.8</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
            <div className='flex flex-col'>
              <h4 className='lined-header-small'>Hot Releases</h4>

              <div className="flex flex-col h-full justify-between">
                {Array(3).fill(null).map((el, i) => 
                  <div key={i} className='flex gap-5 cursor-pointer'>
                    <div className='w-[25%]'>
                      <img src={`thumbnails/thumbnail-${++i + 6}.jpg`} loading='lazy' className='w-100' alt="" />
                    </div>
                    <div className='flex-grow inline-flex flex-col justify-center space-y-0.5'>
                      <p className='capitalize font-semibold text-[15px] tracking-wide'>fish print pathced Bag</p>
                      <StarRating />
                      <div className='flex gap-1 items-center'>
                        <span className='text-[17px] font-semibold text-primary-400 price-before 
                          price-before:!text-[13px] !items-start leading-4.5'>238.85</span>
                        <span className="old-price price-before line-through text-gray-400">245.8</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </AnimateAppear>
      </div>

    </>
  )
}

const Home = React.memo(HomeComponent)

export default Home