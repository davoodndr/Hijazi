import React, { useEffect, useState } from 'react'
import { HiHome } from 'react-icons/hi2';
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp, IoMdCheckmarkCircleOutline, IoMdMore } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import DropdownButton from '../../../components/ui/DropdownButton';
import { CiFilter } from 'react-icons/ci';
import SortHeader from '../../../components/ui/SortHeader';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react'
import { containerVariants, rowVariants } from '../../../utils/Anim';
import Skeleton from '../../../components/ui/Skeleton';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup'
import { format } from 'date-fns'
import StarRating from '../../../components/ui/StarRating';
import AdminPagination from '../../../components/ui/AdminPagination';
import { Menu, MenuButton } from '@headlessui/react';
import ContextMenu from '../../../components/ui/ContextMenu';
import { FaRegCircleXmark } from 'react-icons/fa6';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { BsFillMenuButtonFill } from "react-icons/bs";
import { setLoading } from '../../../store/slices/CommonSlices';
import Alert from '../../../components/ui/Alert';
import AxiosToast from '../../../utils/AxiosToast';
import { useDispatch } from 'react-redux';

function UserReviewsComponent() {

  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchReviews();
  },[])

  const fetchReviews = async() => {

    setIsLoading(true);

    try {
        
      const response = await Axios({
        ...ApiBucket.getReviews
      })
      
      if(response?.data?.success){    
        setReviews(response?.data?.reviews);
        setCurrentSort({ field: "createdAt", ascending: false })
      }

    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }

  };

  /* handle status */
  const handleStatusChange = async(id, status) => {

    let data = {};
    let statusChange = null;

    switch(status){
      case 'approved' : 
        data = {
          text: 'Yes, hide now', 
          msg: 'Hidden review won\'t visible publicly',
          color: '!bg-red-500 hover:!bg-red-600'
        };
        statusChange = 'hidden'
        break;
      case 'pending':
      case 'hidden':
        data = {
          text: 'Yes, approve now', 
          msg: 'This review will be visible to the public.',
          color: ''
        };
        statusChange = 'approved'
        break;

      default : null;
    }

    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: data?.msg,
      showCancelButton: true,
      confirmButtonText: data?.text,
      customClass: {
        popup: '!w-[400px]',
        confirmButton: data?.color
      },
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        try {

          const response = await Axios({
            ...ApiBucket.changeReviewStatus,
            data: {
              review_id: id,
              status: statusChange,
            }
          })

          if(response?.data?.success){
            const updated = response?.data?.review;
            setReviews(prev => prev.map(review => review?._id === updated?._id ? updated : review));
            AxiosToast(response, false);
          }
          
        } catch (error) {
          AxiosToast(error)
        }finally{
          dispatch(setLoading(false))
        }
      }
    })

  }

  /* debouncer */
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query)
    }, 300);

    return () => clearTimeout(timer);

  },[query])

  /* sort */
  const [sortedReviews, setSortedOffers] = useState([]);
  const [currentSort, setCurrentSort] = useState(null)
  const [sortOptions, setSortOptions] = useState([
    {title: 'user',field: 'user_id', ascending: true},
    {title: 'product',field: 'discountValue', ascending: true},
    {title: 'rating',field: 'rating', ascending: true},
  ])

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='flex flex-col p-6'>

      {/* page title & add offer button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Review Management</h3>
          <span className='sub-title'>View and analize user reviews</span>
        </div>

        {/* <button 
          onClick={() => setIsAddOpen(true)}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <TbCategoryPlus size={20} />
          <span>Add Offer</span>
        </button> */}

      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-theme-divider'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Reviews</span>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center relative w-3/10">
          <LuSearch size={20} className='absolute left-3'/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder='Search offers'
            className='pl-10! rounded-xl! bg-white' />
        </div>

        {/* filter sort */}
        <div className='flex items-center h-full gap-x-2'>
          {/* sort */}
          {/* <DropdownButton
            label='sort'
            icon={<FaSort className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={[
              { id: 'priceltoh', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> name: low to high </span>,
                onclick: () => {}
              },
              { id: 'pricehtol', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> price: high to low</span>,
                onclick: () => {}
              },
              { id: 'newfirst', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> Newest First</span>,
                onclick: () => {}
              },
              { id: 'oldfirst', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> Oldest First</span>,
                onclick: () => {}
              },
            ]}
          /> */}

          {/* filter */}
          <DropdownButton
            label='filter'
            icon={<CiFilter className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={[
              /* { id: 'featured', 
                icon: <span className='text-xl point-before'></span>,
                text: <span className={`capitalize`}> featured </span>,
                onclick: () => {}
              },
              { id: 'active', 
                icon: <span className='text-xl point-before point-before:bg-green-400'></span>,
                text: <span className={`capitalize`}> active </span>,
                onclick: () => {}
              },
              { id: 'inactive', 
                icon: <span className='text-xl point-before point-before:bg-gray-400'></span>,
                text: <span className={`capitalize`}> inactive </span>,
                onclick: () => {}
              },
              { id: 'outofstock', 
                icon: <span className='text-xl point-before point-before:bg-red-400'></span>,
                text: <span className={`capitalize`}> out of stock </span>,
                onclick: () => {}
              }, */
            ]}
          />
        </div>
        
      </div>

      {/* content - first div fot smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shade border border-theme-divider">

        {/* Header */}
        <div className="text-gray-400 uppercase font-semibold tracking-wider
          border-b border-theme-divider px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
          <div className="grid grid-cols-[30px_1fr_1.25fr_0.75fr_1fr_1.25fr_0.75fr_0.25fr] items-center w-full">
            <span><input type="checkbox" /></span>
            {
              sortOptions.map((item, index) => 
                <SortHeader
                  key={index} 
                  title={item.title}
                  onClick={() => {
                    setCurrentSort({...item, ascending: !currentSort?.ascending})
                  }}
                  sortIcon={
                    <>
                      <IoIosArrowUp className={clsx(
                        currentSort?.field === item.field && !currentSort?.ascending && 'text-primary-400'
                      )} />
                      <IoIosArrowDown className={clsx(
                        currentSort?.field === item.field && currentSort?.ascending && 'text-primary-400'
                      )} />
                    </>
                  }
                />
              )
            }
            <span>Title</span>
            <span>Review</span>
            <span className='text-center'>Status</span>
            <span className="flex items-center justify-center">
              <BsFillMenuButtonFill className='text-xl' />
            </span>
          </div>
        </div>

        {/* rows */}
        <motion.ul 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col w-full h-full text-sm text-gray-700">

          {isLoading || reviews.length <= 0 ? 
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

            <motion.li layout className="divide-y divide-theme-divider">
            
              <AnimatePresence exitBeforeEnter>
                {reviews?.map((review, index) => {

                  const reviewUser = review?.user_id;
                  const reviewProduct = review?.product_id;
                  const dt = format(new Date(review?.createdAt), 'dd MMM y')

                  return (
                    <motion.div
                      layout
                      key={review?._id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={rowVariants}
                      whileHover={{
                        backgroundColor: '#efffeb',
                        transition: { duration: 0.3 }
                      }}
                    >
                  
                      <ul className="grid grid-cols-[30px_1fr_1.25fr_0.75fr_1fr_1.25fr_0.75fr_0.25fr] 
                        items-center w-full px-4 py-2 bg-white"
                      >
                        {/* Checkbox */}
                        <li><input type="checkbox" /></li>

                        {/* user */}
                        <li>
                          <p className='capitalize truncate'>{reviewUser?.fullname || reviewUser?.username}</p>
                          <p className='text-xs text-gray-500/80'>{dt}</p>
                        </li>

                        {/* product */}
                        <li className='capitalize truncate'>
                          <p>{reviewProduct?.name}</p>
                          <p className='text-xs text-gray-500/80'>{reviewProduct?.category?.name}</p>
                        </li>

                        {/* rating */}
                        <li>
                          <StarRating
                            value={review?.rating}
                            starSize={4}
                          />
                        </li>

                        {/* title */}
                        <li className='capitalize truncate font-bold text-sm'>{review?.title}</li>

                        {/* review */}
                        <li className='truncate'>{review?.review}</li>

                        {/* status */}
                        <li className='capitalize text-xs text-center'>
                          <span className={clsx('badge py-1 px-2',
                            review?.status === 'pending' && 'bg-amber-100 text-amber-500',
                            review?.status === 'approved' && 'bg-green-100 text-green-600',
                            review?.status === 'hidden' && 'bg-gray-100 text-gray-500',
                          )}>

                          {review?.status}

                          </span>
                        </li>

                        {/* Actions */}
                        <li className="flex items-center justify-center z-50">
                          <Menu as="div" className='relative'>
                            {({ open }) => (
                              <>
                                <MenuButton as='div'
                                  className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
                                  border border-gray-300 !text-gray-900 cursor-pointer"
                                >
                                  <IoMdMore size={20} />
                                </MenuButton>
                                <ContextMenu 
                                  open={open}
                                  items={[
                                    { id: 'approved', 
                                      icon: review?.status === 'approved' ? 
                                      <IoMdCheckmarkCircleOutline className='text-xl text-primary-400' />
                                      : <FaRegCircleXmark className='text-xl' />,
                                      text: <span className='capitalize'> {
                                        review?.status === 'approved' ? 'approved' : 'approve'
                                      } </span>,
                                      onClick: () => {},
                                      tail: <ToggleSwitch 
                                              size={4}
                                              value={review?.status === 'approved'}
                                              onChange={() => 
                                                handleStatusChange(review?._id, review?.status)
                                              }
                                            />
                                    },
                                  ]}
                                />
                              </>
                            )}
                            
                          </Menu>
                        </li>

                      </ul>

                    </motion.div>
                  )
                })}
              </AnimatePresence>

            </motion.li>

          }

          {/* Pagination */}
          {reviews.length > 0 && <motion.li
            layout
            key="pagination"
            /* custom={filteredOffers.length + 1} */
            className="px-4 py-5"
          >
            
            <AdminPagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />

          </motion.li>}

        </motion.ul>

      </div>

    </section>
  )
}

const UserReviews = React.memo(UserReviewsComponent);

export default UserReviews