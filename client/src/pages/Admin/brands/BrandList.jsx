
import { RiApps2AddLine } from "react-icons/ri";
import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuSearch } from "react-icons/lu";
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import { HiHome, HiOutlineTrash } from "react-icons/hi2";
import { IoIosArrowForward, IoMdMore } from "react-icons/io";
import ContextMenu from '../../../components/ui/ContextMenu';
import AdminPagination from '../../../components/ui/AdminPagination';
import { useNavigate } from 'react-router';
import { blockUserAction, deleteUserAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import Alert from '../../../components/ui/Alert'
import { Menu, MenuButton } from '@headlessui/react';
import Skeleton from '../../../components/ui/Skeleton';
import AddBrandModal from '../../../components/admin/brands/AddBrandModal'
import { MdOutlineEdit } from "react-icons/md";


function BrandList() {

  const navigate = useNavigate();
  
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchBrands()
  },[])
  
  const fetchBrands = async() => {
    setIsLoading(true)
    try {
      
      const response = await Axios({
        ...ApiBucket.getBrands
      })

      if(response.data.success){
        
        const sorted = response.data.brands.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    
        setBrands(sorted);
      }

    } catch (error) {
      console.log(error.response.data.message)
    }finally{
      setIsLoading(false)
    }
    
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

  /* add brand action */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  /* create action handling */
  const handleCreate =  (doc) => {
    setBrands(prev => ([...prev, doc]));
    setIsAddOpen(false);
  }

  /* update action handling */
  const handleUpdate =  (doc) => {
    setBrands(prev => (prev.map(item => item._id === doc._id ? doc : item)));
    setIsEditOpen(false);
  }

  /* delete action handling */
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
        dispatch(setIsLoading(true));
        const response = await deleteCategoryAction('categories', id);

        if(response?.data?.success){
          setBrands(prev => prev.filter(brand => brand._id !== id));
          AxiosToast(response, false);
        }else{
          AxiosToast(response);
        }
        dispatch(setIsLoading(false))
      }
    })

  }

  /* search filter */
  const filteredBrands = useMemo(() => {
    return brands.filter(brand =>{

      const fields = ['name','slug','status']

      return fields.some(field => {

        if(brand[field]){
          return brand[field].includes(searchQuery)
        }
        return false

      })

    });

  },[searchQuery, brands])

  const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y:-20 },
    visible: {
      opacity: 1,
      y:0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <section className='flex flex-col p-6'>

      {/* page title & add brand button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Brand Management</h3>
          <span className='sub-title'>Add, edit and delete brands</span>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <RiApps2AddLine size={20} />
          <span>Add Brand</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Brands</span>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center relative w-3/10">
          <LuSearch size={20} className='absolute left-3'/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder='Search brands'
            className='pl-10! rounded-xl! bg-white' />
        </div>

        <div>
          <span>Filter</span>
        </div>
        
      </div>

      {brands.length > 0 ?
        (<motion.ul 
          layout="position"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col">

            {isLoading ?
              <li className='w-full grid grid-cols-5 gap-6'>

                {
                  [...Array(8)].map((_,i) => (
                    <div key={i} className='border border-gray-300 bg-white overflow-hidden rounded-4xl shadow-md/4'>
                      <div className="flex w-full">
                        <Skeleton className='w-[164]px h-[140px]' />
                      </div>
                      <div className="px-3 py-3 flex flex-col space-y-1 justify-end">
                        <Skeleton height='h-4' width='w-7/10'/>
                        <Skeleton height='h-3' width='w-5/10'/>
                      </div>
                    </div>
                  ))
                }
                
              </li>
              :
              <li className="w-full grid grid-cols-5 gap-6 h-50">
                <AnimatePresence exitBeforeEnter>
                  {paginatedBrands.map((brand, index) => 

                    <motion.div 
                      layout="position"
                      key={brand._id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={rowVariants}
                      className='w-full border border-gray-300 bg-gray-50 space-y-1 rounded-4xl overflow-hidden shadow-lg'>

                      <div className="flex h-30 w-full">
                        <div className="flex relative w-full overflow-hidden bg-white border-b border-gray-300">
                          <Menu as="div" className="absolute right-3 top-3 overflow-hidden w-2 inline-flex justify-center">
                            {({open}) => (
                              <>
                                <MenuButton className="!bg-transparent !text-gray-500 !p-0 !shadow-none">
                                  <IoMdMore size={25} />
                                </MenuButton>

                                <ContextMenu
                                  open={open}
                                  items={[
                                    {label: 'edit', icon: MdOutlineEdit, onClick: ()=> {}},
                                    {label: 'delete', icon: HiOutlineTrash, onClick: ()=> {}}
                                  ]}
                                />
                              </>
                            )}

                          </Menu>
                          <img src={brand?.logo} className="w-full object-contain" alt="image" />
                        </div>
                      </div>
                      <div className="px-3 mb-2 flex space-y-0.5 flex-col justify-end">
                        <div className="flex items-center justify-between">
                          <span className='text-sm font-semibold capitalize'>{brand.name}</span>
                          {brand?.featured && 
                            <p className="text-xs text-green-700 inline-flex items-center w-fit rounded-xl
                            after:bg-green-500 after:content[''] after:p-0.75 after:ms-1
                            after:inline-flex after:items-center after:rounded-full"
                            >Featured</p>
                          }
                        </div>
                        <p className="text-xs">Products: 000</p>
                        <div className="flex items-center capitalize space-x-2">
                          <span className='text-xs'>{brand.visible ? 'Visible' : 'Invisible'}</span>
                          <div className="w-[1.5px] h-3 bg-gray-300"></div>
                          <span className='text-xs'>{brand?.status}</span>
                        </div>
                        
                      </div>
                    </motion.div>

                  )}
                </AnimatePresence>
              </li>  
            }

          {/* Pagination */}
          {paginatedBrands.length > 0 && <motion.li
              key="pagination"
              custom={filteredBrands.length + 1}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="py-5"
            >
              
              <AdminPagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                className={`grid grid-cols-1 items-center w-full bg-white border border-gray-300 
                  p-4 rounded-xl`}
              />

            </motion.li>
          }

        </motion.ul>)
        :
        (<div className="border border-gray-300 rounded-xl bg-white flex p-10 justify-center">
          <h2>Brands are empty</h2>
        </div>)
      }

      <AddBrandModal
        brands={brands}
        isOpen={isAddOpen}
        onCreate={handleCreate}
        onClose={() => setIsAddOpen(false)}
      />

    </section>
  )
}

export default BrandList