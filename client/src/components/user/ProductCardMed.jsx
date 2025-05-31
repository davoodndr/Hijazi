import React from 'react';

import StarRating from './StarRating'
import { TbHeart, TbShoppingBagPlus } from "react-icons/tb";
import { useState } from 'react';
import MyFadeLoader from '../ui/MyFadeLoader';
import { motion } from 'motion/react'
import { yRowVariants } from '../../utils/Anim';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/CartSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { addToList } from '../../store/slices/WishlistSlice';

function ProducCardMedComponent({product, onClick}) {

  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null);

  useEffect(()=> {
      
    if(product?.variants?.length) {

      const minPricedVariant = product?.variants.reduce((minVariant, current) => {
        
        if(!minVariant || current?.price < minVariant?.price){
          return current;
        }else{
          return minVariant;
        }
      },null)

      setActiveVariant(minPricedVariant);
    }

  },[product])

  return (
    <motion.div
      layout="position"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={yRowVariants}
      onClick={onClick}
      >
        
      <div className="w-[220px] rounded-4xl overflow-hidden bg-white px-2 pt-2 h-fit group/item
        border border-gray-300 smooth hover:shadow-lg/20 hover:border-primary-300 cursor-pointer">

        <div className="relative overflow-hidden max-h-[320px] rounded-3xl 
          border border-primary-400/30 m-1">
          
          {/* image */}
          <div className="relative overflow-hidden rounded-3xl cursor-pointer smooth 
            peer-hover:blur-[2px] size-[192px]">

            <img className={`group-hover/item:scale-110 smooth !duration-1000 rounded-3xl`}
                  src={activeVariant?.image?.thumb || product?.images[0]?.thumb} onLoad={() => setCompleted(true)} loading='lazy' alt=""/>
              
            {!completed &&
              <div className='w-full h-full relative flex items-center justify-center opacity-50'>
                <MyFadeLoader size={30} radius={5} width={15} height={15} color='var(--color-primary-300)' />
              </div>
            }

          </div>

          {/* badge */}
          {/* <ProductCardBadge
            title='Hot'
          /> */}

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
              price-before:!text-[13px] !items-start leading-4.5'>{activeVariant?.price || product?.price}</span>
            {<span className="old-price price-before line-through text-gray-400">245.8</span>}
          </div>
          
          {/* buttons - add to cart, add to wishlist */}
          <div className='absolute right-0 bottom-3 inline-flex flex-col gap-1 z-10'>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToList({
                  id: product._id,
                  name:product.name,
                  category:product.category.name,
                  price:activeVariant?.price || product?.price,
                  quantity: 1,
                  stock: activeVariant?.stock || product?.stock,
                  image:activeVariant?.image || product?.images[0],
                  attributes:activeVariant?.attributes,
                  variant_id: activeVariant?._id
                }))
              }}
              className='sale-icon opacity-0 scale-0 group-hover/item:opacity-100 group-hover/item:scale-100'>
              <TbHeart className='text-2xl' />
            </div>

            <div 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart({
                  id: product._id,
                  name:product.name,
                  category:product.category.name,
                  sku:activeVariant?.sku || product?.sku,
                  price:activeVariant?.price || product?.price,
                  quantity: 1,
                  image:activeVariant?.image || product?.images[0],
                  attributes:activeVariant?.attributes,
                  variant_id: activeVariant?._id
                }))
                toast.success("Item added to cart",{position: 'top-center'})
              }}
              className='sale-icon'>
              <TbShoppingBagPlus className='text-2xl' />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ProductCardMed = React.memo(ProducCardMedComponent);

export default ProductCardMed