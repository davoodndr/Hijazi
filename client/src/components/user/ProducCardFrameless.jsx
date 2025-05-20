import React from 'react'
import StarRating from './StarRating'
import { TbShoppingBagPlus } from "react-icons/tb";

function ProducCardFrameless({image}) {
  return (
    <div className="w-[170px] rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden max-h-[320px] group/item rounded-2xl 
        border border-primary-400/30">
        
        <div className="peer absolute left-1/2 top-1/2 flex rounded-2xl -translate-x-1/2 
          overflow-hidden smooth opacity-0 group-hover/item:opacity-100 scale-80 group-hover/item:scale-100
          cursor-pointer shadow-lg/20 z-50 border-2 border-transparent hover:border-white"
          >

          <a className="ps-3 pe-1.5 py-1.5 inline-flex items-center text-xs smooth
            font-bold bg-white whitespace-nowrap hover:bg-primary-400 hover:text-white">
            By now
          </a>
          <a className="ps-1 pe-3 py-1.5 inline-flex bg-white border-l-1 border-gray-300
           hover:bg-primary-400 hover:text-white">
            <TbShoppingBagPlus className='text-2xl' />
          </a>

        </div>
        <div className="relative overflow-hidden rounded-2xl cursor-pointer smooth 
          peer-hover:blur-[2px]">

          <a className=''>
            <img className="group-hover/item:scale-110 smooth !duration-1000" src={image} alt=""/>
            <img className="hover-img" src="assets/imgs/shop/product-2-2.jpg" alt=""/>
          </a>
        </div>
        <div className="absolute left-2 top-1">
            <span className="text-[11px] bg-pink-400 text-white 
            rounded-xl px-1.5 py-0.25 inline-flex leading-normal
            ">Hot</span>
        </div>
      </div>
      <div className="flex flex-col items-center py-3">
        <h2 className='text-[15px] !font-bold'>
          <a>Lorem ipsum dolor</a>
        </h2>
        <div className="py-1" title="90%">
          <span className='text-lg'>
            <StarRating />
          </span>
        </div>
        <div className='flex justify-between gap-3 items-center'>
          <span className='text-lg font-semibold text-primary-400 price-before
            price-before:!text-[13px] !items-start leading-4.5'>238.85</span>
          <span className="old-price price-before line-through text-gray-400">245.8</span>
        </div>
      </div>
    </div>
  )
}

export default ProducCardFrameless