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
import MulticardSlider from '../../components/user/MulticardSlider'
import CategoryCard from '../../components/user/CategoryCard'
import { useMemo } from 'react'

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

      {/* popular categories */}
      <MulticardSlider cards={useMemo(() => [
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
    </div>
  )
}

export default Home