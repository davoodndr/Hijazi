import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { format } from 'date-fns'
import AdminPagination from '../../../components/ui/AdminPagination';
import { useNavigate } from 'react-router';

function UserOrders() {

  const navigate = useNavigate();
  const { ordersList } = useSelector(state => state.orders);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(1);

  const tabs = [
    {id: 1, label: "all"},
    {id: 2, label: "not yet shipped"},
    {id: 3, label: "cancelled"},
  ];

  useEffect(() => {
  
    if(ordersList.length){
      const sorted = [...ordersList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      setOrders(sorted);
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
    <div className='flex-grow px-5 py-3 space-y-5'>
      {/* header */}
      <div className='flex items-center space-x-2 mb-4'>
        <h3>Your Orders</h3>
        <span className='bg-gray-100 px-2 rounded-lg font-semibold'>{orders?.length}</span>
      </div>

      {/* tabs */}
      <div className="inline-flex bg-gray-100 border-gray-300 p-1 rounded-xl">
        {tabs.map(el => 
          <span
          onClick={() => {
            setSelected(el.id)
          }} 
            key={el.id} 
            className={clsx('capitalize px-4 cursor-pointer smooth',
              selected === el.id && 'bg-white rounded-lg shadow font-semibold'
            )}
          >{el.label}</span>
        )}
      </div>

      {/* contentes */}
      <div className="flex flex-col space-y-2">
        {paginatedOrders?.length > 0 &&
          paginatedOrders?.map(order => {

            const title = order?.cartItems?.length > 1 ? `${order?.cartItems?.length} items includes` 
              : order?.cartItems[0].name;
            const images = order?.cartItems?.slice(0,3).map(item => ({name: item.name, image: item.image}));
            const isPaid = order?.isPaid ? 'Paid' : 'Unpaid';
            const payment = order?.paymentMethod === 'cod' ? 'cash on delivery' : order?.paymentMethod;

            return (
              <div
                key={order?._id}
                className='grid grid-cols-[100px_1fr_0.5fr_0.75fr_180px_0.5fr]
                 items-center space-x-3 p-2 border border-gray-300 rounded-3xl'>
                
                {/* thumb */}
                <div className='w-20 rounded-2xl overflow-hidden'>
                  <img src={images[0]?.image} alt={images[0]?.name} />
                </div>

                {/* title */}
                <div className='inline-flex flex-col'>
                  <p className='text-xs'><span className='text-gray-400'>Order </span>#{order?.order_no}</p>
                  <p className='capitalize font-semibold'>{title}</p>
                  <p className='capitalize text-xs'>
                    <span className='text-gray-400'>Date: </span>
                    <span>{format(new Date(order?.createdAt), 'MMM dd, yyyy')}</span>
                  </p>
                </div>

                {/* total */}
                <div className='inline-flex flex-col'>
                  <span className='text-xs text-gray-400'>Order Total</span>
                  <span className='price-before'>{order?.totalPrice}</span>
                </div>

                {/* paid by */}
                <div className='inline-flex flex-col'>
                  <span className='text-xs text-gray-400'>Payment</span>
                  <span className='capitalize'>{payment}</span>
                </div>

                {/* ship to */}
                <div className='inline-flex flex-col px-2'>
                  <span className='text-xs text-gray-400'>Ship to</span>
                  <span className='truncate capitalize'>{Object.values(order?.shippingAddress).join(', ')}</span>
                </div>

                {/* order id */}
                <div className='inline-flex flex-col justify-between text-xs space-y-1 capitalize'>
                  <span 
                    onClick={() => {
                      navigate(`/my-order/${order?.order_no}`,{
                        state: { order }
                      })
                    }}
                    className='underline text-primary-400 cursor-pointer'
                  >View Order</span>
                  <span className='underline text-primary-400 cursor-pointer'>Invoice</span>
                  <span className='underline text-primary-400 cursor-pointer'>rate product</span>
                </div>

                {/* action button */}
                {/* <div className='w-full'>
                  <button className='w-full text-xs'>Buy Again</button>
                </div> */}
              </div>
            )
          })
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