import React from 'react'
import StarRating from './StarRating'
import { TbHeart, TbShoppingBagPlus } from "react-icons/tb";
import { FaRegEye } from 'react-icons/fa';
import ProductCardBadge from './ProductCardBadge';
import { IoIosHeartEmpty } from 'react-icons/io';

function ProducCardMedComponent({product}) {

  let price = 0;

  if(product?.price){
    price = product.price;
  }else{
    if(product?.variants?.length){
      const prices = product.variants.map(item => item.price);
      if(prices.length) price = Math.min(...prices);
    }
  }

  return (
    <div className="w-[220px] rounded-4xl overflow-hidden bg-white px-2 pt-2 h-fit group/item
      border border-gray-300 smooth hover:shadow-lg/20 hover:border-primary-300 cursor-pointer">

      <div className="relative overflow-hidden max-h-[320px] rounded-3xl 
        border border-primary-400/30 m-1">
        
        {/* image */}
        <div className="relative overflow-hidden rounded-3xl cursor-pointer smooth 
          peer-hover:blur-[2px]">

          <a className=''>
            <img className="group-hover/item:scale-110 smooth !duration-1000" 
              src={product?.images[0]?.thumb} alt=""/>
            {/* <img className="hover-img" src="assets/imgs/shop/product-2-2.jpg" alt=""/> */}
          </a>
        </div>

        {/* badge */}
        <ProductCardBadge
          title='Hot'
        />

      </div>

      {/* detail */}
      <div className="flex flex-col px-2 pt-3 pb-5 relative">
        <span className='text-xs mb-0.25 capitalize'>{product?.category?.name}</span>
        <p className='text-base !font-bold capitalize'>{product?.name}</p>
        <div className="py-0.25 mb-2">
          <span className='text-xl'>
            <StarRating starClass='text-base' />
          </span>
        </div>
        <div className='flex gap-1 items-center'>
          <span className='text-lg font-semibold text-primary-400 price-before
            price-before:!text-[13px] !items-start leading-4.5'>{price}</span>
          {<span className="old-price price-before line-through text-gray-400">245.8</span>}
        </div>

        <div className='absolute right-0 bottom-3 inline-flex flex-col gap-1 z-10'>
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

const ProductCardMed = React.memo(ProducCardMedComponent);

export default ProductCardMed