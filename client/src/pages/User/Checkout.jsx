import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { getCartCount, getCartTotal } from '../../store/slices/CartSlice';
import { IoWallet } from "react-icons/io5";
import ToggleSwitch  from '../../components/ui/ToggleSwitch'
import { CiDeliveryTruck } from 'react-icons/ci';
import { GoLocation } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { LuHousePlus } from "react-icons/lu";
import razorpay from '../../assets/razorpay-icon.svg'
import { RiCoupon3Fill } from "react-icons/ri";

function Checkout() {

  const { items } = useSelector(state => state.cart);
  const cartCount = useSelector(getCartCount);
  const cartTotal = useSelector(getCartTotal);
  const [grandTotal, setGrandTotal] = useState(0);

  return (
    <section className='flex-grow w-full bg-gray-50 flex flex-col items-center py-15'>

      <div className='flex w-9/10 space-x-10'>
        {/* left side */}
        <div className="flex flex-col flex-grow">

          {/* items */}
          <div className='bg-primary-50 rounded-3xl'>
            {/* header */}
            <div className='flex p-6 space-x-4'>
              <h3 className='text-xl'>Order Summery</h3>
              {cartCount ? 
                (<p className='text-gray-400 bg-primary-25 px-2 rounded-2xl'>
                  {cartCount}
                  {cartCount > 1 ? ' items' : ' item'}
                </p>)
                :
                (<span>Bag is empty</span>)
              }
            </div>
          
            <ul className='bg-white p-6 space-y-5 shadow-md rounded-3xl'>
              {/* item */}
              {items?.length ? items?.map((item, index) => {
                const attributes = item?.attributes ? Object.entries(item.attributes) : [];
                const itemTotal = item.quantity * item.price;
                
                return (
                  <li key={`${item.id}-${index}`} className='grid grid-cols-[2fr_1fr_1fr] not-last:pb-5 not-last:border-b border-gray-200'>
                    <div className='inline-flex space-x-4'>
                      <div className='w-20 h-20 border border-gray-200 rounded-lg overflow-hidden'>
                        <img src={item.image.thumb} alt={item.name} />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <div>
                          <p className='uppercase text-xs text-gray-400/80 mb-1'>{item.category}</p>
                          <h3 className='capitalize mb-1.5'>{item.name}</h3>
                        </div>
                        <ul className='flex space-x-2'>
                          {attributes.length > 0 && attributes.map(([name, val]) => 
                            <li key={name} className='not-first:point-before point-before:!bg-gray-500 point-before:!p-0.5 
                              point-before:!me-2 !text-sm !text-gray-400'>{val}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className='inline-flex space-x-2 items-center justify-end relative
                      before:content-["rate"] before:capitalize before:absolute before:top-2 before:text-gray-300'>
                      <h3 className='price-before price-before:font-normal'>{item.price}</h3>
                      <p className='text-gray-500'>x</p>
                      <h3>{item.quantity}</h3>
                    </div>
                    <div className='inline-flex flex-col justify-center items-end capitalize relative
                      before:content-["total"] before:absolute before:top-2 before:text-gray-300'>
                      <h3 className='price-before price-before:font-normal price-before:text-sm text-lg items-start'>{itemTotal}</h3>
                    </div>
                  </li>
                )})
                :
                (<li className='mb-5 text-center py-3 text-lg bg-primary-25 rounded-xl'>
                  Bag is emply
                </li>)
              }
            </ul>
          </div>
        </div>

        {/* right side */}
        <div className='w-[30%] shrink-0 bg-white rounded-3xl flex flex-col shadow-md'>
          {/* wallet activation */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className="flex items-center space-x-3">
                <span className='inline-flex w-10 h-10 items-center justify-center bg-primary-25 rounded-full'>
                  <IoWallet className='text-xl text-primary-300'/>
                </span>
                <div className='inline-flex flex-col leading-4.5'>
                  <h3>Use Credit for this purchase</h3>
                  <p className='text-gray-400'>Available balance: 
                    <span className='ms-1 price-before font-semibold text-primary-400'>500</span>
                  </p>
                </div>
              </div>
              <ToggleSwitch />
            </div>
            <p className='text-gray-400/70'>
              Your wallet balance are not sufficient to pay the order, please select an additional payment method to cover the balance of 
              <span className='ms-1 price-before text-red-400'>{grandTotal}</span>
            </p>
          </div>

          {/* payment methods */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h3>Choose How to pay</h3>
              <span className='text-primary-400 inline-flex leading-normal cursor-pointer
                  rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ New</span>
            </div>
            <ul className='space-y-2'>
              <li className='flex items-center justify-between px-4 border border-gray-200 rounded-2xl
                smooth hover:bg-primary-50 hover:border-primary-300'>
                <label 
                  htmlFor="razor-pay"
                  className='!text-sm flex w-full cursor-pointer py-5 !text-gray-500 !font-bold'
                >
                  <img src={razorpay} alt="razorpay-logo" className='w-25' />
                </label>
                <input type="radio" name="" id="razor-pay" />
              </li>
              <li className='flex items-center justify-between px-4 border border-gray-200 rounded-2xl
                smooth hover:bg-primary-50 hover:border-primary-300'>
                <label 
                  htmlFor="razor-pay"
                  className='!text-base flex w-full cursor-pointer py-5 !text-gray-500 !font-bold'
                >
                  Cash on delivery
                </label>
                <input type="radio" name="" id="razor-pay" />
              </li>
            </ul>
          </div>

          {/* addresses */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            {/* billing address */}
            <div>
              <div className='flex items-center justify-between'>
                <h3 className='mb-2 flex items-center'>
                  <GoLocation className='me-2 text-xl'/>
                  Billing Address
                </h3>
                {/* <span className='p-0.5 rounded-lg text-gray-400 cursor-pointer 
                  smooth hover:bg-primary-50 hover:shadow hover:text-black'>
                  <MdEdit className='text-xl' />
                </span> */}
                <span className='text-primary-400 inline-flex leading-normal cursor-pointer
                  rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ Add</span>
              </div>
              <p className='text-sm text-gray-300 ms-7'>Not addded</p>
              {/* <p className='capitalize text-sm text-gray-500 ms-7'>davood hakkim pm, erolakkandi, near ch bridge, naduvannur, calicut - dis, 673614</p> */}
            </div>

            {/* shipping address */}
            <div>
              <div className='flex items-center justify-between'>
                <h3 className='mb-2 flex items-center'>
                  <GoLocation className='me-2 text-xl'/>
                  Shipping Address
                </h3>
                {/* <span className='p-0.5 rounded-lg text-gray-400 cursor-pointer 
                  smooth hover:bg-primary-50 hover:shadow hover:text-black'>
                  <MdEdit className='text-xl' />
                </span> */}
                <span className='text-primary-400 inline-flex leading-normal cursor-pointer
                  rounded-xl smooth hover:bg-primary-100 hover:px-2'>+ Add</span>
              </div>
              <p className='text-sm text-gray-300 ms-7'>Not addded</p>
              {/* <p className='capitalize text-sm text-gray-500 ms-7'>davood hakkim pm, erolakkandi, near ch bridge, naduvannur, calicut - dis, 673614</p> */}
            </div>
          </div>

          {/* applied coupon */}
          <div className='flex flex-col p-5 space-y-4 border-b border-gray-200'>
            <h3 className='flex items-center'>Coupon code</h3>
            <div>
              <div className='border border-gray-200 rounded-lg p-3 flex items-center justify-between'>
                <div className='inline-flex items-center space-x-2 text-primary-300'>
                  <RiCoupon3Fill className='text-lg' />
                  <h3 className='!text-primary-400 uppercase'>XXXX</h3>
                </div>
                <span className='leading-normal text-red-300 cursor-pointer
                smooth hover:text-red-500'>Remove</span>
              </div>
              <span className='text-xs text-primary-300'>Coupon code is valid</span>
            </div>
          </div>
          
          {/* totals */}
          <div className='flex flex-col p-5 space-y-2'>
            <p className='flex items-center justify-between text-gray-400 text-base'>
              <span>Subtotal ({cartCount} {cartCount > 1 ? 'items' : 'item'})</span>
              <span className='price-before price-before:!font-normal'>{cartTotal}</span>
            </p>
            <p className='flex items-center justify-between text-gray-400 text-base'>
              <span>Discount</span>
              <span>-<span className='ms-1 price-before price-before:!font-normal'>{0}</span></span>
            </p>

            {/* total */}
            <h3 className='mt-4 flex items-center justify-between text-gray-400 text-lg'>
              <span>Total</span>
              <span className='price-before price-before:!font-normal'>{cartTotal}</span>
            </h3>
          </div>

          <div className='flex p-5'>
            <button className='w-full font-bold'>Pay Now</button>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Checkout