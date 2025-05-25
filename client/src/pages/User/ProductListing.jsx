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
import { containerVariants } from '../../utils/Anim';
import { LuSearch } from 'react-icons/lu';
import MoreSearchPopup from '../../components/user/MoreSearchPopup';
import { sortProductsByPrice } from '../../utils/Utils';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function ProductListingComponent() {

  const dispatch = useDispatch()
  const { items, productsLoading } = useSelector(state => state.products)
  const { categoryList } = useSelector(state => state.categories)
  const { brandList } = useSelector(state => state.brands)
  const [sortedProducts, setSortedProducts] = useState([])
  const [sortOption, setSortOption] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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
    range: [minPrice, maxPrice],
    selectedList: []
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

  const handleSelect = (e, id, name) => {
    
    if(e.target.checked){
      setFilters(prev => ({
        ...prev, 
        selectedList: [...prev.selectedList, {id, name}]
      }))
    }else{
      setFilters(prev => ({
        ...prev, 
        selectedList: prev.selectedList.filter(item => item.id !== id)
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
        filters.selectedList.some(item => item.id === p.brand._id) ||
        filters.selectedList.some(item => item.id === p.category._id);

      return priceMatch && selectMatch
    });
  }, [items, filters]);

  const [slicedCategoryList, setSlicedCategoryList] = useState([])
  const [slicedBrandList, setSlicedBrandList] = useState([])

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);


  useEffect(() => {

    setSlicedCategoryList(categoryList.slice(0,5))
    setSlicedBrandList(brandList.slice(0,5))

  },[categoryList, brandList])

  const handleClearAllFilters = () => {
    setFilters({
      range: [minPrice, maxPrice],
      selectedList: [],
    })
  }

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

  useEffect(() => {
    if (sortOption) {
      sortData(filteredProducts, sortOption.option, sortOrder);
    } else {
      setSortedProducts(filteredProducts);
    }
  }, [filteredProducts, sortOption, sortOrder]);

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

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='flex w-9/10 py-10 gap-6'>

      {/* left section */}
      <section className='w-[22%] shrink-0 flex flex-col gap-4'>

        {/* filter header & clear button */}
        <div className='ps-6 pt-3 flex justify-between items-center'>
          <h3 className='text-[16px]'>Filters</h3>
          
          <BadgeButton 
            onClick={handleClearAllFilters} 
            text='Clear All' 
            />
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
              <input 
                type="checkbox" 
                checked={filters.selectedList.some(item => item.id === category._id)}
                onChange={(e) => handleSelect(e,category._id, category.name)} 
                id={category._id}
              />
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
            onChange={(e, id, name) => handleSelect(e, id, name)}
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
              <input 
                type="checkbox"
                checked={filters.selectedList.some(item => item.id === brand._id)}
                onChange={(e) => handleSelect(e, brand._id, brand.name)} 
                id={brand._id} 
              />
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
      <section className='flex-grow flex flex-col justify-start h-fit space-y-5 py-3'>

        {/* filters and sort */}
        <div className='flex justify-between space-x-3 min-h-[74px]'>

          <div className='flex flex-col space-y-3'>
            <div>
              <p className='font-light text-base'>
                Found 
                <span className='font-bold text-primary-400 mx-1'>{sortedProducts.length}</span> 
                <span>product{sortedProducts.length > 1 ? 's' : ''}!</span> 
              </p>
            </div>
            {/* filter badges */}
            <motion.ul
              layout="position"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className='w-full'
            >
              <li className='space-x-2 space-y-2'>
                <AnimatePresence exitBeforeEnter>
                  {filters?.selectedList?.map(item => 
                    <BadgeButton 
                      showClear 
                      key={item.id} 
                      text={item.name} 
                      onClear={() => setFilters(prev => ({
                        ...prev,
                        selectedList: prev.selectedList.filter(el => el.id !== item.id)
                      }))}
                    />
                  )}
                </AnimatePresence>
              </li>
            </motion.ul>
          </div>

          {/* sort button */}
          <div className='h-fit inline-flex'>
            <DropdownButton
              label={setSortLabel() || 'Sort by'}
              labelClass='whitespace-nowrap'
              icon={<RxCaretSort className='text-xl' />}
              className='bg-white border border-gray-200 rounded-2xl !px-4 !py-2'
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence exitBeforeEnter>
          {productsLoading ?

            (<li className='grid grid-cols-4 gap-6 h-fit'>
              {Array(4).fill(null).map((_, i) => 
                <ProductCardMed key={i} index={i} product={{
                  category: {name:'Loading..'},
                  name: 'Loading..',
                  images: []
                }} />
              )}
            </li>)
            :
            (<li className='grid grid-cols-4 gap-6 h-fit'>
              
              {paginatedProducts?.map((product, i) => 
                <ProductCardMed key={product?._id} index={i} product={product} />
              )}
              
            </li>)
            
          }
          </AnimatePresence>
        </motion.ul>
        
        {/* pagination */}
        {totalPages > 1 && <div className='border-t border-gray-300 py-5 mt-5 flex justify-center'>
          <AdminPagination
            currentPage={currentPage} 
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>}

      </section>

    </div>
  )
}

const ProductListing = React.memo(ProductListingComponent)

export default ProductListing