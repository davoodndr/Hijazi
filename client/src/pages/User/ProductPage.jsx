import React, { useEffect, useMemo, useRef, useState } from 'react'
import ProductImageViewer from '../../components/ui/ProductImageViewer'
import StarRating from '../../components/user/StarRating'
import { Link, useLocation, useNavigate } from 'react-router'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FaRegHeart } from 'react-icons/fa'
import { IoArrowUndoOutline } from "react-icons/io5";
import MulticardSlider from '../../components/user/MulticardSlider'
import ProductCardMed from '../../components/user/ProductCardMed'
import clsx from 'clsx'
import AxiosToast from '../../utils/AxiosToast'
import { Axios } from '../../utils/AxiosSetup'
import ApiBucket from '../../services/ApiBucket'
import { FaCircleCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, getCartItem, syncCartitem } from '../../store/slices/CartSlice'
import { setLoading } from '../../store/slices/CommonSlices'
import toast from 'react-hot-toast'
import { addToList, syncWishlistItem } from '../../store/slices/WishlistSlice'
import { getSingleProduct, getUserReviews } from '../../services/FetchDatas'
import { MdDiscount } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { MdOutlineCopyAll } from "react-icons/md";
import { AnimatePresence, motion } from 'motion/react'
import { containerVariants, rowVariants } from '../../utils/Anim'
import { BsTags } from "react-icons/bs";
import { filterDiscountOffers, findBestCouponValue, findBestOffer } from '../../utils/Utils'
import ReviewItem from '../../components/user/ReviewItem'
import RatingDistribution from '../../components/user/RatingDistribution'

function ProductPageComponent() {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const path = location.pathname;

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [relatedItems, setRelatedItems] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributes, setAttributes] = useState(null);
  const [productQty, setProductQty] = useState(1);
  const cartItem = useSelector(state => getCartItem(state, activeVariant?._id || product?._id));
  const [userReviews, setUserReviews] = useState([]);
  

  /* function to re-arrange attributes */
  const getAttributeMap = (variants) => {
    const attrs = {}
    variants.forEach(v => {
      Object.entries(v.attributes).forEach(([key, value]) => {
        if (!attrs[key]) attrs[key] = new Set();
        attrs[key].add(value);
      });
    })

    // convert set to array
    Object.keys(attrs).forEach(key => {
      attrs[key] = Array.from(attrs[key]);
    });

    return attrs
  }

  // inital product fetch
  useEffect(() => {

    /* syncing product */
    const product_slug = path.split('/').pop();
    
    const fetchProduct = async() => {
     const p = await getSingleProduct(product_slug);
      setProduct(p);
    }
    fetchProduct();

  },[])

  useEffect(() => {
    if(cartItem) setProductQty(cartItem?.quantity)
  },[cartItem])

  // initially setting the variant and select attributes
  useEffect(()=> {
    
    dispatch(setLoading(false))

    if(product){
      if(product?.variants?.length) {
        setVariants(product?.variants)
        setAttributes(getAttributeMap(product.variants))

        const minPricedVariant = product.variants.reduce((minVariant, current) => {
          
          if(!minVariant || current?.price < minVariant?.price){
            return current;
          }else{
            return minVariant;
          }
        },null)

        setActiveVariant(minPricedVariant);
        setSelectedAttributes(minPricedVariant?.attributes)
      }

      setProduct(product);

      /* syncing reviews */
      const fetchReviews = async() => {
        const reviewData = await getUserReviews(product?._id);
        setUserReviews(reviewData);
      }

      fetchReviews();

      const getRealtedItems = async(product) => {
        try {

          const response = await Axios({
            ...ApiBucket.getRelatedProducts,
            params:{
              product_id: product._id,
              category: product.category._id
            }
          })

          if(response?.data?.success){
            setRelatedItems(response?.data?.items);
          }

        } catch (error) {
          console.log(error)
          AxiosToast(error)
        }

      }

      getRealtedItems(product);

      //window.scrollTo(0, 0);
    }

  },[product])
  
  // hndling user select attributes
  const handleAttributeSelect = (key, value) => {
    const updated = { ...selectedAttributes, [key]: value };
    

    // Try to match variant
    const matched = product.variants.find(variant => {
      if (variant.attributes[key] !== value) return false;
      return Object.entries(updated).every(
        ([k, v]) => variant.attributes[k] === v || k === key
      );
    });

    if(matched){
      setActiveVariant(matched);
      setSelectedAttributes(updated);
    }else{
      // make matched one select
      const updateMatch = product.variants.find(v => {
        return v.attributes[key] === value;
      })
      setSelectedAttributes(updateMatch.attributes);
      setActiveVariant(updateMatch);
    }
  };

  // checking the current attibutes value availble for other attrs
  const isOptionAvailable = (attrName, value) => {
    return product.variants.some(variant => {
      
      if (variant.attributes[attrName] !== value) return false;

      for (const [key, selectedValue] of Object.entries(selectedAttributes)) {
        if (key === attrName) continue; // skip current attribute
        if (variant.attributes[key] !== selectedValue) return false;
      }

      return true;
    });
  };

  /* handle click on related */
  const handleSingleProductClick = (product) => {

    const parent = product.category.parentId;

    navigate(
      `/collections/${parent.slug}/${product.category.slug}/${product.slug}`,
        {state : {
          productData: product
        }}
    )
  }

  const handleAddToCart = async() => {
    const newitem = {
      id: activeVariant?._id || product._id,
      name:product.name,
      category:product.category.name,
      sku:activeVariant?.sku || product?.sku,
      price:activeVariant?.price || product?.price,
      stock: activeVariant?.stock || product?.stock,
      quantity: productQty || 1,
      image:activeVariant?.image || product?.images[0],
      attributes:activeVariant?.attributes,
      product_id: product._id
    }

    if(user?.roles?.includes('user')){
      const {payload: data} = await dispatch(syncCartitem({item: newitem, type: 'update'}))
      if(data?.success){
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      dispatch(addToCart({item: newitem, type:'update'}))
      toast.success("Item added to cart",{position: 'top-center'})
    }
  }

  const handleAddToWishlist = async() => {
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
      navigate(`/login?redirect=${encodeURIComponent(path)}`)
    }
  }

  /* offers & offer */
  const [isListExpanded, setIsListExpanded] = useState(false);
  const { offersList } = useSelector(state => state.offers);
  const [bestCouponValue, setBestCouponValue] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [offerPrice, setOfferPrice] = useState(0);
  const [bestOffer, setBestOffer] = useState(null);
  const wrapperRef = useRef(null)
  
  /* selecting max value offer */
  useEffect(() => {
    const price = (activeVariant?.price || product?.price);

    const filteredOffers = filterDiscountOffers(offersList, product, activeVariant);

    const coupons = filteredOffers?.filter(el => el?.type === 'coupon');
    setAvailableCoupons(coupons);

    const findBest = findBestCouponValue(coupons, activeVariant?.price || product?.price);
    setBestCouponValue(findBest)
    
    const offers = filteredOffers?.filter(el => el?.type !== 'coupon');
    setAvailableOffers(offers);

    const best = findBestOffer(offers, price);
    const newPrice = price > best?.value ? price - best?.value : 0;

    setBestOffer(best);
    setOfferPrice(newPrice)

  },[offersList, activeVariant?.price, product?.price])

  /* handle click out side of the coupon */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsListExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyCoupon = (offer) => {
    
    navigator.clipboard.writeText(offer?.code)
    .then(() => {
      toast.success("Coupon code copied!")
    })
    .catch(err => {
      toast.error("Failed to copy offer code")
    })
    setIsListExpanded(false)
  }

  return (
    <section className='w-9/10 flex flex-col items-center mt-10'>

      {/* basic */}
      <div className="flex space-x-10 w-full min-h-[610px]">
        {/* image viewer with magnification */}
        <ProductImageViewer
          images={useMemo(() => {
            const variantImages = variants?.map(v => v.image)
            return product?.images?.concat(variantImages)
            .filter(Boolean)
          },[product, activeVariant])}
          defaultImage={activeVariant?.image}
          className='w-[42%] shrink-0 flex flex-col'
        />

        {/* detail info */}
        <div className="flex-grow h-full">
          <h2 className="text-4xl capitalize">{product?.name}</h2>

          {/* brand rating */}
          <div className="flex items-center justify-between py-3 capitalize">
            <div>
              <span> Brand: <Link className='ms-3'>{product?.brand.name}</Link></span>
            </div>
            <div className="inline-flex text-end">
              <StarRating 
                value={product?.averageRating}
                starClass='text-xl' 
              />
              <span className="ml-3 text-gray-400">({
                userReviews?.length > 0 ?
                  userReviews?.length > 1 ? 
                    `${userReviews?.length} reviews`
                    :
                    '1 review'
                :
                'Fresh Product'
              })</span>
            </div>
          </div>

          {/* price */}
          <div className="border-y border-gray-200 flex items-center py-4 mb-5">
            
            <ins>
              <span 
                className="price-before price-before:!text-xl price-before:font-normal 
                price-before:!top-8 price-before:leading-8
                text-3xl font-semibold !items-start text-primary-400"
              >
                {offerPrice ? offerPrice : (activeVariant?.price || product?.price)}
              </span>
            </ins>
            
            {offerPrice > 0 &&
              <>
                <span className="text-xl line-through ml-3 price-before price-before:!text-base">
                  {activeVariant?.price || product?.price}
                </span>
                <p className='text-base text-red-400 price-before:text-red-400 ml-2'>(
                  <span className={clsx('mr-1',
                    bestOffer?.type === 'percentage' ? 
                      'content-after content-after:content-["%"] content-after:text-red-400' 
                      : 'content-before content-before:text-red-400'
                  )}>
                    {bestOffer?.discount}
                  </span>
                  OFF)
                </p>
              </>
            }
            
          </div>

          {/* available offers */}
          {availableOffers?.length > 0 &&
            <div className="flex flex-col mb-7">
              <div className='inline-flex items-center space-x-2 mb-2'>
                <h3 className='text-base'>Available Offers</h3>
                <BsTags className='text-xl' />
              </div>
              <ul className='pl-3 list-disc list-inside'>
                {availableOffers?.map(offer => 
                  (
                    <li key={offer._id}>
                      <span>{offer?.detail || offer?.title}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          }

          {/* waranty return delivery */}
          <div className="text-sm mb-5">
            <ul className='space-y-2'>
              <li className="space-x-1">
                1 Year AL Jazeera Brand Warranty
              </li>
              <li> 30 Day Return Policy</li>
              <li>Cash on Delivery available</li>
            </ul>
          </div>

          {/* variant attributes */}
          <div className='flex flex-col space-y-3 mb-7'>
            {attributes && Object.entries(attributes).map(([attrName, values]) => {
              return (
                <div key={attrName} className="flex items-center">
                  <strong className={`capitalize min-w-[50px] w-fit pe-2`}>{attrName}</strong>
                  
                  <ul className={`flex items-center gap-1 text-sm capitalize`}>
                    {values.map(val => {
                      
                      const isSelected = selectedAttributes[attrName] === val;
                      const isAvailbale = isOptionAvailable(attrName, val)

                      if(attrName === 'color' || attrName === 'colour')
                        return (
                          <li 
                            onClick={() => 
                              handleAttributeSelect(attrName, val)
                            }
                            key={val}
                            style={{"--dynamic":val}}
                            className={
                              clsx(
                                'cursor-pointer bg-(--dynamic) rounded-full',
                                isSelected ? 'p-1 text-white/70' : 'p-3.5 text-transparent'
                              )
                            }
                          >
                            {isSelected && <FaCircleCheck className='text-xl' />}
                          
                          </li>
                        )
                      else
                        return (
                          <li 
                            onClick={() => 
                              handleAttributeSelect(attrName, val)
                            }
                            key={val} 
                            className={clsx('px-1.5 py-px rounded-md cursor-pointer border',
                              isSelected ? 'bg-primary-400 text-white border-primary-400'
                              : 'bg-white border-gray-400',
                              !isAvailbale && 'text-gray-300 !border-gray-300'            
                            )}
                          >{val}</li>
                        )

                    })}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* coupons */}
          {bestCouponValue > 0 && 
            <div className='mb-5 flex space-x-2 items-center'>
              <div className='bg-amber-500 w-fit px-3 pe-5 text-black relative inline-flex items-center'>
                <span className='font-bold'>Coupon{availableCoupons?.length > 1 ? 's' : '' }:</span>
                <div className='w-[17px] h-[17px] bg-white absolute -right-2 top-1/2 -translate-y-1/2 rotate-45'></div>
              </div>
              {/* message */}
              <div 
                ref={wrapperRef}
                className="inline-flex items-center space-x-1
                  smooth hover:text-primary-400 hover:underline relative">
                <p 
                  onClick={() => {
                    setIsListExpanded(!isListExpanded)
                  }} 
                  className='z-5 cursor-pointer'>
                  Save up to
                  <span
                    className={clsx('mx-1 font-extrabold text-black price-before price-before:text-black')}
                  >{bestCouponValue}</span> 
                  with coupon
                </p>
                <div>
                  <IoIosArrowDown />
                </div>

                {/* coupon list */}
                
                {isListExpanded &&
                    <motion.ul 
                      layout
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                          ease: "easeInOut",
                          duration: 0.3,
                        },
                      }}
                      className='border border-gray-300 absolute bottom-[calc(100%+5px)]
                    bg-gray-100 shadow-md/20 rounded-lg overflow-hidden space-y-1 p-2'>
                      <AnimatePresence>
                      {
                        availableCoupons?.map((item, index) => {

                          return (
                            <motion.li 
                              layout
                              key={item._id}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={rowVariants}
                            >
                              <div className='flex items-center space-x-2 overflow-hidden'>
                                <div className="min-w-30 inline-flex flex-col items-center bg-pink-500 
                                  leading-2 py-1.5 space-y-2 relative
                                  before:inline-flex before:border-x-8 before:border-gray-100 before:border-dotted
                                  before:w-[calc(100%+8px)] before:h-full before:absolute top-0"
                                >
                                  <div className='text-sm text-white inline-flex items-center justify-center
                                    leading-2 space-x-1'>
                                    <span
                                      className={clsx('font-extrabold content-before:text-white content-after:text-white',
                                        item.discountType === 'fixed' ? 
                                          'content-before content-before:text-[15px]' 
                                          : 'content-after content-after:content-["%"]'
                                      )}
                                    >{item.discountValue}</span>
                                    <span className='inline-flex'>OFF</span>
                                  </div>
                                  {item.discountType === 'percentage' ? 
                                    <p className='text-gray-200 text-xs leading-1.5'>Up to
                                      <span className='ms-1 content-before content-before:content-["₹"]
                                      content-before:text-white content-before:text-[11px]'>
                                        {item.maxDiscount}
                                      </span>
                                    </p>
                                    :
                                    <span className='text-gray-200 text-xs leading-1.5'>
                                      On {item?.usageLimit > 1 ? 'purchase' : 'first purchase'}
                                    </span>
                                  }
                                </div>
                                <div className='flex-grow w-px h-8 bg-gray-300'></div>
                                <div 
                                  onClick={() => handleCopyCoupon(item)}
                                  className='inline-flex border border-gray-300 bg-gray-200 
                                    p-0.5 rounded-lg cursor-pointer smooth hover:bg-primary-50 hover:shadow-md'>
                                  <MdOutlineCopyAll className='text-2xl' />
                                </div>
                              </div>

                            </motion.li>
                          )
                        })
                      }
                      </AnimatePresence>
                    </motion.ul>
                }

              </div>
            </div>
          }
          

          {/* add to cart/wishlist buttons */}
          <div className="flex space-x-3">

            <div className="bg-white max-w-[80px] py-2.5 px-5 inline-flex items-start
              w-full border border-gray-300 rounded-lg relative">

              <span 
                onClick={() =>{
                  setProductQty(prev => prev += 1)
                }}
                className='absolute right-2 top-1 cursor-pointer'>
                <IoIosArrowUp />
              </span>
              <span>{productQty}</span>
              <span 
                onClick={() => {
                  setProductQty(prev => prev > 1 ? prev -= 1 : prev)
                }}
                className='absolute right-2 bottom-1 cursor-pointer'>
                <IoIosArrowDown />
              </span>

            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                className="h-full !px-10">Add to Bag
              </button>

              {/* wishlist button */}
              <span 
                onClick={handleAddToWishlist}
                className="group sale-icon hover:!scale-none h-full inline-flex items-center px-3" >
                <FaRegHeart className='text-xl smooth group-hover:scale-130' />
              </span>

            </div>
          </div>

          <hr className='mt-6 mb-3 border-gray-300' />

          {/* sku tags availbility*/}
          <ul>
            <li>SKU: {activeVariant?.sku || product?.sku}</li>
            <li>Availability:
              <span className={clsx("ml-1 text-[12.5px] font-bold",
                (product?.stock || activeVariant?.stock) < 5 ? 'text-orange-500' : 'text-green-600'
              )}>
                {(product?.stock || activeVariant?.stock) < 5 ? 'Only few left!' 
                  : `${activeVariant?.stock || product?.stock} items in stock`}
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* deatil */}
      <div className="flex flex-col w-8/10 py-15">

        <h2 className='lined-header-small text-2xl'>Description</h2>
        <p className='text-base mb-5'>Uninhibited carnally hired played in whimpered dear gorilla koala depending and much yikes off far quetzal goodness and from for grimaced goodness unaccountably and meadowlark near unblushingly crucial scallop tightly neurotic hungrily some and dear furiously this apart.
          Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello on spoon-fed that alas rethought much decently richly and wow against the frequent fluidly at formidable acceptably flapped besides and much circa far over the bucolically hey precarious goldfinch mastodon goodness gnashed a jellyfish and one however because.</p>
      
        {/* attributes */}
        <ul className="w-1/2 flex flex-col space-y-2 divide-y divide-dashed divide-gray-300 mb-5">
          <li className='grid grid-cols-2'>
            <span className='point-before point-before:!bg-gray-400 point-before:!p-0.75
              point-before:!me-2 !text-gray-500 !text-sm'>Type Of Packing</span>
            <span> Bottle</span>
          </li>
          <li className='grid grid-cols-2'>
            <span className='point-before point-before:!bg-gray-400 point-before:!p-0.75
              point-before:!me-2 !text-gray-500 !text-sm'>Color</span>
            <span> Green, Pink, Powder Blue, Purple</span>
          </li>
          <li className='grid grid-cols-2'>
            <span className='point-before point-before:!bg-gray-400 point-before:!p-0.75
              point-before:!me-2 !text-gray-500 !text-sm'>Quantity Per Case</span>
            <span> 100ml</span>
          </li>
          <li className='grid grid-cols-2'>
            <span className='point-before point-before:!bg-gray-400 point-before:!p-0.75
              point-before:!me-2 !text-gray-500 !text-sm'>Ethyl Alcohol</span>
            <span> 70%</span>
          </li>
          <li className='grid grid-cols-2'>
            <span className='point-before point-before:!bg-gray-400 point-before:!p-0.75
              point-before:!me-2 !text-gray-500 !text-sm'>Piece In One</span>
            <span> Carton</span>
          </li>
        </ul>
        
        <p className='text-base mb-10'>Uninhibited carnally hired played in whimpered dear gorilla koala depending and much yikes off far quetzal goodness and from for grimaced goodness unaccountably and meadowlark near unblushingly crucial scallop tightly neurotic hungrily some and dear furiously this apart.
          Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello on spoon-fed that alas rethought much decently richly and wow against the frequent fluidly at formidable acceptably flapped besides and much circa far over the bucolically hey precarious goldfinch mastodon goodness gnashed a jellyfish and one however because.</p>

        {/* additional info */}
        <h2 className='lined-header-small text-xl mb-10'>Additional info</h2>
        <ul className="w-[80%] mb-20 border border-gray-300 divide-y divide-gray-300">
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Stand Up</span>
            <p className='flex-grow px-5 py-2'>35″L x 24″W x 37-45″H(front to back wheel)</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Folded (w/o wheels)</span>
            <p className='flex-grow px-5 py-2'>32.5″L x 18.5″W x 16.5″H</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Folded (w/ wheels)</span>
            <p className='flex-grow px-5 py-2'>32.5″L x 24″W x 18.5″H</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Door Pass Through</span>
            <p className='flex-grow px-5 py-2'>24</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Frame</span>
            <p className='flex-grow px-5 py-2'>Aluminum</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Weight (w/o wheels)</span>
            <p className='flex-grow px-5 py-2'>20 LBS</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Weight Capacity</span>
            <p className='flex-grow px-5 py-2'>60 LBS</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Width</span>
            <p className='flex-grow px-5 py-2'>24″</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Handle height (ground to handle)</span>
            <p className='flex-grow px-5 py-2'>37-45″</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Wheels</span>
            <p className='flex-grow px-5 py-2'>12″ air / wide track slick tread</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Seat back height</span>
            <p className='flex-grow px-5 py-2'>21.5″</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Head room (inside canopy)</span>
            <p className='flex-grow px-5 py-2'>25″</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Color</span>
            <p className='flex-grow px-5 py-2'>Black, Blue, Red, White</p>
          </li>
          <li className="flex divide-x divide-gray-200 text-base">
            <span className='w-[40%] px-5 py-2'>Size</span>
            <p className='flex-grow px-5 py-2'>M, S</p>
          </li>
        </ul>

        {/* reviews and percentage */}
        <h2 className='lined-header-small text-2xl mb-10'>
          Reviews <span className='!text-xl'>(
            {userReviews?.length > 0 ? 
            `${userReviews?.length}` : 
              <span className='text-lg text-gray-500'>Fresh Product</span>
            }
          )</span>
        </h2>
        <div className="flex mb-15">

          {/* reviews */}
          <div className="flex-grow inline-flex flex-col space-y-5 divide-y divide-gray-200">
            
            {userReviews?.map(review => 
              <ReviewItem
                key={review?._id}
                review={review}
              />
            )}
            
          </div>

          {/* start percentages */}
          <div className='w-[35%] p-3 inline-flex flex-col h-fit space-y-5'>
            <h2 className='text-lg'>Customer reviews</h2>
            <div className='flex space-x-3'>
              <StarRating 
                value={product?.averageRating}
              />
              <h6>{product?.averageRating} out of 5</h6>
            </div>
            
            <RatingDistribution reviewData={userReviews} />

          </div>

        </div>
      </div>

      {/* related products */}
      {relatedItems?.length > 0 && 
        (<div className='w-full mb-10'>

          <MulticardSlider 
            cardCount={5}
            space={30}
            title={<h2 className='lined-header-small flex-grow text-2xl mb-5 me-5'>Related products</h2>}
            cards={
              relatedItems.map((item, i) => 
                <ProductCardMed 
                  key={item?._id} 
                  index={i} 
                  product={item}
                  offers={offersList}
                  onClick={() => handleSingleProductClick(item)}
                />
              )
            }
          />

        </div>)
      }
      
    </section>
  )
}

const ProductPage = React.memo(ProductPageComponent)

export default ProductPage