import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AdminPagination from '../../../components/ui/AdminPagination';
import * as motion from "motion/react-client"
import OrdersListItem from '../../../components/user/OrdersListItem';
import { fetchOrders } from '../../../store/slices/OrderSlice'

function UserOrders() {

  const dispatch = useDispatch();
  const { ordersList } = useSelector(state => state.orders);
  const [orders, setOrders] = useState([]);
  const [cancelldOrders, setCancelledOrders] = useState([]);
  const [notShippedOrders, setNotShippedOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selected, setSelected] = useState(1);

  const tabs = [
    {id: 1, label: "All"},
    {id: 2, label: "Not Yet Shipped"},
    {id: 3, label: "Cancelled"},
  ];

  useEffect(() => {
    dispatch(fetchOrders())
  },[])

  useEffect(() => {
  
    if(ordersList.length){
      const sorted = [...ordersList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      const cancelled = sorted?.filter(el => el?.status === 'cancelled' || el?.status === 'refunded')
      const notShipped = sorted?.filter(el => el?.status === 'pending' || el?.status === 'processing' || el?.status === 'on-hold')
      setOrders(sorted);
      setActiveOrders(sorted);
      setCancelledOrders(cancelled)
      setNotShippedOrders(notShipped)
    }

  },[ordersList]);

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
    return activeOrders.filter(order =>{

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

  },[searchQuery, filter, activeOrders])

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(activeOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOrderTypeSelect = (id) => {
    setSelected(id);
    switch(id){
      case 2 : setActiveOrders(notShippedOrders); break;
      case 3 : setActiveOrders(cancelldOrders); break;
      default: setActiveOrders(orders)
    }
    setCurrentPage(1)
  }

  return (
    <div className='flex-grow px-5 py-3 space-y-5'>
      {/* header */}
      <div className='flex items-center space-x-2 mb-4'>
        <h3 className='text-lg'>Your Orders</h3>
        <span className='bg-gray-100 px-2 rounded-lg font-semibold'>{orders?.length}</span>
      </div>

      {/* tabs */}
      <div className="inline-flex bg-gray-100 border-gray-300 p-1 rounded-xl">
        {tabs.map(el => {

          const isSelected = selected === el?.id;
          let itemCount = 0;
          if(el.id === 2) itemCount = notShippedOrders?.length
            else if(el.id === 3) itemCount = cancelldOrders?.length

          return (
            <div
              key={el.id} 
              onClick={() => handleOrderTypeSelect(el.id)} 
              className='px-4 cursor-pointer smooth relative'
            >
              
              {isSelected &&
                (
                  <motion.div 
                    layoutId='highlight'
                    className='absolute inset-0 bg-white rounded-lg shadow'
                  />
                )
              }
              <div className='relative flex items-center space-x-1'>
                <motion.span
                  key="normal"
                  className='font-normal absolute whitespace-nowrap'
                  initial={{ opacity: isSelected ? 0 : 1 }}
                  animate={{ opacity: isSelected ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {el.label}
                </motion.span>
                <motion.span
                  key="bold"
                  className='font-bold'
                  initial={{ opacity: isSelected ? 1 : 0 }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {el.label}
                </motion.span>
                {el.id > 1 &&
                  <div className={clsx('text-white text-xs font-bold h-fit px-1.25 rounded-full smooth',
                    el.id === 3 ? 
                      isSelected ? 'bg-red-500' : 'bg-red-300'
                      : 
                      isSelected ? 'bg-orange-400' : 'bg-orange-300'
                  )}>
                    {itemCount}
                  </div>
                }
                
              </div>

              {/* badge */}
              
              
            </div>
          )
        })}
      </div>

      {/* contentes */}
      <div className="flex flex-col space-y-2">
        {paginatedOrders?.length > 0 ?
          paginatedOrders?.map(order => 

            <OrdersListItem 
              key={order?._id} 
              order={order}
            />

          )
          :
          (
            <div className='border border-gray-300 rounded-2xl px-5 py-3 w-[35%] text-gray-400 font-bold'>
              No orders found
            </div>
          )
        }
      </div>

      {/* pagination */}
      {totalPages > 1 && <div className='border-t border-gray-300 py-5 mt-5 flex justify-center'>
        <AdminPagination
          currentPage={currentPage} 
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>}
    </div>
  )
}

export default UserOrders