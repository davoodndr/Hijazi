import React, { useEffect, useMemo, useState } from 'react'
import { HiHome } from 'react-icons/hi2'
import { IoIosArrowForward, IoMdMore } from 'react-icons/io'
import { LuEye, LuPackagePlus, LuSearch } from 'react-icons/lu'
import { AnimatePresence, motion } from 'motion/react';
import { containerVariants, rowVariants } from '../../../utils/Anim';
import { useSelector } from 'react-redux';
import AdminPagination from '../../../components/ui/AdminPagination';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Menu, MenuButton } from '@headlessui/react';
import ContextMenu from '../../../components/ui/ContextMenu';
import { useNavigate } from 'react-router';
import { BsFillMenuButtonFill } from 'react-icons/bs';
import SkeltoList from '../../../components/ui/SkeltoList';
import SearchBar from '../../../components/ui/Searchbar';
import { filterData } from '../../../utils/Utils';
import { CiFilter } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa6';
import DropdownMenuButton from '../../../components/ui/DropdownMenuButton';

function OrdersList() {

  const navigate = useNavigate();
  const { ordersList } = useSelector(state => state.orders);
  const [orders, setOrders] = useState([]);

  const [currentSort, setCurrentSort] = useState(null);

  useEffect(() => {

    const sorted = [...ordersList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    setOrders(sorted);

  },[ordersList]);


  /* search and filter */
  const [searchQuery, setSearchQuery] = useState(null);
  const [filter, setFilter] = useState({})
  const fields = ['name','slug']
  const filterMenus = [
    {label: 'all', value: {}, color: '--color-gray-200'},
    {label: 'status', color: '--color-pink-300',
      children: [
        {label: 'pending', value: {'status': 'pending'}, color: '--color-amber-400'},
        {label: 'paid',  value: {'status': 'paid'}, color: '--color-pink-400'},
      ]
    },
    {label: 'user', value: {'roles': 'user'}, color: '--color-amber-400'},
    {label: 'admin', value: {'roles': 'admin'}, color: '--color-blue-400'},
    {label: 'active', value: {'status': 'active'}, color: '--color-green-400'},
    {label: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
    {label: 'blocked', value: {'status': 'blocked'}, color: '--color-red-400'},
  ]

  const filteredOrders = useMemo(() => {

    return filterData(searchQuery, filter?.value, orders, fields);

  },[searchQuery, filter, orders])


  const handleViewOrderClick = (order) => { 
    navigate(`view-order/${order?.order_no}`,
      {
        state: {order, orders}
      }
    )
  }

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const buildMenuItems = (menus) => {
    return menus?.map(menu => {
      const hasChildren = Array.isArray(menu?.children) && menu.children.length > 0;

      let isSelected = false;

      if(!hasChildren && filter?.value){
        const key = Object?.keys(menu?.value)?.[0] || null;
        const value = menu?.value[key];
        isSelected = menu?.label === 'all' ? 
          !Object.keys(filter?.value)?.length 
          :
          filter?.value[key] === value
      }
      
      if(menu?.label === 'all'){
        if(!filter?.value || filter?.label === 'all') {
          isSelected = true
        }else{
          isSelected = false
        }
      }

      return {
        label: menu?.label,
        isSelected,
        icon: (
          <span
            style={{ '--point-color': `var(${menu.color})` }}
            className="text-xl point-before point-before:bg-(--point-color)"
          ></span>
        ),
        tail: isSelected ? (<span><FaCheck /></span>) : null,
        children: hasChildren ? buildMenuItems(menu.children) : undefined,
        action: () => setFilter(menu),
      };
    });
  };

  return (
    <section className='flex flex-col p-6'>
      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="inline-flex flex-col">
          <div className="flex items-center leading-4 space-x-3">
            <h3 className='text-xl'>Order Management</h3>
            <span className='border-r border-gray-400/70 inline-flex h-5'></span>
            <p className='space-x-1 text-black'>
              <span className='font-semibold'>{orders?.length}</span>
              <span className='text-xs text-gray-500'>Orders</span>
            </p>
          </div>
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
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-theme-divider'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Orders</span>
        </div>
      </div>

      {/* search sort filter*/}
      <div className="flex items-center mb-5">
              
        <div className="w-full flex items-center space-x-3">
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder='Search users'
            className='w-4/10'
            inputClass="!pl-10 rounded-xl bg-white peer"
            iconClass='left-3 smooth peer-focus:text-primary-400'
          />

          {(Object?.keys(filter)?.length > 0 || searchQuery) && (
            <motion.p layout className='space-x-1'>
              <span>Found</span>
              {filteredOrders?.length > 0 && <span className='font-semibold'>{filteredOrders?.length}</span>}
              <span>{
                filteredOrders?.length === 1 ? 'order' : 
                filteredOrders?.length < 1 ? 'nothing' : 'orders'}!</span>
            </motion.p>
          )}

        </div>

        {/* filter sort */}
        <div className='flex items-center h-full space-x-3'>

          {/* sort */}
          {/* <motion.div layout 
            style={{ 
              '--dynamic': `var(${
                isSortMenuSelected()?.color || ''
              })` 
            }}
            className={clsx('flex items-center h-full bg-white border rounded-xl space-x-1',
              isSortMenuSelected() && currentSort?.field !== 'none' ? 
              'text-(--dynamic) border-(--dynamic)' : 'border-gray-300 text-gray-500'
            )}
          >
            <DropdownButton
              label='sort'
              icon={<FaSort className='text-lg me-1' />}
              className='!text-inherit'
              items={
                sortMenus?.map(menu => {

                  const isSelected = menu?.id === 'none' ?
                    (menu?.id === currentSort?.field || !isSortMenuSelected())
                    :
                    menu?.id === currentSort?.field;

                  return { 
                    id: menu?.id, 
                    icon: <span 
                            style={{ '--point-color': `var(${menu?.color})` }} 
                            className={`text-xl point-before point-before:bg-(--point-color)`}>
                          </span>,
                    text: <span className={`capitalize`}>{menu.id === 'none' ? menu?.title : `by ${menu?.title}`} </span>,
                    tail: isSelected ? (<span><FaCheck /></span>) : null,
                    onClick: () => {
                      setCurrentSort({ field: menu?.id, ascending: sortDirection === 'asc'})
                    }
                  }
                })
              }
            />

            <span className='h-full border-r border-gray-300'></span>

            <DropdownButton
              icon={<LuArrowUpDown />}
              items={[
                { id: 'asc', 
                  icon: <BsSortDownAlt className='text-xl'/>,
                  text: <span className={`capitalize`}>Low to high</span>,
                  tail: sortDirection === 'asc' ? (<span><FaCheck /></span>) : null,
                  onClick: () => {
                    setSortDirection('asc')
                    setCurrentSort({...currentSort, ascending: true })
                  }
                },
                { id: 'desc', 
                  icon: <BsSortUpAlt className='text-xl'/>,
                  text: <span className={`capitalize`}>high to low</span>,
                  tail: sortDirection === 'desc' ? (<span><FaCheck /></span>) : null,
                  onClick: () => {
                    setSortDirection('desc')
                    setCurrentSort({...currentSort, ascending: false })
                  }
                },
              ]}
            />
          </motion.div> */}

          {/* filter */}
          <DropdownMenuButton
            label={ filter?.label || 'filter'}
            icon={<span className='p-1.5'><CiFilter className='text-lg' /></span>}
            style={{ 
              '--dynamic': `var(${filter?.color || ''})` 
            }}
            className={clsx('bg-white border rounded-xl',
              (filter?.label !== 'all' && filter?.color) ?
                'text-(--dynamic) border-(--dynamic)' :
                'border-gray-300 text-gray-500'
            )}
            items={buildMenuItems(filterMenus)}
          />
        </div>
        
      </div>

      {/* content - first div for smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shade border border-theme-divider">
        {/* Header */}
        <div className="text-gray-400 uppercase font-semibold tracking-wider
          border-b border-theme-divider px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
          <div className="grid grid-cols-[30px_1.5fr_1fr_0.5fr_1fr_0.75fr_0.75fr_0.25fr] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>Product</span>
            <span>Customer</span>
            <span>Date</span>
            <span className="text-center">Amount</span>
            <span>payment</span>
            <span className="text-center">status</span>
            <span className="flex items-center justify-center">
              <BsFillMenuButtonFill className='text-xl' />
            </span>
          </div>
        </div>
        <motion.ul
          key={currentPage}
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col w-full h-full text-sm text-gray-700"
        >

          {/* Rows */}
          {paginatedOrders?.length > 0 ? (

            <AnimatePresence exitBeforeEnter>
              <motion.li
                key="list-container"
                layout 
                className="divide-y divide-theme-divider"
              >
            
                {paginatedOrders?.map((order, index) => {

                  const title = order?.itemsCount > 1 ? `${order?.itemsCount} items includes` 
                    : order?.name;

                  const count = Math.min(order?.itemsCount || 0, 3);

                  /* const images = Array.from({ length: count }, (_, i) => ({
                    name: "",
                    image: order?.image || ''
                  })); */

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
                        className={`grid grid-cols-[30px_1.5fr_1fr_0.5fr_1fr_0.75fr_0.75fr_0.25fr] 
                          items-center w-full px-4 py-2`}
                      >

                        {/* Checkbox */}
                        <div><input type="checkbox" /></div>
                        
                        {/* product Info & thumbnail */}
                        <div className="flex gap-2 items-center relative">

                          <div className="inline-flex">
                            {/* <AvatarGroup
                              images={images}
                              avatarClass={`w-12 rounded-md overflow-hidden border-2 border-gray-300`}
                              className='flex w-full -space-x-11 items-end'
                            /> */}
                            <img src={order?.image} className='rounded-xl border border-gray-300 w-12 h-12' alt="" />
                          </div>

                          <div className="inline-flex flex-col capitalize">
                            <p className="font-semibold">{title}</p>
                            <p className="text-gray-500/90 text-xs">
                              <span>No: </span>
                              <span>{order?.order_no} </span>
                            </p>
                          </div>
                        </div>

                        {/* customer name */}
                        <div className='capitalize flex flex-col text-xs'>
                          <span className='font-semibold'>{order?.billingAddress?.name}</span>
                          <span className='text-gray-500/90'>{order?.billingAddress?.city}</span>
                        </div>

                        {/* order date */}
                        <div className='capitalize flex flex-col'>
                          <span className='text-xs font-semibold'>{format(new Date(order?.createdAt), "dd-MM-yyy")}</span>
                          <span className='text-xs text-gray-400'>{format(new Date(order?.createdAt), "hh:mm a")}</span>
                        </div>

                        {/* amount */}
                        <div className='flex'>
                          <div className='capitalize flex flex-col items-end w-[60%]'>
                            <span className='price-before font-semibold inline-block'>{order?.cancelledTotal || order?.totalPrice}</span>
                            <span className={clsx('text-xs inline-block',
                              order?.isPaid ? ' text-primary-400/70' : ' text-red-400/70'
                            )}>{isPaid}</span>
                          </div>
                        </div>

                        {/* payment method */}
                        <div className='capitalize flex flex-col'>
                          <span className='text-xs font-semibold'>{payment}</span>
                          {order?.paymentMethod === 'razor-pay' && 
                            <span className='text-xs text-gray-400'>
                              {order?.paymentResult?.razorpay_payment_id}
                            </span>}
                        </div>

                        {/* status */}
                        <div className='capitalize flex flex-col items-center'>
                          <span className={clsx('badge',
                            order?.status === 'pending' && 'bg-amber-100 text-amber-500',
                            order?.status === 'processing' && 'bg-gray-100 text-gray-500',
                            order?.status === 'shipped' && 'bg-violet-100 text-violet-500',
                            order?.status === 'delivered' && 'bg-green-100 text-primary-400',
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
                                      onClick: () => handleViewOrderClick(order)
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
                })}

              </motion.li>
            </AnimatePresence>
          ) : (
            !searchQuery?.trim() ? (
              <SkeltoList />
            ):(
              <AnimatePresence>
                <motion.li
                  key="not-found"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={rowVariants}
                  className="flex items-center"
                >
                  <span
                    className="w-full h-full text-center py-6 text-primary-400
                    text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
                  >No orders found</span>
                </motion.li>
              </AnimatePresence>
            )
          )}
          
          {/* Pagination */}
          {paginatedOrders.length > 0 && 
            <motion.li
              layout
              key="pagination"
              custom={filteredOrders.length + 1}
              className="px-4 py-5"
            >
              
              <AdminPagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />

            </motion.li>
          }

        </motion.ul>

      </div>

    </section>
  )
}

export default OrdersList