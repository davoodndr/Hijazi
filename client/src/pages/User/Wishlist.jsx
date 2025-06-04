import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoTrashOutline } from 'react-icons/io5';
import { addToCart, syncCartitem } from '../../store/slices/CartSlice';
import { deleteWishlistItem, removeFromList } from '../../store/slices/WishlistSlice';
import toast from 'react-hot-toast';

function Wishlist() {

  const { list } = useSelector(state => state.wishlist);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleAddToCart = async(item) => {
    /* {
                        dispatch(addToCart({
                          id: item.id,
                          name:item.name,
                          category:item.category,
                          sku:item.sku,
                          price:item.price,
                          quantity: item.quantity,
                          image:item.image,
                          attributes:item.attributes,
                          variant_id: item.variant_id
                        }))
                        
                      } */
    const newitem = {
      id: item.id,
      name:item.name,
      category:item.category,
      sku:item.sku,
      price:item.price,
      quantity: 1,
      image:item.image,
      attributes:item.attributes,
      product_id: item.product_id
    }

    if(user?.roles?.includes('user')){
      const {payload: data} = await dispatch(syncCartitem({item: newitem}))
      console.log(data)
      if(data?.success){
        await dispatch(deleteWishlistItem({item: newitem}))
        toast.success(data.message,{position: 'top-center'})
      }
    }else{
      dispatch(addToCart({item: newitem}))
      dispatch(removeFromList(item.id))
      toast.success("Item added to cart",{position: 'top-center'})
    }
  }

  const handleRemoveItem = (item) => {
    if(user?.roles?.includes('user')){
      dispatch(deleteWishlistItem({item}))
      toast.success("Item removed from Wishlist",{position: 'top-center'})
    }
  }

  return (
    <section className='w-full flex-grow flex justify-center bg-gray-100 border-b border-gray-300'>
      <div className="w-9/10 flex items-start my-10 space-x-8">

        {/* products */}
        <div className='flex-grow'>
          <h3 className='text-xl'>Wishlist</h3>
          {list?.length ? 
            (<p><span className='font-bold'>{list?.length}
              {list?.length > 1 ? ' items' : ' item'} </span> in list
            </p>)
            :
            (<span>List is empty</span>)
          }

          {/* products */}
          <ul className='flex flex-col p-5 pb-0 mt-8 rounded-2xl bg-white shadow-lg 
            divide-y divide-gray-300 space-y-5'>
            {/* header */}
            <li className='grid grid-cols-[3fr_1fr_1fr_1fr] 
              justify-items-center border-0 capitalize font-bold'>
              <span className='w-full'>product</span>
              <span>price</span>
              <span>stock status</span>
              <span>actions</span>
            </li>

            {/* item */}
            {list?.length > 0 ?
              list?.map(item => {

              const attributes = item?.attributes ? Object.entries(item.attributes) : [];

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
                            <span className='text-gray-400 text-sm'>{name}</span>
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
                    {item.stock < 5 ?
                      <span className='text-red-400'>Only few left!</span>
                      :
                      <span className='text-primary-400'>In stock</span>
                    }
                  </div>

                  {/* actions */}
                  <div className='flex items-center space-x-3'>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className='!py-1.5 !px-4'>Add to Bag</button>

                    <div 
                      onClick={() => handleRemoveItem(item)}
                      className='p-2 border rounded-input-border border-gray-300 cursor-pointer
                      smooth hover:bg-red-400 hover:border-red-400 hover:text-white'>
                      <IoTrashOutline className='text-xl' />
                    </div>
                  </div>
                </li>
              )})
              :
              (<div className='mb-5 text-center py-3 text-lg bg-primary-25 rounded-xl'>
                List is emply
              </div>)
            }
            
          </ul>
        </div>

      </div>
    </section>
  )
}

export default Wishlist