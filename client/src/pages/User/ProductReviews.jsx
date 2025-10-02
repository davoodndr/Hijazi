import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { getCanRateProduct, getSingleProduct, getUserReviews } from '../../services/FetchDatas';
import RatingDistribution from '../../components/user/RatingDistribution';
import StarRating from '../../components/user/StarRating';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import ReviewItem from '../../components/user/ReviewItem';
import AdminPagination from '../../components/ui/AdminPagination';
import RateProductModal from '../../components/ui/RateProductModal';
import { setActiveProduct, setReviews } from '../../store/slices/ProductSlices';

function ProductReviewsComponent() {

  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { items: products, activeProduct, reviews:linkedReviews } = useSelector(state => state?.products)
  const path = location.pathname;
  
  const [product, setProduct] = useState(null);
  const [userReviews, setUserReviews] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    if(activeProduct) {
      setProduct(activeProduct);
    }else{
      const parts = path.split('/').filter(Boolean);
      const product_slug = parts[parts?.length - 2];

      const fetchProduct = async() => {
        
        let p = products?.find(el => el?.slug === product_slug);
        if(!p){
          p = await getSingleProduct(product_slug);
        }

        const productData = await setProductData(p, user);

        setProduct(productData);
      }
      fetchProduct();
    }
    
  },[products, activeProduct, user])

  useEffect(() => {
    
    if(linkedReviews?.length) {
      setUserReviews(linkedReviews);
    }else{
      if(product){
        fetchReviews();
      }
    }
    
  },[product, linkedReviews]);

  const setProductData = async(product, user) => {
        
    let productData = {
      _id: product?._id,
      name: product?.name,
      numReviews: product?.numReviews,
      averageRating: product?.averageRating,
      brand: product?.brand?.name
    }

    if(product?.variants?.length) {
      const minPricedVariant = product?.variants?.reduce((minVariant, current) => {
      
        if(!minVariant || current?.price < minVariant?.price){
          return current;
        }else{
          return minVariant;
        }
      },null)

      if(user){
        const checkCanRate = async() => {
          const canRate = await getCanRateProduct(user?._id, product?._id);
          productData = {
            ...productData,
            canRate: canRate || false
          };
          setProduct(productData);
        }

        checkCanRate();
      }

      productData = {
        ...minPricedVariant,
        ...productData
      }
    }

    return productData
  }

  const fetchReviews = async() => {
    const reviewData = await getUserReviews(product?._id);
    dispatch(setReviews(reviewData))
    setUserReviews(reviewData);
  }

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10
  const totalPages = Math.ceil(userReviews?.length / itemsPerPage);

  const paginatedReviews = userReviews?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOnSubmitReview = async(review, updatedProduct) => {
    
    if(review){
      const exists = userReviews?.find(el => el?._id === review?._id);
      
      if(exists){
        const updatedReviews = userReviews?.map(el =>
          el?._id === review?._id ? review : el
        )
        dispatch(setReviews(updatedReviews))
      }else{
        dispatch(setReviews([review, ...userReviews]))
      }

      let productData = await setProductData(updatedProduct, user);

      const updated = { 
        ...(activeProduct ? activeProduct : productData), 
        averageRating: updatedProduct?.averageRating
      }
      
      dispatch(setActiveProduct(updated))
    }
  }

  return (
    <section className='w-9/10 flex flex-col'>
      
      {/* product description */}
      <div className='flex space-x-5 py-6'>

        {/* description */}
        <div className='flex-grow inline-flex space-x-4'>

          <div className='w-65'>
            <img src={product?.image?.url} alt="" />
          </div>

          <div className='flex flex-col'>
            <div className="flex flex-col"></div>
            <h3 className='text-2xl capitalize'>{product?.name}</h3>
            <p className='capitalize text-base'>
              <span>By: </span>
              <span>{product?.brand}</span>
            </p>
            {product?.attributes && (
              <ul>
                {Object.keys(product?.attributes).map(key => 
                  (
                    <li 
                      key={key}
                      className='space-x-2 text-base'
                    >
                      <span className='capitalize text-gray-400'>{key}: </span>
                      <span 
                        style={{
                          '--dynamic': `${product?.attributes[key]}`
                        }}
                        className={clsx('capitalize font-semibold',
                          key === ('color' || 'colour') && 'bg-[var(--dynamic)] px-2 text-white'
                        )}
                      >{product?.attributes[key]}</span>
                    </li>
                  )
                )}
              </ul>
            )}

            <div 
              onClick={() => {
                if(product?.canRate){
                  setIsRatingModalOpen(true);
                }
              }}
              className={clsx(`button px-3 py-1 h-fit smooth hover:shadow-lg
                hover:!border-primary-400 hover:text-primary-400 mt-auto`,
                product?.canRate ? '' : 'disabled-el'
              )}
            >Write a review for this product</div>
          </div>
          
        </div>

        {/* rating destribution */}
        <div className='w-[25%] shrink-0 p-3 inline-flex flex-col h-fit space-y-5'>
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

      <hr className='border-gray-300' />

      {/* reviews */}
      <div className="flex flex-col py-6 space-y-8">
        <h3>{
          userReviews?.length > 0 ?
            userReviews?.length > 1 ? 
              `${userReviews?.length} reviews`
              :
              '1 review'
          :
          'Fresh Product'
        }</h3>

        {
          userReviews && (
            <ul className='inline-flex flex-col space-y-5 divide-y divide-gray-200'>
              {paginatedReviews?.map(review => (
                <ReviewItem
                  key={review?._id}
                  review={review}
                  profileContainerClass='w-[5%]'
                />
              ))}
            </ul>
          )
        }
      </div>

      {/* pagination */}
      {totalPages > 1 && <div className='border-t border-gray-300 py-5 mt-5 flex justify-center'>
        <AdminPagination
          currentPage={currentPage} 
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>}

      <RateProductModal
        productId={product?._id}
        onSubmit={(review, updatedProduct) => handleOnSubmitReview(review, updatedProduct)}
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false)
        }}
      />

    </section>
  )
}

const ProductReviews = React.memo(ProductReviewsComponent);

export default ProductReviews