import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { IoIosAdd, IoIosArrowForward, IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io'
import { IoDocumentTextOutline, IoLocationOutline, IoWallet } from 'react-icons/io5'
import { LuArrowUpRight, LuLogIn, LuMail, LuMapPin, LuPhone, LuUser } from 'react-icons/lu'
import { MdPayments } from "react-icons/md";
import { TbArrowBackUp } from 'react-icons/tb'
import { FaRegAddressBook } from "react-icons/fa";
import { HiHome, HiMiniArrowsUpDown } from "react-icons/hi2";
import place_holder from '../../../assets/user_placeholder.jpg'
import { Axios } from '../../../utils/AxiosSetup'
import ApiBucket from '../../../services/ApiBucket'
import { format } from 'date-fns'
import OrdersListItem from '../../../components/user/OrdersListItem'
import clsx from 'clsx'
import PreviewImage from '../../../components/ui/PreviewImage'
import ImagePlaceHolder from '../../../components/ui/ImagePlaceHolder'
import StarRating from '../../../components/ui/StarRating'

function ViewUser() {

  const location = useLocation();
  const navigate = useNavigate();
  const { user: user_id } = location?.state;
  const [user, setUser] = useState(null);

  useEffect(()=> {
    
    if(user_id){
      getUserInfo(user_id);
    }
  },[user_id])

  const getUserInfo = async(user_id)=> {
    
    try {
      
      const response = await Promise.allSettled([
        Axios({
          ...ApiBucket.getUserInfo,
          params: { user_id }
        }).then(res => res?.data?.user),

        Axios({
          ...ApiBucket.getCart,
          params: { user_id }
        }).then(res => res?.data?.cart),

        Axios({
          ...ApiBucket.getWishlist,
          params: { user_id }
        }).then(res => res?.data?.wishlist),

        Axios({
          ...ApiBucket.getOrders,
          params: { user_id }
        }).then(res => res?.data?.orders),

        Axios({
          ...ApiBucket.getUserReviews,
          params: { user_id }
        }).then(res => res?.data?.reviews),
        
        Axios({
          ...ApiBucket.getWallet,
          params: { user_id }
        }).then(res => res?.data?.wallet)
      ]);

      const [userInfoRes, cartRes, wishlistRes, ordersRes, reviewRes, walletRes] = response;

      const userInfo = userInfoRes.status === 'fulfilled' ? userInfoRes.value : null;
      const cart = cartRes.status === 'fulfilled' ? cartRes.value : null;
      const wishlist = wishlistRes.status === 'fulfilled' ? wishlistRes.value : null;
      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value : null;
      const reviews = reviewRes.status === 'fulfilled' ? reviewRes.value : null;
      const wallet = walletRes.status === 'fulfilled' ? walletRes.value : null;

      let income = 0, expense = 0; 
      for(const item of wallet?.transactions){
        if(item?.type === 'credit') income += item?.amount;
          else expense += item?.amount
      }
      
      const data = {
        ...userInfo,
        cart,
        wishlist,
        orders: orders?.sort((a,b) => b?.createdAt.localeCompare(a?.createdAt)),
        reviews: reviews?.sort((a,b) => b?.createdAt.localeCompare(a?.createdAt)),
        wallet: {
          ...wallet,
          transactions: wallet?.transactions?.sort((a,b) => b?.createdAt.localeCompare(a?.createdAt))
            .map((item, i) => ({...item, sl:++i})),
          income,
          expense
        },
      }
      
      setUser(data)

    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }

  }

  return (
    <section className='flex flex-col p-6'>
      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>User Account</h3>
        </div>
        <div className="inline-flex items-stretch gap-5">
          <button
            onClick={() => navigate('/admin/users')} 
            className='!ps-2 !pe-4 !bg-white border border-gray-300 !text-gray-400 
              inline-flex items-center gap-2 hover:!text-primary-400 hover:!border-primary-300'>
            <TbArrowBackUp size={25} />
            <span>Back</span>
          </button>
          <button 
            form="add-user-form"
            type="submit"
            className='ps-2! pe-4! inline-flex items-center gap-2 text-white'>
            <IoIosAdd size={25} />
            <span>Add Now</span>
          </button>
        </div>
        
      </div>

      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2 text-gray-400'>
          <span>Users</span>
          <IoIosArrowForward size={13} />
        </div>
        <div className='inline-flex items-center text-sm gap-2'>
          <span>User Account</span>
        </div>
      </div>

      {/* content */}
      <div className="grid grid-cols-[0.75fr_1.25fr] gap-2">
        
        {/* Personal Information */}
        <div className="flex flex-col bg-white p-6 rounded-2xl border border-gray-200 shade">

          <div className="flex space-x-5">
            <div className="w-[50%] shrink-0 rounded-4xl overflow-hidden">
              <img src={user?.avatar?.url || place_holder} className="object-cover" alt="profile" />
            </div>

            <div className='flex-grow flex flex-col justify-center space-x-2 space-y-1 h-full'>

              <p className='capitalize text-base font-semibold'>{user?.username}</p>
              <div className='flex items-center space-x-2'>
                <div className='w-4'><LuUser className='size-full' /></div>
                <span>{user?.username}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-4'><LuMail /></div>
                <span>{user?.email}</span>
              </div>
              {user?.default_address && (
                <div className='flex items-center space-x-2'>
                  <div className='w-4'>
                    <IoLocationOutline className='size-full' />
                  </div>
                  <span className='capitalize'>{user?.default_address?.city}</span>
                </div>
              )}
              {user?.mobile && (
                <div className='flex items-center space-x-2'>
                  <div className='w-4'><LuPhone className='size-full' /></div>
                  <span>{user?.mobile}</span>
                </div>
              )}

              <div className={clsx('w-fit leading-3 px-2 border rounded-full',
                user?.status === 'active' && 'border-green-500',
                user?.status === 'blocked' && 'border-red-500',
                user?.status === 'inactive' && 'border-gray-40/80',
              )}>
                <p className={clsx('capitalize point-before text-sm',
                  user?.status === 'active' && 'point-before:bg-green-500 text-green-600',
                  user?.status === 'blocked' && 'point-before:bg-red-500 text-red-500',
                  user?.status === 'inactive' && 'point-before:bg-gray-400/80 text-gray-400/80',
                )}
                >{user?.status}</p>
              </div>

            </div>

          </div>

          <hr className='border-gray-200 mt-6' />

          <div className='flex justify-between mt-auto'>

            <div className='leading-4'>
              <p className='text-xs text-gray-400'>Joined on</p>
              <p>{user && format(new Date(user?.createdAt), 'dd MMM yyyy')}</p>
            </div>

            <div className="leading-4">
              <p className='text-xs text-gray-400'>Last login</p>
              <span>
                {user?.last_login ? 
                  format(new Date(user?.last_login), 'dd MMM yyyy, hh:mm a')
                  .replace('AM','am')
                  .replace('PM','pm')
                  :
                  'Not logined'
                }
              </span>
            </div>

          </div>

        </div>
        
        {/* order and wallet summeries */}
        <div className='flex space-x-2'>
          
          {/* order summery */}
          <div className='flex-1 flex-col bg-white p-6 rounded-2xl border border-gray-200 shade'>
            
            <div className='flex items-center justify-between capitalize'>
              <h3 className='text-base'>Orders</h3>
              <h3 className='text-base'>{user?.orderDetails?.orders}</h3>
            </div>

            <hr className='border-gray-200 my-3' />
            
            {user?.orderDetails?.orders > 0 ?
              (<ul className='divide-y divide-dotted divide-gray-300'>
                {
                  user?.orderDetails &&
                  Object.keys(user?.orderDetails).filter(key => key !== 'orders').map(key => 
                    (
                      <li key={key}
                        className='inline-flex justify-between w-full'
                      >
                        <span className='capitalize'>{key?.replace('_'," ")}:</span>
                        <span>{user?.orderDetails?.[key]}</span>
                      </li>
                    )
                  )
                }
              </ul>)
              :
              (<div>
                No orders made
              </div>)
            }

          </div>

          {/* wallet */}
          <div className='flex-1 flex-col bg-white p-6 rounded-2xl border border-gray-200 shade'>
            <div className='flex items-center justify-between capitalize'>
              <h3 className='text-base'>Wallet</h3>
              <div className='flex items-center space-x-2 bg-primary-400 text-white
                rounded-full py-1.5 px-4 w-fit self-center mt-auto'>
                <IoWallet size={20}/>
                <span className='ml-1 text-lg price-before price-before:text-lg
                 price-before:text-gray-300 price-before:font-normal font-bold'
                  >{user?.wallet?.balance}</span>
              </div>
            </div>

            <hr className='border-gray-200 my-3' />

            {user?.wallet?.transactions?.length > 0 ?
              (<>
                <div className='inline-flex justify-between w-full'>
                  <span className='capitalize'>Transactions:</span>
                  <span>{user?.wallet?.transactions?.length}</span>
                </div>
                <div className='inline-flex justify-between w-full'>
                  <span className='capitalize'>Total Income:</span>
                  <span className='price-before'>{user?.wallet?.income}</span>
                </div>
                <div className='inline-flex justify-between w-full'>
                  <span className='capitalize'>Total Expense:</span>
                  <span className='price-before'>{user?.wallet?.expense}</span>
                </div>
              </>)
              :
              (<div>
                Wallet is empty
              </div>)
            }

          </div>

        </div>

        {/* cart and wishlist */}
        <div className='col-span-2 flex space-x-2'>
          
          {/* cart */}
          <div className="flex-1 flex flex-col bg-white p-6 rounded-2xl border border-gray-200 shade">
            
            <div className='flex items-center space-x-2 leading-4'>
              <h3 className='text-base'>Cart</h3>
              {user?.cart?.itemsCount && 
                (<p className='text-gray-500 rounded-2xl'>
                  {user?.cart?.itemsCount}
                  {user?.cart?.itemsCount > 1 ? ' items' : ' item'}
                </p>)
              }
            </div>

            <hr className='border-gray-200 mt-3 mb-5' />

            {user?.cart ?
              user?.cart?.items?.map((item, i) => {
              
                const attributes = item?.attributes ? Object.entries(item?.attributes) : [];
                const itemTotal = item?.quantity * item.price;
                
                return (
                  <ul
                    key={`${item?._id}${i}`}
                    className='grid grid-cols-[2fr_1fr_1fr] not-last:border-b border-gray-200'
                  >
                    <li className='inline-flex space-x-4'>
                      <div className='w-15 h-15 border border-gray-300 rounded-lg overflow-hidden'>
                        <img src={item.image.thumb} alt={item.name} />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <div className='leading-5'>
                          <p className='uppercase text-xs text-gray-400/80'>{item.category}</p>
                          <p className='capitalize font-semibold'>{item.name}</p>
                        </div>
                        <ul className='flex space-x-2'>
                          {attributes.length > 0 && attributes.map(([name, val]) => 
                            (name === 'color' || name === 'colour') ?
                            (<li
                              key={name}
                              style={{ "--dynamic": val }}
                              className='point-before point-before:!p-1.5 point-before:!me-0.5 
                              point-before:!bg-(--dynamic) point-before:!rounded-sm'
                            ></li>)
                            :
                            (<li key={name}
                              
                              className={clsx(`not-first:point-before point-before:!bg-gray-400 
                              point-before:!p-0.5 point-before:!me-2 !text-sm !text-gray-500`,
                              name === 'size' ? 'uppercase' : 'capitalize'
                            )}
                            >{val}</li>)
                          )}
                        </ul>
                      </div>
                    </li>
                    <li className='inline-flex space-x-2 items-center justify-end relative
                      before:content-["rate"] before:capitalize before:absolute before:top-0 before:text-gray-400'>
                      <p className='price-before price-before:font-normal'>{item.price}</p>
                      <p className='text-gray-500'>x</p>
                      <p>{item.quantity}</p>
                    </li>
                    <li className='inline-flex flex-col justify-center items-end capitalize relative
                      before:content-["total"] before:absolute before:top-0 before:text-gray-400'>
                      <p className='price-before price-before:font-normal 
                        text-base font-semibold'
                      >{itemTotal}</p>
                    </li>
                  </ul>
                )
              })
              :
              (<div className='text-center py-3 bg-primary-25 rounded-xl'>
                Cart is empty
              </div>)
            }

          </div>

          {/* wishlist */}
          <div className='flex-1 shrink-0 flex flex-col items-start bg-white p-6 rounded-2xl border border-gray-200 shade'>
            <div className='flex items-center space-x-2 leading-4'>
              <h3 className='text-base'>Wishlist</h3>
              {user?.wishlist?.length > 0 && 
                (<p className='text-gray-500 rounded-2xl'>
                  {user?.wishlist?.length}
                  {user?.wishlist?.length > 1 ? ' items' : ' item'}
                </p>)
              }
            </div>
            <hr className='border-gray-200 mt-3 mb-5 w-full' />
            
            {user?.wishlist?.length > 0 ?
              (<div className='grid grid-cols-2 gap-2 w-full'>
                {
                  user?.wishlist?.map(item => (
                    <div 
                      key={item?.id}
                      className="flex space-x-2 items-center relative border border-gray-300 p-2 rounded-3xl bg-white">
                      {item?.image?.url ? 
                        (<PreviewImage src={item?.image?.thumb || item?.image?.url} alt={item?.name} zoom="80%"
                        thumbClass="rounded-2xl border border-gray-300 w-[32%] h-full"
                        />)
                        :
                        (<ImagePlaceHolder
                          size={18}
                          className="rounded-2xl border border-gray-300 bg-gray-100 text-gray-500/60 w-12 h-12"
                          />)
                      }
                      
                      <div className='flex flex-col text-xs'>

                        <p className='capitalize font-semibold'>{item?.name}</p>
                        <div className='space-x-1 capitalize'>
                          <span className='text-gray-400'>Price:</span>
                          <span className='price-before font-semibold'>{item?.price}</span>
                        </div>
                        <div className='space-x-1 capitalize'>
                          <span className='text-gray-400'>Stock:</span>
                          <span>{item?.stock}</span>
                        </div>
                        <StarRating
                          starSize={3}
                          value={item?.rating}
                          showValue={true}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>)
              :
              (<div className='text-center py-3 bg-primary-25 rounded-xl w-full'>
                wishlist is empty
              </div>)
              
            }


          </div>

        </div>

        {/* orders and transactions */}
        <div className='col-span-2 flex space-x-2'>

          {/* orders */}
          <div className="flex-grow flex flex-col bg-white rounded-2xl border border-gray-200 shade">
            <div className='flex items-center space-x-2 leading-4 p-6 pb-0'>
              <h3 className='text-base'>Orders</h3>
              {user?.orders?.length > 0 && 
                (<p className='text-gray-500 rounded-2xl'>
                  {user?.orders?.length}
                  {user?.orders?.length > 1 ? ' orders' : ' order'}
                </p>)
              }
            </div>

            <hr className='border-gray-200 mt-3 mb-5 mx-6' />
            {user?.orders?.length > 0 ?
              <div className="flex flex-col space-y-2 h-70 overflow-auto scroll-basic mx-3 mb-3 pb-3">
                {user?.orders?.map(order => {

                  const cancelledStatuses = ['cancelled', 'refunded', 'returned'];
                  
                  const title = order?.itemsCount > 1 ? `${order?.itemsCount} items includes` 
                    : order?.name;
                
                  const isPaid = order?.isPaid ? 'Paid' : 'Unpaid';
                  const payment = order?.paymentMethod === 'cod' ? 'cash on delivery' : order?.paymentMethod;
                  const cancelled = cancelledStatuses.includes(order?.status);

                  return(
                    <div key={order?._id} className='px-3'>
                      <div className=' relative overflow-hidden'>
                        {cancelled &&
                          <div className="absolute top-[12%] -left-[5%] text-[10px] z-2">
                            <p className='-rotate-45 bg-red-500 text-white leading-4 px-6 py-0.5 shadow-md/20 capitalize'
                            >{order?.status}</p>
                          </div>
                        }
                        <div
                          className={clsx(`grid grid-cols-[70px_0.75fr_0.5fr_80px_0.75fr] w-full
                            items-center p-2 border border-gray-300 rounded-3xl`,
                            cancelled ? 'disabled-el pointer-events-auto cursor-auto' : ' bg-white' 
                        )}>

                          {/* thumb */}
                          <div className='w-15 h-15 rounded-2xl overflow-hidden'>
                            <img src={order?.image} alt={order?.name} />
                          </div>

                          {/* title */}
                          <div className='flex flex-col'>
                            <p className='text-xs'>#{order?.order_no}</p>
                            <p className='capitalize font-semibold'>{title}</p>
                            <p className='capitalize text-xs'>
                              <span className='text-gray-400'>Date: </span>
                              <span>{format(new Date(order?.createdAt), 'MMM dd, yyyy')}</span>
                            </p>
                          </div>

                          {/* status */}
                          <div className='inline-flex flex-col'>
                            <span className='text-xs text-gray-400'>Status</span>
                            <span className='capitalize'>{order?.status}</span>
                          </div>

                          {/* total */}
                          <div className='inline-flex flex-col'>
                            <span className='text-xs text-gray-400'>Total</span>
                            <span className='price-before'>{order?.cancelledTotal || order?.totalPrice}</span>
                          </div>

                          {/* paid by */}
                          <div className='inline-flex flex-col'>
                            <span className='text-xs text-gray-400'>Payment</span>
                            <span className='capitalize text-[13px]'>{payment}</span>
                          </div>

                        </div>
                      
                      </div>
                    </div>
                  )

                })}
              </div>
              :
              (<div className='text-center py-3 bg-primary-25 rounded-xl mx-6'>
                No orders made
              </div>)
            }
          </div>
          
          {/* wallet transactions */}
          <div className="w-[40%] shrink-0 flex flex-col bg-white rounded-2xl border border-gray-200 shade">
            <div className='flex items-center space-x-2 leading-4 p-6 pb-0'>
              <h3 className='text-base'>Wallet</h3>
              {user?.wallet?.transactions?.length > 0 && 
                (<p className='text-gray-500 rounded-2xl'>
                  {user?.wallet?.transactions?.length}
                  {user?.wallet?.transactions?.length > 1 ? ' transactions' : ' transaction'}
                </p>)
              }
            </div>
            <hr className='border-gray-200 mt-3 mb-5 mx-6' />
            
            <ul className='divide-y divide-gray-200 h-70 overflow-auto scroll-basic mx-3 mb-3 pb-3 px-3'>
            
              <li className='grid grid-cols-[35px_0.5fr_2.5fr_1fr] mb-1.5'
              >
                <p className='font-bold'>No</p>
                <p className='flex items-center'>
                  <HiMiniArrowsUpDown className='text-lg' />
                </p>
                <p className='font-bold'>Description</p>
                <p className='font-bold text-end'>Amount</p>
              </li>
              
              {user?.wallet?.transactions?.length > 0 ?
                user?.wallet?.transactions?.map(item => {
  
                  const credit = item?.type === 'credit';
                  const payment = item?.paymentInfo
                  const dt = format(new Date(payment?.paidAt), "dd-MM-yyyy");
                  const time = format(new Date(payment?.paidAt), "hh:mm:ss a");
                  
                  return (
                    <li 
                      key={item?._id}
                      className='grid grid-cols-[35px_0.5fr_2.5fr_1fr] py-0.5'>
                      <p className='flex items-center'>{item?.sl}</p>
                      <p className='flex items-center'>
                        {credit ?
                          <span className='bg-primary-50 text-primary-400 p-0.5 rounded-full'>
                            <IoMdArrowRoundDown />
                          </span>
                          :
                          <span className='bg-red-100 text-red-400 p-0.5 rounded-full'>
                            <IoMdArrowRoundUp />
                          </span>
                        }
                      </p>
                      <div className='flex flex-col'>
                        <span>{item?.description}</span>
                        <p className='text-xs text-gray-500/80'>
                          <span>{dt}</span>
                          <span className='mx-1'>{time}</span>
                        </p>
                      </div>
                      <p className={clsx('text-end font-semibold',credit ? 'text-primary-400' : 'text-red-400')}>
                        <span className='inline-flex w-3'
                        >{credit ? '+' : '-'}</span>
                        <span className='content-before content-before:font-normal'
                        >{item?.amount}</span>
                      </p>
                    </li>
                  )
                })
                :
                <li className='text-center p-3 text-gray-400'>No transaction exists</li>
              }
            </ul>

          </div>
          
        </div>

        {/* reviews */}
        <div className='col-span-2 w-[70%] flex flex-col bg-white rounded-2xl border border-gray-200 shade'>

          <div className='flex items-center space-x-2 leading-4 p-6 pb-0'>
            <h3 className='text-base'>Reviews</h3>
            {user?.reviews?.length > 0 && 
              (<p className='text-gray-500 rounded-2xl'>
                {user?.reviews?.length}
                {user?.reviews?.length > 1 ? ' reviews' : ' review'}
              </p>)
            }
          </div>

          <hr className='border-gray-200 mt-3 mb-3 mx-6' />

          <ul className='divide-y divide-gray-200 max-h-70 overflow-auto scroll-basic mx-3 mb-3 pb-3 px-3'>
            {user?.reviews?.length > 0 ?
              user?.reviews?.map(review => {

                const product = review?.product_id;

                return (
                  <li 
                    key={review?._id}
                    className='flex py-2 space-x-2'
                  >

                    <PreviewImage src={product?.images || ""} alt={product?.name} size="40" zoom="120%"
                      thumbClass="rounded-xl border border-gray-300 w-12 h-12 shrink-0 mt-1"
                    />

                    <div className='flex-grow flex-col'>
                      <div className="inline-flex items-center space-x-2">
                        <p className='capitalize font-bold text-black text-xs'>{review?.title}</p>
                        <StarRating 
                          value={review?.rating}
                          starSize={3}
                        />
                      </div>

                      <p className="text-xs text-gray-400 mb-1"> On: 
                        <span className='ml-1'>
                          {
                            format(new Date(review?.createdAt), 'MMMM d, y \'at\' hh:mm a')
                            .replace('AM','am')
                            .replace('PM', 'pm')
                          }
                        </span>
                      </p>
                      <p className='text-sm'>{review?.review}</p>
                    </div>
                  </li>
                )
              })
              :
              <li className='text-center p-3 text-gray-400'>No reviews found</li>
            }
          </ul>

        </div>
        
      </div>
    </section>
  )
}

export default ViewUser