import React from 'react'
import { IoTrash } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getItemsTotal, removeFromCart } from '../../store/slices/CartSlice';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { setLoading } from '../../store/slices/CommonSlices';
import { useRemoveFromCartMutation } from '../../services/UserMutationHooks';
import AxiosToast from '../../utils/AxiosToast';

function CartDropdownComponent({onClose}) {

  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const cartTotal = useSelector(getItemsTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const removeFromCartMutation = useRemoveFromCartMutation()

  const handleRemoveCartItem = async(item) => {

    if(user?.roles.includes('user')){
      const response = await removeFromCartMutation.mutateAsync({ item_id: item?._id });
      if(response?.data?.success){

        const removed_id = response?.data?.item_id;
        dispatch(removeFromCart(removed_id));
        AxiosToast(response, false);
      }
    }else{
      dispatch(removeFromCart(item.id));
      toast.success("Item removed from cart",{position: 'top-center'})
    }
  }

  const handleClickViewCart = (e)=> {
    e.preventDefault();
    navigate('/cart')
    dispatch(setLoading(true))
    onClose()
  }

  const handleCheckOut = () => {
    if(user?.roles.includes('user')){
      navigate('/checkout')
      dispatch(setLoading(true))
      onClose()
    }
  }

  return (
    <div className="w-[330px]">

      {/* cart items */}
      <ul className='flex flex-col max-h-[60vh] overflow-y-auto scroll-basic space-y-5 p-5'>
        {items?.map(item => 
          <li key={item?._id} className='flex items-center space-x-4'>
            <div className="flex-[80px] shrink-0 grow-0 rounded-xl border border-gray-200 overflow-hidden">
              <img alt={item.name} src={item?.image?.thumb} className='max-w-full'/>
            </div>
            <div>
              <h4 className='text-base! text-primary-400! font-normal! capitalize'>{item.name}</h4>
              <p className='text-base! inline-flex items-center'>
                {item.quantity} × 
                <span className='price-before ms-1'>{item.price}</span>
              </p>
            </div>

            {/* remove bn */}
            <div
              onClick={(e) => {
                e.preventDefault();
                handleRemoveCartItem(item)
              }}
              className='smooth hover:text-red-400 inline-flex 
                justify-end grow cursor-pointer'>
              <IoTrash className='text-lg' />
            </div>
          </li>
        )}
      </ul>

      <hr className='border-t border-gray-200 mx-5'/>

      {/* total and nav buttons */}
      <div className="flex flex-col p-5">
        <h4 className='text-lg inline-flex items-center justify-between mb-5'>
          <span className='text-gray-500/70'>Total</span>
          <span className='price-before items-start price-before:leading-6! price-before:font-normal ms-5
            text-xl'>{cartTotal}</span>
        </h4>
        <div className="flex items-center justify-between">
          <div
            onClick={handleClickViewCart}
            className='border px-4 py-1 rounded-xl smooth hover:shadow-md
            hover:text-primary-400 hover:border-primary-300 cursor-pointer'
          >View cart</div>
          <span 
            onClick={handleCheckOut}
            className={clsx(`border px-4 py-1 rounded-xl  
            text-white font-bold tracking-wider smooth hover:bg-primary-400
            hover:shadow-lg hover:border-primary-400`,
              user?.roles?.includes('user') ? 
              'bg-primary-300 border-primary-300  cursor-pointer'
              : 'bg-gray-200 cursor-not-allowed pointer-events-none' 
            )}
          >Checkout</span>
        </div>
      </div>
    </div>
  )
}

const CartDropdown = React.memo(CartDropdownComponent);

export default CartDropdown