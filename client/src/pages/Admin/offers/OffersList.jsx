import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowForward, IoIosArrowUp, IoMdCheckmarkCircleOutline, IoMdMore } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import { TbCategoryPlus, TbUserEdit } from "react-icons/tb";
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import Alert from '../../../components/ui/Alert';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import AdminPagination from '../../../components/ui/AdminPagination';
import Skeleton from '../../../components/ui/Skeleton';
import { deleteCategoryAction } from '../../../services/ApiActions';
import PreviewImage from '../../../components/ui/PreviewImage'
import AxiosToast from '../../../utils/AxiosToast';
import { setLoading } from '../../../store/slices/CommonSlices'
import { useDispatch } from 'react-redux';
import DropdownButton from '../../../components/ui/DropdownButton';
import { FaRegCircleXmark, FaSort } from 'react-icons/fa6';
import { BsSortDown, BsSortDownAlt } from 'react-icons/bs';
import { IoIosArrowDown } from "react-icons/io";
import { CiFilter } from 'react-icons/ci';
import { containerVariants, rowVariants } from '../../../utils/Anim';
import clsx from 'clsx';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { format } from 'date-fns'
import SortHeader from '../../../components/ui/SortHeader';
import AddOfferModal from '../../../components/admin/offers/AddOfferModal';
import EditOfferModal from '../../../components/admin/offers/EditOfferModal';

const OffersList = () => {

  const dispatch = useDispatch();

  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSort, setCurrentSort] = useState(null)

  /* initial data loader */
  useEffect(() => {
    fetchOffers();
  },[])

  const fetchOffers = async() => {
    setIsLoading(true)
    try {
        
      const response = await Axios({
        ...ApiBucket.getOffers
      })

      if(response.data.success){    
        setOffers(response?.data?.offers);
        setCurrentSort({field: "createdAt", ascending: false})
      }

    } catch (error) {
      console.log(error.response.data.message)
    }finally{
      setIsLoading(false)
    }
  };
  
  /* debouncer */
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query)
    }, 300);

    return () => clearTimeout(timer);

  },[query])

  /* search filter */
  const filteredOffers = useMemo(() => {
    
    return offers?.filter(offer =>{

      const fields = ['code']

      return fields.some(field => {

        if(offer[field]){
          return offer[field].includes(searchQuery)
        }
        return false

      })

    });

  },[searchQuery, offers])

  /* sort */
  const [sortedOffers, setSortedOffers] = useState([]);
  const [sortOptions, setSortOptions] = useState([
    {title: 'offer code',field: 'code', ascending: true},
    {title: 'discount',field: 'discountValue', ascending: true},
    {title: 'min. purchase',field: 'minPurchase', ascending: true},
    {title: 'limit',field: 'usageLimit', ascending: true},
  ])
  

  useEffect(() => {
    let sorted;
    if(filteredOffers.length){
      const field = currentSort?.field;
      
      sorted = [...filteredOffers].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        if(typeof aVal === 'string'){
          return currentSort?.ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return currentSort?.ascending ? 
            (aVal > bVal ? 1 : aVal < bVal ? -1 : 0)
          : (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);

      })
    }

    sorted?.length > 0 && setSortedOffers(sorted)

  },[filteredOffers, currentSort])


  /* add offer action */
  const [isAddOpen, setIsAddOpen] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  /* create action handleing */
  const handleCreate =  (newOffer) => {
    
    setOffers(prev => [newOffer, ...prev])
    setIsAddOpen(false);
  }

  /* update action handleing */
  const handleUpdate =  (doc) => {

    setOffers(prev => 
      prev.map(item => {
        if(item._id === doc._id){
          return doc
        }else{
          return item
        }
      })
    );
    setIsEditOpen(false);
  }

  /* handle delete offer */
  const handledelete = async(id) => {

    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: 'This action cannot revert back',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: 'var(--color-red-500)'
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        const response = await deleteCategoryAction('offers', id);

        if(response?.data?.success){
          setOffers(prev => prev.filter(offer => offer._id !== id));
          AxiosToast(response, false);
        }else{
          AxiosToast(response);
        }
        dispatch(setLoading(false))
      }
    })

  }

  /* handle archive offer */
  const handleStatusChange = async(id, status) => {

    let data = {};
    let statusChange = null;

    switch(status){
      case 'active' : 
        data = {
          text: 'Yes, deactivate now', 
          msg: 'The inactive offer won\'t accessible any more.',
          color: '!bg-pink-500 hover:!bg-pink-600'
        };
        statusChange = 'inactive'
        break;
      case 'inactive' : 
        data = {
          text: 'Yes, activate now', 
          msg: 'Making active offer allow all offer operations.',
          color: ''
        };
        statusChange = 'active'
        break;

      default : null;
    }

    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: data.msg,
      showCancelButton: true,
      confirmButtonText: data.text,
      customClass: {
        popup: '!w-[400px]',
        confirmButton: data.color
      },
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        try {

          const response = await Axios({
            ...ApiBucket.changeOfferStatus,
            data: {
              offer_id: id,
              status: statusChange,
            }
          })

          if(response?.data?.success){
            const updated = response.data.offer;
            setOffers(prev => prev.map(offer => offer._id === updated._id ? updated : offer));
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

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedOffers.length / itemsPerPage);

  const paginatedOffers = sortedOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='flex flex-col p-6 '>
    
      {/* page title & add offer button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Offer Management</h3>
          <span className='sub-title'>Add, edit and delete offers</span>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <TbCategoryPlus size={20} />
          <span>Add Offer</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Offers</span>
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
      <div className="relative flex flex-col w-full bg-white rounded-3xl shade border border-gray-200">
        {/* Header */}
        <div className="text-gray-400 uppercase font-semibold tracking-wider
          border-b border-gray-300 px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
          <div className="grid grid-cols-[40px_1.2fr_1fr_1fr_1fr_1fr_1fr] items-center w-full">
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
            <span>Status</span>
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

                  {paginatedOffers.length > 0 ?
                    ( paginatedOffers.map((offer, index) => {

                    const statusColors = () => {
                      switch(offer.status){
                        case 'active': return 'bg-green-500/40 text-teal-800'
                        case 'expired': return 'bg-red-100 text-red-500'
                        default : return 'bg-gray-200 text-gray-400'
                      }
                    }

                    return(
                    
                      <motion.div
                        layout
                        key={offer._id}
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
                    
                        <div className="grid grid-cols-[40px_1.2fr_1fr_1fr_1fr_1fr_1fr] 
                          items-center w-full px-4 py-2 bg-white"
                        >
                          {/* Checkbox */}
                          <div><input type="checkbox" /></div>

                          {/* Caoupon Info */}
                          <div>
                            <p className="font-semibold">{offer?.code}</p>
                            <p className='text-gray-500 tracking-tight text-xs space-x-1'>
                              <span>{format(new Date(offer?.createdAt), "dd-MM-yy")}</span>
                              <span className='!text-base'>-</span>
                              <span>{format(new Date(offer?.expiry), 'dd-MM-yy')}</span>
                            </p>
                          </div>

                          {/* discount */}
                          <div>
                            <span className={clsx(offer?.discountType === 'fixed' && 'price-before')}>{offer.discountValue}</span>
                          </div>

                          {/* min puschase value */}
                          <div>
                            <span className='price-before'>{offer?.minPurchase}</span>
                          </div>

                          {/* usage limit */}
                          <div>
                            {offer?.usageLimit}
                            <span className="text-gray-400"> /per user</span>
                          </div>

                          {/* Status */}
                          <div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                              ${statusColors()}`}>
                              {offer?.status}
                            </span>
                          </div>
                          
                          

                          {/* Actions */}
                          <div className="flex items-center justify-center gap-3 z-50">
                            <div 
                              onClick={() => {
                                setIsEditOpen(true);
                                setEditingOffer(offer)
                              }}
                              className="p-2 rounded-xl bg-blue-100/50 hover:bg-sky-300 border 
                              border-primary-300/60 hover:scale-103 transition-all duration-300 cursor-pointer">
                              <TbUserEdit size={20} />
                            </div>

                            
                            <Menu as="div" className='relative'>
                              {({ open }) => (
                                <>
                                  <MenuButton
                                    className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
                                    border border-gray-300 !text-gray-900 cursor-pointer"
                                  >
                                    <IoMdMore size={20} />
                                  </MenuButton>
                                  <ContextMenu 
                                    open={open}
                                    items={[
                                      { id: 'active', 
                                        icon: offer?.status === 'active' ? 
                                        <IoMdCheckmarkCircleOutline className='text-xl text-primary-400' />
                                        : <FaRegCircleXmark className='text-xl' />,
                                        text: <span className={`capitalize`}> {offer?.status} </span>,
                                        tail: <ToggleSwitch 
                                                size={4}
                                                value={offer?.status === 'active'}
                                                onChange={() => 
                                                  handleStatusChange(offer?._id, offer?.status)
                                                }
                                              />
                                      },
                                      { id: 'delete', 
                                        icon: <HiOutlineTrash className='text-xl' />,
                                        text: <span className={`capitalize`}> delete </span>,
                                        onClick: () => handledelete(offer._id) ,
                                        itemClass: 'bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100'
                                      },
                                    ]}
                                  />
                                </>
                              )}
                              
                            </Menu>
                            
                          </div>
                        </div>
                      </motion.div>
                                            
                    )}))
                    :
                    (<div className="flex items-center justify-center h-20 text-primary-400
                      text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl">
                      No offers
                    </div> )
                  }

                </AnimatePresence>

              </li>
            }

          {/* Pagination */}
          {paginatedOffers.length > 0 && <li
            key="pagination"
            custom={filteredOffers.length + 1}
            className="px-4 py-5"
          >
            
            <AdminPagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />

          </li>
          }
        </motion.ul>
      </div>

      <AddOfferModal
        offers={offers}
        isOpen={isAddOpen}
        onCreate={handleCreate}
        onClose={() => setIsAddOpen(false)}
      />

      <EditOfferModal
        offer={editingOffer}
        isOpen={isEditOpen}
        onUpdate={handleUpdate}
        onClose={() => setIsEditOpen(false)}
      />

    </section>
  )
}

export default OffersList