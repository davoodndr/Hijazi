import React from 'react'
import { IoIosClose } from 'react-icons/io'
import { LuSearch } from "react-icons/lu";
import ProductCardMed from '../../components/user/ProductCardMed';
import BadgeButton from '../../components/ui/BadgeButton';
import Select from 'react-select'
import DropdownButton from '../../components/ui/DropdownButton';
import { RxCaretSort } from "react-icons/rx";
import { useMemo } from 'react';
import AdminPagination from '../../components/user/Pagination';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchProducts } from '../../store/slices/ProductSlices';

function ProductListingComponent() {

  const dispatch = useDispatch()
  const { items } = useSelector(state => state.products)
  const { categoryList } = useSelector(state => state.categories)

  console.log(categoryList)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

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
              <input type="checkbox" name="" id={category._id}/>
              <label htmlFor={category._id} 
                className='!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize'
                >{category.name}
              </label>
            </li>
          )}
          <li className='ps-4 text-primary-400 cursor-pointer'>+{categoryList.slice(5).length} more</li>
          
        </ul>

        {/* brand filters */}
        <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Brands</h4>
          
          {Array(5).fill(null).map((el, i) => 
            <li key={i} className='flex items-center w-fit py-2'>
              <input type="checkbox" name="" id="cat-1" />
              <label htmlFor="cat-1" className='!text-sm !text-gray-600 !ps-2 cursor-pointer'>Shoes & Bags</label>
            </li>
          )}
          <li className='ps-4 text-primary-400 cursor-pointer'>+2 more</li>
          
        </ul>

        {/* price filter */}
        <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Price</h4>
          
          <li className='flex flex-col w-full py-2 gap-1'>
            <input type="range" id="slider" min={0} max={100} />
            <label htmlFor="cat-1" className='!text-sm !text-gray-600'>Range</label>
          </li>
          
        </ul>

        {/* color filter */}
        <ul className='border border-gray-300 p-6'>
          <h4 className='lined-header-small'>Colors</h4>
          
          {Array(5).fill(null).map((el, i) => 
            <li key={i} className='flex items-center w-fit py-2'>
              <input type="checkbox" name="" id="cat-1" />
              <label htmlFor="cat-1" className='!text-sm !text-gray-600 !ps-2 cursor-pointer'>Shoes & Bags</label>
            </li>
          )}
          <li className='ps-4 text-primary-400 cursor-pointer'>+2 more</li>
          
        </ul>

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
        <div className='flex-grow grid grid-cols-4 gap-6 h-fit'>
          {items.map((product, i) => 
            <ProductCardMed key={product?._id} product={product} />
          )}
        </div>
        
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