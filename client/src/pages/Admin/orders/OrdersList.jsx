import React, { useEffect, useMemo, useState } from 'react'
import { HiHome } from 'react-icons/hi2'
import { IoIosArrowForward, IoMdMore } from 'react-icons/io'
import { LuEye, LuPackagePlus, LuSearch } from 'react-icons/lu'
import DropdownButton from '../../../components/ui/DropdownButton';
import { AnimatePresence, motion } from 'motion/react';
import { containerVariants, rowVariants } from '../../../utils/Anim';
import { useSelector } from 'react-redux';
import AdminPagination from '../../../components/ui/AdminPagination';
import AvatarGroup from '../../../components/ui/AvatarGroup';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Menu, MenuButton } from '@headlessui/react';
import ContextMenu from '../../../components/ui/ContextMenu';
import { useNavigate } from 'react-router';

function OrdersList() {

  const navigate = useNavigate();
  const { ordersList } = useSelector(state => state.orders);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    if(ordersList.length){
      const sorted = [...ordersList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      setOrders(sorted);
    }

  },[ordersList])

  /* debouncer */
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);
  const [filter, setFilter] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query)
    }, 300);

    return () => clearTimeout(timer);

  },[query])

  /* search filter */
  const filteredOrders = useMemo(() => {
    return orders.filter(order =>{

      if(searchQuery){
        const fields = ['name','slug']

        return fields.some(field => {

          if(order[field]){
            return order[field].includes(searchQuery)
          }
          return false

        })

      }else{

        if(!filter || !Object.keys(filter).length) return order;
        const [[key, value]] = Object.entries(filter)
        return order[key] === value
      }

    });

  },[searchQuery, filter, orders])

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='flex flex-col p-6'>
      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Order Management</h3>
          <span className='sub-title'>View and manage orders</span>
        </div>
        <button 
          /* onClick={() => navigate('/admin/products/add-product',{state:{categories, brands}})} */
          className='px-4! inline-flex items-center gap-2 text-white'>
          <LuPackagePlus size={20} />
          <span>Export</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Orders</span>
        </div>
      </div>

      {/* search sort filter*/}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center relative w-3/10">
          <LuSearch size={20} className='absolute left-3'/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder='Search orders'
            className='pl-10! rounded-xl! bg-white' />
        </div>

        {/* filter sort */}
        <div className='flex items-center h-full gap-x-2'>
          {/* sort */}
          {/* <DropdownButton
            label='sort'
            icon={<FaSort className='text-md me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={useMemo(() => [
              { id: 'priceltoh', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> price: low to high </span>,
                onClick: () => sortData('price')
              },
              { id: 'pricehtol', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> price: high to low</span>,
                onClick: () => sortData('price','desc')
              },
              { id: 'newfirst', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> Newest First</span>,
                onClick: () => sortData('createdAt','asc')
              },
              { id: 'oldfirst', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> Oldest First</span>,
                onClick: () => sortData('createdAt','desc')
              },
            ],[])}
          /> */}

          {/* filter */}
          {/* <DropdownButton
            label='filter'
            icon={<CiFilter className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-600'
            items={useMemo(() => [
              { id: 'none',
                icon: <span className='text-xl point-before point-before:bg-gray-300'></span>,
                text: <span className={`capitalize`}> None </span>,
                onClick: () => setFilter({})
              },
              { id: 'featured',
                icon: <span className='text-xl point-before'></span>,
                text: <span className={`capitalize`}> featured </span>,
                onClick: () => setFilter({'featured':true})
              },
              { id: 'active', 
                icon: <span className='text-xl point-before point-before:bg-green-400'></span>,
                text: <span className={`capitalize`}> active </span>,
                onClick: () => setFilter({'status':'active'})
              },
              { id: 'inactive', 
                icon: <span className='text-xl point-before point-before:bg-gray-400'></span>,
                text: <span className={`capitalize`}> inactive </span>,
                onClick: () => setFilter({'status':'inactive'})
              },
              { id: 'outofstock', 
                icon: <span className='text-xl point-before point-before:bg-red-400'></span>,
                text: <span className={`capitalize`}> out of stock </span>,
                onClick: () => setFilter({'stock':0})
              },
              { id: 'archived', 
                icon: <span className='text-xl point-before point-before:bg-yellow-400'></span>,
                text: <span className={`capitalize`}> archived </span>,
                onClick: () => setFilter({'archived':true})
              },
            ],[])}
          /> */}
        </div>
        
      </div>

      {/* content - first div for smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-300 p-4.5">
          <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_88px] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>Product</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Amount</span>
            <span>payment</span>
            <span>status</span>
            <span className="text-center">Actions</span>
          </div>
        </div>
        <motion.ul 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col w-full h-full text-sm text-gray-700">

          {/* Rows */}
          {isLoading ? 
            <>
              <li className="rounded px-6 py-4 space-y-3">
                <Skeleton height="h-10" width="w-full" />
              </li>
              <li className="rounded px-6 py-4 space-y-3">
                <Skeleton height="h-10" width="w-full" />
              </li>
              <li className="rounded px-6 py-4 space-y-3">
                <Skeleton height="h-10" width="w-full" />
              </li>
            </>
            :
            <li className="divide-y divide-gray-300">
            
              <AnimatePresence exitBeforeEnter>

                {paginatedOrders.length > 0 ?
                    ( paginatedOrders.map((order, index) => {

                      const title = order?.cartItems?.length > 1 ? `${order?.cartItems?.length} items includes` 
                        : order?.cartItems[0].name;
                      const images = order?.cartItems?.slice(0,3).map(item => ({name: item.name, image: item.image}));
                      const isPaid = order?.isPaid ? 'Paid' : 'Unpaid';
                      const payment = order?.paymentMethod === 'cod' ? 'cash on delivery' : order?.paymentMethod;

                      return (
                        <motion.div 
                          layout
                          key={order._id}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={rowVariants}
                          whileHover={{
                            backgroundColor: '#efffeb',
                            transition: { duration: 0.3 }
                          }}
                          className={`bg-white`}
                        >

                          <div
                            className={`grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_88px] 
                              items-center w-full px-4 py-2`}
                          >

                            {/* Checkbox */}
                            <div><input type="checkbox" /></div>
                            
                            {/* product Info & thumbnail */}
                            <div className="flex gap-2 items-center relative">

                              <div className="inline-flex">
                                <AvatarGroup
                                  images={images}
                                  avatarClass={`w-12 rounded-full overflow-hidden border-2 border-gray-300`}
                                  className='flex w-full -space-x-11 items-end'
                                />
                              </div>

                              <div className="inline-flex flex-col capitalize">
                                <p className="font-semibold">{title}</p>
                                <p className="text-gray-400 text-xs">
                                  <span>ID: </span>
                                  <span>{order?.order_no} </span>
                                </p>
                              </div>
                            </div>

                            {/* customer name */}
                            <div className='capitalize flex flex-col'>
                              <span className='text-xs font-semibold'>{order?.billingAddress.name}</span>
                            </div>

                            {/* order date */}
                            <div className='capitalize flex flex-col'>
                              <span className='text-xs font-semibold'>{format(new Date(order?.createdAt), "dd-MM-yyy")}</span>
                              <span className='text-xs text-gray-400'>{format(new Date(order?.createdAt), "hh:mm a")}</span>
                            </div>

                            {/* amount */}
                            <div className='capitalize flex flex-col'>
                              <span className='price-before font-semibold'>{order?.totalPrice}</span>
                              <span className={clsx('badge',
                                order?.isPaid ? 'bg-green-200 text-primary-400' : 'bg-amber-200 text-red-400'
                              )}>{isPaid}</span>
                            </div>

                            {/* payment method */}
                            <div className='capitalize flex flex-col'>
                              <span className='text-xs font-semibold'>{payment}</span>
                              {order?.paymentMethod === 'razor-pay' && 
                                <span className='text-xs text-gray-400'>{order?.paymentResult?.razorpay_payment_id}</span>}
                            </div>

                            {/* status */}
                            <div className='capitalize flex flex-col'>
                              <span className={clsx('badge',
                                order?.status === 'delivered' && 'bg-green-100 text-primary-400',
                                order?.status === 'pending' && 'bg-amber-100 text-amber-500',
                                order?.status === 'shipped' && 'bg-violet-100 text-violet-500',
                                order?.status === 'cancelled' && 'bg-red-100 text-red-500',
                              )}>{order?.status}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3 z-50">
                              <Menu as="div" className='relative'>
                                {({open}) => (
                                  <>
                                    <MenuButton as="div"
                                      className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
                                      border border-gray-300 !text-gray-900 cursor-pointer"
                                    >
                                      <IoMdMore size={20} />
                                    </MenuButton>
                                    <ContextMenu
                                      open={open}
                                      items={useMemo(() => [
                                        { id: 'view', 
                                          icon: <LuEye className='text-xl'/>,
                                          text: <span className={`capitalize`}>view order</span>,
                                          onClick: () => { navigate(`view-order/${order?.order_no}`,
                                            {
                                              state: {order}
                                            }
                                          )}
                                        },
                                        { id: 'shipped', 
                                          icon: <LuEye className='text-xl'/>,
                                          text: <span className={`capitalize`}>shipped</span>,
                                          onClick: () => {}
                                        },
                                        { id: 'delivered', 
                                          icon: <LuEye className='text-xl'/>,
                                          text: <span className={`capitalize`}>delivered</span>,
                                          onClick: () => {}
                                        },
                                      ],[])}

                                    />
                                  </>
                                )}
                              </Menu>

                            </div>

                          </div>

                        </motion.div>
                      )
                    }))
                    :
                    (<div className="flex items-center justify-center h-20 text-primary-400
                      text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl">
                      No orders exists
                    </div> )
                  }

              </AnimatePresence>
            </li>
          }

          {/* Pagination */}
          {paginatedOrders.length > 0 && <li
            key="pagination"
            custom={filteredOrders.length + 1}
            className="px-4 py-5"
          >
            
            <AdminPagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />

          </li>}

        </motion.ul>

      </div>

    </section>
  )
}

export default OrdersList