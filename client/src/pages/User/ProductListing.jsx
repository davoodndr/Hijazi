import React from 'react'
import ProductCardMed from '../../components/user/ProductCardMed';
import BadgeButton from '../../components/ui/BadgeButton';
import DropdownButton from '../../components/ui/DropdownButton';
import { RxCaretSort } from "react-icons/rx";
import { useMemo } from 'react';
import AdminPagination from '../../components/user/Pagination';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchProducts } from '../../store/slices/ProductSlices';
import { fetchBrands } from '../../store/slices/BrandSlice';
import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AnimatePresence, motion } from 'motion/react';
import { transformContainerVariants } from '../../utils/Anim';

function ProductListingComponent() {

  const dispatch = useDispatch()
  const { items } = useSelector(state => state.products)
  const { categoryList } = useSelector(state => state.categories)
  const { brandList } = useSelector(state => state.brands)

  //console.log(brandList)

  useEffect(() => {
    dispatch(fetchBrands())
    dispatch(fetchProducts())
  }, [])


  /* filter section */

  const validPrices = items.flatMap((p) =>
    [p?.price, ...p.variants.map((v) => v.price)]
  ).filter(p => typeof p === 'number' && !isNaN(p));

  const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
  const maxPrice = validPrices.length ? Math.max(...validPrices) : 0;

  const [filters, setFilters] = useState({
    range: [minPrice, minPrice],
    selectedCategories: [],
    selectedBrands: [],
  })

  useEffect(() => {
    if (validPrices.length) {
      setFilters(prev => ({
        ...prev,
        range: [minPrice, maxPrice]
      }));
    }
  }, [minPrice, maxPrice]);


  const handleChangeRange = (data) => {
    setFilters(prev => ({
      ...prev,
      range: data
    }))
  };

  const handleCategorySelect = (e, id) => {
    
    if(e.target.checked){
      setFilters(prev => ({...prev, selectedCategories: [...prev.selectedCategories, id]}))
    }else{
      setFilters(prev => ({
        ...prev, 
        selectedCategories: prev.selectedCategories.filter(cat => cat !== id)
      }))
    }
  }

  const handleBrandSelect = (e, id) => {
    
    if(e.target.checked){
      setFilters(prev => ({...prev, selectedBrands: [...prev.selectedBrands, id]}))
    }else{
      setFilters(prev => ({
        ...prev, 
        selectedBrands: prev.selectedBrands.filter(cat => cat !== id)
      }))
    }
  }

  const filteredProducts = useMemo(() => {
    return items.filter((p) => {

      // price filter
      const matchesProductPrice = p.price >= filters.range[0] && p.price <= filters.range[1];
      const matchesVariantPrice = p.variants?.some(
        (v) => v.price >= filters.range[0] && v.price <= filters.range[1]
      );

      const priceMatch = matchesProductPrice || matchesVariantPrice;

      //category filter
      const categoryMatch = !filters.selectedCategories.length 
        || filters.selectedCategories.includes(p.category._id);

      // brand filter
      const brandMatch = !filters.selectedBrands.length 
        || filters.selectedBrands.includes(p.brand._id);

      return priceMatch && categoryMatch && brandMatch;
    });
  }, [items, filters]);

  return (
    <div className='flex w-9/10 py-10 gap-6'>

      {/* left section */}
      <section className='w-[22%] flex flex-col gap-4'>

        {/* filter header & clear button */}
        <div className='ps-6 pt-3 flex justify-between items-center'>
          <h3 className='text-[16px]'>Filters</h3>
          
          <BadgeButton text='Clear All' />
        </div>

        {/* category filters */}
        <ul className='border border-gray-300 p-6'>

          <div className='flex items-center justify-between relative'>
            <h4 className='lined-header-small w-full z-1'>Categories</h4>

            {/* group search */}
            {/* <div className='absolute right-0 top-0 z-10
              bg-red-200 w-full py-1 ps-2 inline-flex justify-between items-center
              rounded-2xl'>
              <input type="text" className='!bg-white !border-0 !rounded-md !h-6' />
              <LuSearch className='text-lg mx-2' />
            </div> */}
          </div>

          {categoryList.slice(0,5).map((category, i) => 
            <li key={category._id} className='flex items-center w-fit py-1.5'>
              <input type="checkbox" onChange={(e) => handleCategorySelect(e,category._id)} id={category._id}/>
              <label htmlFor={category._id} 
                className='!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize'
                >{category.name}
              </label>
            </li>
          )}
          {categoryList.slice(5).length > 0 &&
            <li className='ps-4 text-primary-400 cursor-pointer mt-2'>+{categoryList.slice(5).length} more</li>}
          
        </ul>

        {/* brand filters */}
        <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Brands</h4>
          
          {brandList?.slice(0,5).map((brand, i) => 
            <li key={brand._id} className='flex items-center w-fit py-2'>
              <input type="checkbox" onChange={(e) => handleBrandSelect(e, brand._id)} id={brand._id} />
              <label htmlFor={brand._id} 
              className='!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize'
              >{brand.name}</label>
            </li>
          )}
          {brandList.slice(5).length > 0 &&
            <li className='ps-4 text-primary-400 cursor-pointer mt-2'>+{brandList.slice(5).length} more</li>}
          
        </ul>

        {/* price filter */}
        <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Price</h4>
          
          <li className='flex flex-col w-full py-2 gap-1'>
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              value={filters.range}
              onChange={handleChangeRange}
              allowCross={false}
            />
            <p htmlFor="cat-1" className=''>
              <span className='price-before'>{filters.range[0]}</span>
              <span className='px-2'>-</span>
              <span className='price-before'>{filters.range[1]}</span>
            </p>
          </li>
          
        </ul>

        {/* color filter */}
        {/* <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Colors</h4>
          
          {Array(5).fill(null).map((el, i) => 
            <li key={i} className='flex items-center w-fit py-2'>
              <input type="checkbox" name="" id="cat-1" />
              <label htmlFor="cat-1" className='!text-sm !text-gray-600 !ps-2 cursor-pointer'>Shoes & Bags</label>
            </li>
          )}
          <li className='ps-4 text-primary-400 cursor-pointer'>+2 more</li>
          
        </ul> */}

      </section>

      {/* right section - products */}
      <section className='flex flex-col justify-start h-fit space-y-5 py-3'>

        <div className='flex justify-between'>
          <div>
            <BadgeButton text='filter' />
          </div>

          {/* sort button */}
          <div className=''>
            <DropdownButton
              label='Sort by'
              icon={<RxCaretSort className='text-xl' />}
              className='border border-gray-200 rounded-2xl !px-4 !py-2'
              items={useMemo(() => [
                { id: 'pricel2h',
                  text: <span className='capitalize'>price: low to high</span>,
                  onClick: () => {}
                },
                { id: 'priceh2l',
                  text: <span className='capitalize'>price: high to low</span>,
                  onClick: () => {}
                },
                { id: 'newfirst',
                  text: <span className='capitalize'>New first</span>,
                  onClick: () => {}
                },
                { id: 'oldfirst',
                  text: <span className='capitalize'>Old first</span>,
                  onClick: () => {}
                },
                /* { id: 'custom1',
                  custom: (
                    <div className='menu-bg px-4'>
                      <input type="checkbox" name="" id="pricel2h" />
                      <label htmlFor='pricel2h' 
                        className={`capitalize py-2.5 px-2 !text-sm !text-gray-600 cursor-pointer`}
                      > price: low to high </label>
                    </div>
                  )
                },
                { id: 'custom2',
                  custom: (
                    <div className='menu-bg px-4'>
                      <input type="checkbox" name="" id="pricel2h" />
                      <label htmlFor='pricel2h' 
                        className={`capitalize py-2.5 px-2 !text-sm !text-gray-600 cursor-pointer`}
                      > price: low to high </label>
                    </div>
                  )
                }, */
              ],[])}
            />
          </div>
        </div>
        
        {/* products */}

        <motion.ul
          layout="position"
          variants={transformContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <li className='flex-grow grid grid-cols-4 gap-6 h-fit'>
            <AnimatePresence exitBeforeEnter>
              {filteredProducts.map((product, i) => 
                <ProductCardMed key={product?._id} index={i} product={product} />
              )}
            </AnimatePresence>
          </li>
        </motion.ul>
        
        {/* pagination */}
        <div className='border-t border-gray-300 py-5 mt-5 flex justify-center'>
          <AdminPagination />
        </div>

      </section>

    </div>
  )
}

const ProductListing = React.memo(ProductListingComponent)

export default ProductListing