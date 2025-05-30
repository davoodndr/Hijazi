import React from 'react'
import { IoTrash } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getCartTotal, removeFromCart } from '../../store/slices/CartSlice';
import { Link } from 'react-router';

function CartDropdownComponent({className}) {

  const { items } = useSelector(state => state.cart)
  const cartTotal = useSelector(getCartTotal);
  const dispatch = useDispatch();

  return (
    <div className={`border border-gray-200 nav-account-dropdown bg-white absolute top-full -right-25
                  shadow-lg max-h-60vh overflow-y-auto scroll-basic md:invisible opacity-0
                  ${className}`}
                  >
      <div className="w-[320px] p-5">

        {/* cart items */}
        <ul>
          {items.map(item => 
            <li key={item.id} className='flex items-center mb-5 space-x-4'>
              <div className="flex-[80px] shrink-0 grow-0 rounded-xl border border-gray-200 overflow-hidden">
                <img alt={item.name} src={item?.image?.thumb} className='max-w-full'/>
              </div>
              <div>
                <h4 className='!text-base !text-primary-400 !font-normal capitalize'>{item.name}</h4>
                <p className='!text-base inline-flex items-center'>
                  {item.quantity} × 
                  <span className='price-before ms-1'>{item.price}</span>
                </p>
              </div>

              {/* remove bn */}
              <div
                onClick={() => dispatch(removeFromCart(item.id))}
                className='smooth hover:text-red-400 inline-flex justify-end flex-grow'>
                <IoTrash className='text-lg' />
              </div>
            </li>
          )}
        </ul>

        {/* total and nav buttons */}
        <div className="flex flex-col border-t border-gray-300 pt-5">
          <h4 className='text-lg inline-flex items-center justify-between mb-5'>
            <span className='text-gray-500/70'>Total</span>
            <span className='price-before items-start price-before:!leading-6 price-before:font-normal ms-5
              text-xl'>{cartTotal}</span>
          </h4>
          <div className="flex items-center justify-between">
            <Link to='/cart' className='border px-4 py-1 rounded-xl smooth hover:shadow-md
              hover:text-primary-400 hover:border-primary-300'
              >View cart</Link>
            <a className='border px-4 py-1 rounded-xl bg-primary-300 border-primary-300
              text-white font-bold tracking-wider smooth hover:bg-primary-400
              hover:shadow-lg hover:border-primary-400'
              >Checkout</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const CartDropdown = React.memo(CartDropdownComponent);

export default CartDropdown