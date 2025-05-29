import React, { useEffect, useMemo, useState } from 'react'
import ProductImageViewer from '../../components/ui/ProductImageViewer'
import StarRating from '../../components/user/StarRating'
import { Link, useLocation, useNavigate } from 'react-router'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FaRegHeart } from 'react-icons/fa'
import user_placeholder from '../../assets/user_placeholder.jpg'
import { IoArrowUndoOutline } from "react-icons/io5";
import MulticardSlider from '../../components/user/MulticardSlider'
import ProductCardMed from '../../components/user/ProductCardMed'
import clsx from 'clsx'
import AxiosToast from '../../utils/AxiosToast'
import { Axios } from '../../utils/AxiosSetup'
import ApiBucket from '../../services/ApiBucket'

function ProductPageComponent() {

  const location = useLocation();
  const navigate = useNavigate();
  const { productData } = location.state;
  const [product, setProduct] = useState(null);
  const [relatedItems, setRelatedItems] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributes, setAttributes] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);

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

  // initially setting the variant and select attributes
  useEffect(()=> {

    if(productData.variants.length) {
      setAttributes(getAttributeMap(productData.variants))

      const minPricedVariant = productData.variants.reduce((minVariant, current) => {
        
        if(!minVariant || current?.price < minVariant?.price){
          return current;
        }else{
          return minVariant;
        }
      },null)

      setActiveVariant(minPricedVariant);
      setSelectedAttributes(minPricedVariant?.attributes)
    }

    setProduct(productData);

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

    getRealtedItems(productData);

    window.scrollTo(0, 0);

  },[productData])
  
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

  return (
    <section className='w-9/10 flex flex-col items-center mt-10'>

      {/* basic */}
      <div className="flex space-x-10 min-h-[610px]">
        {/* image viewer with magnification */}
        <ProductImageViewer
          images={useMemo(() => {
            return product?.images?.concat(activeVariant?.image)
            .filter(Boolean)
          },[product, activeVariant])}
          className='w-[42%] shrink-0 max-h-[610px] flex flex-col'
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
              <StarRating starClass='text-xl' />
              <span className="ml-5 text-gray-400"> (25 reviews)</span>
            </div>
          </div>

          {/* price */}
          <div className="border-y border-gray-200 flex items-center py-4 mb-7">
            <div>
              <ins><span className="price-before price-before:!text-xl price-before:font-normal 
                price-before:!top-8 price-before:leading-8
                text-3xl font-semibold !items-start text-primary-400">{activeVariant?.price || product?.price}</span></ins>
              <span className="text-xl line-through ml-4 price-before price-before:!text-base">200.00</span>
              <span className=" ml-4">25% Off</span>
            </div>
          </div>

          {/* detail */}
          <div className="text-base mb-5">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti reiciendis minima nisi modi, quasi, odio minus dolore impedit fuga eum eligendi? Officia doloremque facere quia. Voluptatum, accusantium!</p>
          </div>

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
          <div className='flex flex-col space-y-3 mb-5 '>
            {attributes && Object.entries(attributes).map(([attrName, values]) => {
              return (
                <div key={attrName} className="flex items-center">
                  <strong className={`capitalize min-w-[50px] w-fit pe-2`}>{attrName}</strong>
                  <ul className={`flex items-center gap-1 text-sm capitalize`}>
                    {values.map(val => {
                      
                      const isSelected = selectedAttributes[attrName] === val;
                      const isAvailbale = isOptionAvailable(attrName, val)

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
          

          {/* add to cart buttons */}
          <div className="flex space-x-3">
            <div className="bg-white max-w-[80px] py-2.5 px-5 inline-flex items-start
              w-full border border-gray-300 rounded-lg relative">
              <span className='absolute right-2 top-1 cursor-pointer'>
                <IoIosArrowUp />
              </span>
              <span>1</span>
              <span  className='absolute right-2 bottom-1 cursor-pointer'>
                <IoIosArrowDown />
              </span>
            </div>
            <div className="flex space-x-3">
              <button className="h-full !px-10">Add to cart</button>
              {/* wishlist button */}
              <span className="sale-icon h-full inline-flex items-center px-3" >
                <FaRegHeart className='text-xl' />
              </span>
            </div>
          </div>

          <hr className='mt-6 mb-3 border-gray-300' />

          {/* sku tags availbility*/}
          <ul className="">
            <li>SKU: {activeVariant?.sku || product?.sku}</li>
            <li>Availability:
              <span className="text-primary-400 ml-2">{activeVariant?.stock || product?.stock} Items In Stock</span>
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
        <h2 className='lined-header-small text-2xl mb-10'>Reviews (3)</h2>
        <div className="flex mb-15">

          {/* reviews */}
          <div className="flex-grow inline-flex flex-col space-y-5 divide-y divide-gray-200">

            <div className="flex space-x-5 pb-3">

              {/* avatar */}
              <div className="w-[12%] inline-flex flex-col items-center overflow-hidden">
                <div className='w-17 rounded-full overflow-hidden mb-1'>
                  <img src={user_placeholder} alt="" />
                </div>
                <p className='w-full font-semibold text-center truncate leading-4 tracking-wide mb-0.5'>Jacky Chan johnsdkjasjdjasdasdi</p>
                <p className="text-xs">Since 2012</p>
              </div>
              {/* review */}
              <div className="flex-grow inline-flex flex-col space-y-1">
                <div className="product-rate d-inline-block">
                  <StarRating />
                </div>
                <p className='text-base'>Thank you very fast shipping from Poland only 3 days.</p>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">December 4, 2020 at 3:12 pm </p>
                  <div className="inline-flex items-center space-x-2 cursor-pointer
                    smooth hover:text-primary-400 hover:translate-x-2 w-fit">
                    <IoArrowUndoOutline className='text-xl' />
                    <span>Reply</span>
                  </div>
                </div>
              </div>

            </div>
            <div className="flex space-x-5 pb-3">

              {/* avatar */}
              <div className="inline-flex flex-col items-center">
                <div className='w-17 rounded-full overflow-hidden'>
                  <img src={user_placeholder} alt="" />
                </div>
                <p className='font-semibold tracking-wide'>Jacky Chan</p>
                <p className="text-xs">Since 2012</p>
              </div>
              {/* review */}
              <div className="inline-flex flex-col space-y-1">
                <div className="product-rate d-inline-block">
                  <StarRating />
                </div>
                <p className='text-base'>Thank you very fast shipping from Poland only 3 days.</p>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">December 4, 2020 at 3:12 pm </p>
                  <div className="inline-flex items-center space-x-2 cursor-pointer
                    smooth hover:text-primary-400 hover:translate-x-2">
                    <IoArrowUndoOutline className='text-xl' />
                    <span>Reply</span>
                  </div>
                </div>
              </div>

            </div>
            <div className="flex space-x-5 pb-3">

              {/* avatar */}
              <div className="inline-flex flex-col items-center">
                <div className='w-17 rounded-full overflow-hidden'>
                  <img src={user_placeholder} alt="" />
                </div>
                <p className='font-semibold tracking-wide'>Jacky Chan</p>
                <p className="text-xs">Since 2012</p>
              </div>
              {/* review */}
              <div className="inline-flex flex-col space-y-1">
                <div className="product-rate d-inline-block">
                  <StarRating />
                </div>
                <p className='text-base'>Thank you very fast shipping from Poland only 3 days.</p>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 mb-2">December 4, 2020 at 3:12 pm </p>
                  <div className="inline-flex items-center space-x-2 cursor-pointer
                    smooth hover:text-primary-400 hover:translate-x-2">
                    <IoArrowUndoOutline className='text-xl' />
                    <span>Reply</span>
                  </div>
                </div>
              </div>

            </div>
            
          </div>

          {/* start percentages */}
          <div className='w-[35%] p-3 inline-flex flex-col h-fit space-y-5'>
            <h2 className='text-lg'>Customer reviews</h2>
            <div className='flex space-x-3'>
              <StarRating />
              <h6>4.8 out of 5</h6>
            </div>
            <div className='flex flex-col space-y-3 h-fit'>
              <div className="flex space-x-3 leading-5">
                <span>5 star</span>
                <div className={`review-progress before:w-[50%]`} >
                    <span className='px-3 z-5'>50%</span>
                </div>
              </div>
              <div className="flex space-x-3 leading-5">
                <span>4 star</span>
                <div className={`review-progress before:w-[25%]`} >
                    <span className='px-3 z-5'>25%</span>
                </div>
              </div>
              <div className="flex space-x-3 leading-5">
                <span>3 star</span>
                <div className={`review-progress before:w-[45%]`} >
                    <span className='px-3 z-5'>45%</span>
                </div>
              </div>
              <div className="flex space-x-3 leading-5">
                <span>2 star</span>
                <div className={`review-progress before:w-[65%]`} >
                    <span className='px-3 z-5'>65%</span>
                </div>
              </div>
              <div className="flex space-x-3 leading-5">
                <span>1 star</span>
                <div className={`review-progress before:w-[85%]`} >
                    <span className='px-3 z-5'>85%</span>
                </div>
              </div>
            </div>
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