import React, { useState } from 'react'
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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AnimatePresence, motion } from 'motion/react';
import { transformContainerVariants } from '../../utils/Anim';
import { LuSearch } from 'react-icons/lu';
import MoreSearchPopup from '../../components/user/MoreSearchPopup';
import { sortProductsByPrice } from '../../utils/Utils';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function ProductListingComponent() {

  const dispatch = useDispatch()
  const { items } = useSelector(state => state.products)
  const { categoryList } = useSelector(state => state.categories)
  const { brandList } = useSelector(state => state.brands)
  const [sortedProducts, setSortedProducts] = useState([])
  const [sortOption, setSortOption] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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
    selectedList: [],
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

  const handleSelect = (e, id) => {
    
    if(e.target.checked){
      setFilters(prev => ({...prev, selectedList: [...prev.selectedList, id]}))
    }else{
      setFilters(prev => ({
        ...prev, 
        selectedList: prev.selectedList.filter(cat => cat !== id)
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

      // other select
      const selectMatch = !filters.selectedList.length ||
        filters.selectedList.includes(p.brand._id) ||
        filters.selectedList.includes(p.category._id);

      return priceMatch && selectMatch
    });
  }, [items, filters]);

  useEffect(() => {
    if (sortOption) {
      sortData(filteredProducts, sortOption.option, sortOrder);
    } else {
      setSortedProducts(filteredProducts);
    }
  }, [filteredProducts, sortOption, sortOrder]);

  const [slicedCategoryList, setSlicedCategoryList] = useState([])
  const [slicedBrandList, setSlicedBrandList] = useState([])

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);


  useEffect(() => {

    setSlicedCategoryList(categoryList.slice(0,5))
    setSlicedBrandList(brandList.slice(0,5))

  },[categoryList, brandList])

  /* sort data */
  const sortData = (products, need, order) => {
    let sorted; 
    
    if(products){

      switch (need) {
        case 'price':
          sorted = sortProductsByPrice(products, order);
          break;

        default:
          sorted = [...products].sort((a, b) => {
            const aVal = a[need];
            const bVal = b[need];

            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return order === 'desc'
                ? bVal.localeCompare(aVal)
                : aVal.localeCompare(bVal);
            }

            return order === 'desc'
              ? (aVal < bVal ? 1 : aVal > bVal ? -1 : 0)
              : (aVal > bVal ? 1 : aVal < bVal ? -1 : 0);
          });
      }

      if(sorted?.length){
        setSortedProducts(sorted);
      }
    }
  }

  const applySort = (option, order = 'asc',index) => {
    setSortOption({index, option});
    setSortOrder(order);
  };

  const sortOptionsRaw = [
    { text: 'price: low to high', field: 'price', order: 'asc' },
    { text: 'price: high to low', field: 'price', order: 'desc' },
    { text: 'newest first', field: 'createdAt', order: 'desc' },
    { text: 'oldest first', field: 'createdAt', order: 'asc' }
  ];

  const setSortLabel = () => {
    const currentSort = sortOptionsRaw[sortOption?.index]?.text;
    return currentSort
  }

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
        <ul className='border border-gray-300 p-6 relative smooth'>

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

          {slicedCategoryList.map((category, i) => 
            <li key={category._id} className='flex items-center w-fit py-1.5'>
              <input type="checkbox" onChange={(e) => handleSelect(e,category._id)} id={category._id}/>
              <label htmlFor={category._id} 
                className='!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize'
                >{category.name}
              </label>
            </li>
          )}
          {categoryList.slice(5).length > 0 && slicedCategoryList.length !== categoryList.length &&
            <li onClick={() => {
                if(categoryList.slice(5).length > 10){
                  setIsCategoryModalOpen(true)
                }else{
                  setSlicedCategoryList(categoryList)
                }
              }}
              className='ps-4 text-primary-400 cursor-pointer mt-2'>+{categoryList.slice(5).length} more</li>
          }

          <MoreSearchPopup
            type='categories'
            isOpen={isCategoryModalOpen}
            onChange={(e, id) => handleSelect(e, id)}
            list={categoryList}
            selectedList={filters.selectedList}
            onClose={() => setIsCategoryModalOpen(false)}
          />
          
        </ul>

        {/* brand filters */}
        <ul className='border border-gray-300 p-6 relative'>
          <h4 className='lined-header-small'>Brands</h4>
          
          {slicedBrandList.map((brand, i) => 
            <li key={brand._id} className='flex items-center w-fit py-2'>
              <input type="checkbox" onChange={(e) => handleSelect(e, brand._id)} id={brand._id} />
              <label htmlFor={brand._id} 
              className='!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize'
              >{brand.name}</label>
            </li>
          )}
          {brandList.slice(5).length > 0 && slicedBrandList.length !== brandList.length &&
            <li onClick={() => {
              {
                if(categoryList.slice(5).length > 10){
                  setIsBrandModalOpen(true)
                }else{
                  setSlicedBrandList(brandList)
                }
              }
            }}
              className='ps-4 text-primary-400 cursor-pointer mt-2'>+{brandList.slice(5).length} more</li>
          }
          
          <MoreSearchPopup
            type='brands'
            isOpen={isBrandModalOpen}
            onChange={(e, id) => handleSelect(e, id)}
            list={brandList}
            selectedList={filters.selectedList}
            onClose={() => setIsBrandModalOpen(false)}
          />
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
              trackStyle={{
                backgroundColor: 'var(--color-primary-400)'
              }}
              handleStyle={{
                backgroundColor: 'var(--color-primary-400)',
                borderColor: 'var(--color-primary-400)',
                opacity: 1
              }}
            />
            <p htmlFor="cat-1" className=''>
              <span className='price-before font-semibold'>{filters.range[0]}</span>
              <span className='px-2'>-</span>
              <span className='price-before font-semibold'>{filters.range[1]}</span>
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
              label={setSortLabel() || 'Sort by'}
              icon={<RxCaretSort className='text-xl' />}
              className='border border-gray-200 rounded-2xl !px-4 !py-2'
              items={useMemo(() => sortOptionsRaw.map((opt, i) => (
              
                { id: `${opt.field}-${opt.order}`,
                  custom: (
                    <div className='menu-bg px-4'>

                      <IoMdCheckmarkCircleOutline 
                        className={`text-xl ${sortOption?.index === i ? 'text-primary-400' : 'text-gray-300'}`} />

                      <label 
                        onClick={() => applySort(opt.field, opt.order, i)}
                        htmlFor='pricel2h' 
                        className={`capitalize py-2.5 px-2 !text-sm !text-gray-600 cursor-pointer`}
                      > {opt.text} </label>
                    </div>
                  )
                })),[sortedProducts])}
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
              {sortedProducts?.map((product, i) => 
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