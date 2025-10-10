import React from 'react'
import StarRating from '../ui/StarRating'
import { TbHeart, TbShoppingBagPlus } from "react-icons/tb";
import { FaRegEye } from 'react-icons/fa';
import ProductCardBadge from './ProductCardBadge';

function ProducCardFrameless({image}) {
  return (
    <div className="w-[170px] rounded-2xl overflow-hidden group/item cursor-pointer">

      
      <div className="relative overflow-hidden max-h-[320px] rounded-2xl 
        border border-primary-400/30">
        
        {/* action buttons */}
        {/* <div className="peer absolute left-1/2 top-1/2 flex rounded-2xl -translate-x-1/2 
          overflow-hidden smooth opacity-0 group-hover/item:opacity-100 scale-80 group-hover/item:scale-100
          cursor-pointer shadow-lg/20 z-50 border-2 border-transparent hover:border-white"
          >

          <a className="ps-3 pe-1.5 py-1.5 inline-flex items-center text-xs smooth
            font-bold bg-white whitespace-nowrap hover:bg-primary-400 hover:text-white">
            By now
          </a>
          <a className="ps-1 pe-2 py-1.5 inline-flex bg-white border-l-1 border-gray-300
           hover:bg-primary-400 hover:text-white">
            <FaRegEye className='text-2xl' />
          </a>

        </div> */}

        {/* image */}
        <div className="relative overflow-hidden rounded-2xl cursor-pointer smooth 
          peer-hover:blur-[2px]">

          <a className=''>
            <img className="group-hover/item:scale-110 smooth !duration-1000" src={image} loading='lazy' alt=""/>
            {/* <img className="hover-img" src="assets/imgs/shop/product-2-2.jpg" alt=""/> */}
          </a>
        </div>
        
        {/* badge */}
        <ProductCardBadge
          title='Hot'
        />
      </div>

      {/* detail */}
      <div className="flex flex-col px-2 py-3 relative">
        <h2 className='text-[15px] !font-bold'>
          <a>Lorem ipsum dolor</a>
        </h2>
        <div className="py-1">
          <span className='text-lg'>
            <StarRating starClass='text-base' />
          </span>
        </div>
        <div className='flex gap-1 items-center'>
          <span className='text-lg font-semibold text-primary-400 price-before
            price-before:!text-[13px] !items-start leading-4.5'>238.85</span>
          <span className="old-price price-before line-through text-gray-400">245.8</span>
        </div>

        {/* cart button */}
        <div className='absolute right-1 bottom-3 inline-flex flex-col gap-1 z-10'>
          <div className='sale-icon opacity-0 scale-0 group-hover/item:opacity-100 group-hover/item:scale-100'>
            <TbHeart className='text-2xl' />
          </div>
          <div className='sale-icon'>
            <TbShoppingBagPlus className='text-2xl' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProducCardFrameless