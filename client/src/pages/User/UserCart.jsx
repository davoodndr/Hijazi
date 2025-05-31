import React from 'react'
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { getCartTotal, updateQuantity } from '../../store/slices/CartSlice';

function UserCart() {

  const { items } = useSelector(state => state.cart);
  const cartSubTotal = useSelector(getCartTotal);
  const dispatch = useDispatch();

  return (
    <section className='w-full flex justify-center bg-gray-100 border-b border-gray-300'>
      <div className="w-9/10 flex items-start my-10 space-x-8">

        {/* products */}
        <div className='flex-grow'>
          <h3 className='text-xl'>Shopping Bag</h3>
          {items?.length ? 
            (<p><span className='font-bold'>{items?.length}
              {items?.length > 1 ? ' items' : ' item'} </span> in your bag
            </p>)
            :
            (<span>Bag is empty</span>)
          }

          {/* products */}
          <ul className='flex flex-col p-5 pb-0 mt-8 rounded-2xl bg-white shadow-lg 
            divide-y divide-gray-300 space-y-5'>
            {/* header */}
            <li className='grid grid-cols-[3fr_1fr_1fr_1fr] 
              justify-items-center border-0 capitalize font-bold'>
              <span className='w-full'>product</span>
              <span>price</span>
              <span>quantity</span>
              <span>total price</span>
            </li>

            {/* item */}
            {items.length > 0 ? 
            
              items.map(item => {

                const attributes = item?.attributes ? Object.entries(item.attributes) : [];
                const itemTotal = item.quantity * item.price;

                return (
                  <li key={item.id} className='grid grid-cols-[3fr_1fr_1fr_1fr] pb-5 justify-items-center'>
                    <div className='flex w-full items-center space-x-4'>
                      {/* image */}
                      <div className='w-30 rounded-2xl overflow-hidden'>
                        <img src={item.image?.thumb} alt="" />
                      </div>
                      {/* info */}
                      <div className='flex flex-col leading-normal'>
                        <div className='mb-2'>
                          <p className='uppercase text-[10px] text-gray-400'>{item?.category}</p>
                          <p className='capitalize font-bold'>{item.name}</p>
                        </div>
                        <div>
                          {attributes.length > 0 && attributes.map(([name, value]) => 
                            <div key={name} className='grid grid-cols-3 capitalize'>
                              <span className='text-gray-400 text-xs'>{name}</span>
                              {name === 'color' || name === 'colour' ?
                                <div className='point-before point-before:!me-3 point-before:!p-0.5'>
                                  <span
                                    style={{"--dynamic": value}}
                                    className='w-3 h-3 bg-(--dynamic) rounded-sm'
                                  ></span>
                                </div>
                                :
                                <span className='text-sm text-gray-600 point-before point-before:!me-3 point-before:!p-0.5'>{value}</span>
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className='price-before !text-base font-bold'>{item.price}</span>
                    <div className='flex items-center'>
                      <span 
                        onClick={() => item.quantity > 1 && dispatch(updateQuantity({id: item.id, quantity: item.quantity - 1}))}
                        className='cursor-pointer'>
                        <CiSquareMinus className='text-3xl' />
                      </span>
                      <span className='px-2'>{item.quantity}</span>
                      <span 
                        onClick={() => dispatch(updateQuantity({id: item.id, quantity: item.quantity + 1}))}
                        className='cursor-pointer'>
                        <CiSquarePlus className='text-3xl' />
                      </span>
                    </div>
                    <p className='price-before !text-base font-bold'>{itemTotal}</p>
                  </li>
                )
              })
              :
              (<div className='mb-5 text-center py-3 text-lg bg-primary-25 rounded-xl'>
                Bag is emply
              </div>)
            }
            
          </ul>
        </div>

        {/* right side summery */}
        <div className='w-[25%] shrink-0 p-2 rounded-2xl bg-white'>

          {/* coupon */}
          <div className='flex flex-col p-3 pb-8 space-y-4'>
            <h3 className='text-lg'>Coupon Code</h3>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. laboriosam dolores ipsum alias minus officiis iste sequi animi facilis?</p>
            <input 
              type="text"
              placeholder='Coupon code' 
            />
            <button className='w-full !bg-white !text-gray-600 border-2
             border-gray-300 font-bold hover:border-primary-300'
            >Apply</button>
          </div>

          {/* calculations */}
          <div className='flex flex-col rounded-xl bg-primary-50 p-4'>
            <h3 className='mb-4 text-xl'>Cart Amount</h3>
            <ul className='mb-6'>
              <li className='flex w-full items-center justify-between'>
                <span>Cart Subtotal</span>
                <span className='price-before price-before:!text-gray-400'>{cartSubTotal}</span>
              </li>
              <li className='flex w-full items-center justify-between'>
                <span>Discount</span>
                <div className=''>
                  <span>-</span>
                  <span className='price-before price-before:!text-gray-400 ps-0.5'>0</span>
                </div>
              </li>
              <li className='flex w-full items-center justify-between py-1'>
                <h3 className='text-base'>Cart Total</h3>
                <h3 className='price-before text-lg font-bold !items-start
                 price-before:!text-gray-400 !leading-5'>{cartSubTotal}</h3>
              </li>
            </ul>
            <div className='flex w-full'>
              <button className='w-full'>Checkout</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default UserCart