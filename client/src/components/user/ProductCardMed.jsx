import React from 'react';

import StarRating from './StarRating'
import { TbHeart, TbShoppingBagPlus } from "react-icons/tb";
import { useState } from 'react';
import MyFadeLoader from '../ui/MyFadeLoader';
import { motion } from 'motion/react'
import { yRowVariants } from '../../utils/Anim';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, syncCartitem } from '../../store/slices/CartSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { addToList, syncWishlistItem } from '../../store/slices/WishlistSlice';
import { useLocation, useNavigate } from 'react-router';
import ProductCardBadge from './ProductCardBadge';
import clsx from 'clsx';
import { filterDiscountOffers } from '../../utils/Utils';

function ProducCardMedComponent({product, onClick}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.user);
  const [completed, setCompleted] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null);
  const [offerPrice, setOfferPrice] = useState(0);
  const [bestOffer, setBestOffer] = useState(null);

  /* initialize product */
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

  /* initialize offers */
  useEffect(() => {
    const price = (activeVariant?.price || product?.price);
    const offs = filterDiscountOffers(product?.offers, product, activeVariant);
    
    const best = findBestOffer(offs, price);
    const newPrice = price - best.value;

    setBestOffer(best);
    setOfferPrice(newPrice)

  },[product, activeVariant])


  /* find best offer */
  const findBestOffer = (offers, price) => {
    if (!offers?.length || !price) return 0;

    const getDiscountAmount = (offer) => {
      if (offer.discountType === 'percentage') {
        const calculated = price * (offer.discountValue / 100);
        return offer.maxDiscount ? Math.min(calculated, offer.maxDiscount) : calculated;
      }
      return offer.discountValue || 0;
    };

    return offers.reduce((best, current) => {
      const currentValue = getDiscountAmount(current);
      
      if(currentValue > best.discount){
        return {
          discount: current.discountValue,
          value: currentValue,
          type: current.discountType
        }
      }
      return best
    }, {discount: 0, value: 0, type: null});
  }

  const handleAddToCart = async(e) => {
    e.stopPropagation();
    const newitem = {
      id: activeVariant?._id || product._id,
      name:product.name,
      category:product.category.name,
      sku:activeVariant?.sku || product?.sku,
      price:activeVariant?.price || product?.price,
      stock: activeVariant?.stock || product?.stock,
      quantity: 1,
      image:activeVariant?.image || product?.images[0],
      attributes:activeVariant?.attributes,
      product_id: product._id
    }

    if(user?.roles?.includes('user')){
      const {payload: data} = await dispatch(syncCartitem({item: newitem}))
      if(data?.success){
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      dispatch(addToCart({item: newitem, type:'update'}))
      toast.success("Item added to cart",{position: 'top-center'})
    }
  }

  const handleAddToWishlist = async(e) => {
    e.stopPropagation();
    const newitem = {
      id: activeVariant?._id || product._id,
      name:product.name,
      category:product.category.name,
      sku:activeVariant?.sku || product?.sku,
      price:activeVariant?.price || product?.price,
      stock: activeVariant?.stock || product?.stock,
      quantity: 1,
      image:activeVariant?.image || product?.images[0],
      attributes:activeVariant?.attributes,
      product_id: product._id
    }

    if(user?.roles?.includes('user')){
      const {payload: data} = await dispatch(syncWishlistItem({item: newitem}))
      if(data?.success){
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }

  return (
    <motion.div
      layout="position"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={yRowVariants}
      onClick={onClick}
      >
        
      <div className="w-[220px] h-full rounded-4xl overflow-hidden bg-white px-2 pt-2 group/item
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
          {/* {offerPrice > 0 &&
            <ProductCardBadge
            title={`-${bestOffer?.discount}`}
          />} */}

        </div>

        {/* detail */}
        <div className="flex flex-col px-2 pt-3 pb-5 relative">
          <span className='text-xs mb-0.25 capitalize'>{product?.category?.name}</span>
          <p className='text-sm !font-bold capitalize'>{product?.name}</p>
          <div className="py-0.25 mb-2">
            <span className='text-xl'>
              <StarRating starClass='text-sm' />
            </span>
          </div>
          <div className='flex flex-col leading-3'>
            <div className='flex gap-1 items-center'>
              <span className='text-lg font-semibold text-primary-400 price-before
                price-before:!text-[13px] !items-start leading-4.5'>
                  {offerPrice ? offerPrice : (activeVariant?.price || product?.price)}
                </span>
              {offerPrice > 0 &&
                <>
                  <span className="old-price price-before line-through">
                    {activeVariant?.price || product?.price}
                  </span>
                  <p className='text-xs text-red-400'>(
                    <span className={clsx('mr-1',
                      bestOffer?.type === 'percentage' ? 
                        'content-after content-after:content-["%"] content-after:text-red-400' 
                        : 'content-before content-before:text-red-400 content-before:text-[11px]'
                    )}>
                      {bestOffer.discount}
                    </span>
                    OFF)
                  </p>
                </>
              }
            </div>
            
          </div>
          <p className={clsx('text-[12.5px] font-bold pt-2',
            (product?.stock || activeVariant?.stock) < 5 ? 'text-orange-500' : 'text-green-600'
          )}>
            {(product?.stock || activeVariant?.stock) < 5 ? 'Only few left!' : 'In Stock'}
          </p>
          
          {/* buttons - add to cart, add to wishlist */}
          <div className='absolute right-0 bottom-3 inline-flex flex-col gap-1 z-10'>
            <div 
              onClick={handleAddToWishlist}
              className='sale-icon opacity-0 scale-0 group-hover/item:opacity-100 group-hover/item:scale-100'>
              <TbHeart className='text-2xl' />
            </div>

            <div 
              onClick={handleAddToCart}
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