

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiOutlineTrash } from "react-icons/hi2";
import { IoMdMore } from "react-icons/io";
import ContextMenu from '../../../components/ui/ContextMenu';
import AdminPagination from '../../../components/ui/AdminPagination';
import { useDispatch } from 'react-redux';
import { deleteBrandAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import Alert from '../../../components/ui/Alert'
import { Menu, MenuButton } from '@headlessui/react';
import Skeleton from '../../../components/ui/Skeleton';
import AddBrandModal from '../../../components/admin/brands/AddBrandModal'
import { MdOutlineEdit } from "react-icons/md";
import EditBrandModal from "../../../components/admin/brands/EditBrandModal";
import { setLoading } from "../../../store/slices/CommonSlices";
import {useOutletContext } from "react-router";


function BrandList() {

  const dispatch = useDispatch();
  
  const { list, searchQuery, filter, action } = useOutletContext();
  const [brands, setBrands] = useState([]);

  /* initial data loader */
  useEffect(() => {
    setBrands(list);
  }, [list]);

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(brands?.length / itemsPerPage);

  const paginatedBrands = brands?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  /* add brand action */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(()=>{
    if(action === 'openAddBrandModal'){
      setIsAddOpen(true)
    }
  },[action])

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
        dispatch(setLoading(true));
        const response = await deleteBrandAction('brands', id);

        if(response?.data?.success){
          setBrands(prev => prev.filter(brand => brand._id !== id));
          AxiosToast(response, false);
        }else{
          AxiosToast(response);
        }
        dispatch(setLoading(false))
      }
    })

  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = (i) =>  ({
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: i * 0.05 },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.25, ease: "easeInOut", delay: i * 0.05 },
    },
  });

  const noDataVariants = {
    hidden: { opacity: 0, height:0 },
    visible: {
      opacity: 1,
      height:'auto',
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };
  
  return (
    
    <motion.ul
      key={`brand-page-${currentPage}`}
      className="flex flex-col"
    >

      {paginatedBrands.length > 0 ? (
        <motion.li
          key={currentPage} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className='grid grid-cols-5 gap-6 h-50 my-5'
        >
          <AnimatePresence mode="popLayout">
            {paginatedBrands.map((brand, i) => 

              /* brand item */
              <motion.div
                layout='position'
                key={brand?._id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={rowVariants(i)}
                className=''
              >

                <div
                  className="border border-gray-300 bg-gray-50 space-y-1 rounded-4xl overflow-hidden shadow-lg"
                >
                  {/* brand logo and menu */}
                  <div className="flex h-30">
                    <div className="flex relative overflow-hidden bg-white border-b border-gray-300">
                      <Menu as="div" className="absolute right-3 top-3 overflow-hidden w-2 inline-flex justify-center">
                        {({open}) => (
                          <>
                            <MenuButton className="!bg-transparent !text-gray-500 !p-0 !shadow-none">
                              <IoMdMore size={25} />
                            </MenuButton>

                            <ContextMenu
                              open={open}
                              items={[
                                { id: 'edit',
                                  icon: <MdOutlineEdit className='text-xl'/>, 
                                  text: <span className={`capitalize`}> edit </span>,
                                  onClick: ()=> {
                                    setIsEditOpen(true);
                                    setEditingBrand(brand);
                                  }
                                },
                                { id: 'delete', 
                                  icon: <HiOutlineTrash className='text-xl' />,
                                  text: <span className={`capitalize`}> delete </span>,
                                  onClick: () => handledelete(brand._id) ,
                                  itemClass: 'bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100'
                                }
                              ]}
                            />
                          </>
                        )}

                      </Menu>
                      <img src={brand?.logo} className="w-full object-contain" alt="brand-logo" />
                    </div>
                  </div>

                  {/* detail */}
                  <div className="px-3 mb-2 flex space-y-0.5 flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <span className='text-sm font-semibold capitalize'>{brand.name}</span>
                      {brand?.featured && 
                        <p className="text-xs text-featured-500 inline-flex items-center w-fit rounded-xl
                        after:bg-featured-300 after:content[''] after:p-0.75 after:ms-1
                        after:inline-flex after:items-center after:rounded-full"
                        >Featured</p>
                      }
                    </div>
                    <p className="text-xs">
                      <span>{brand?.products} {brand?.products > 1 ? 'products' : 'product'}</span>
                      <span className='text-gray-300 mx-1'>|</span>
                      <span>{brand?.categories} {brand?.categories > 1 ? 'categories' : 'category'}</span>
                    </p>
                    <div className="flex items-center capitalize space-x-2">
                      <span className='text-xs'>{brand.visible ? 'Visible' : 'Invisible'}</span>
                      <div className="w-[1.5px] h-3 bg-gray-300"></div>
                      <span className='text-xs'>{brand?.status}</span>
                    </div>
                    
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.li>
            
      ) : !searchQuery?.trim() && !Object.keys(filter)?.length ? (
          
          <motion.li className='w-full grid grid-cols-5 gap-6'>
            {
              [...Array(5)].map((_,i) => (
                <div key={i} className='border border-gray-300 bg-white overflow-hidden rounded-4xl shadow-md/4'>
                  <div className="flex w-full">
                    <Skeleton className='w-[164]px h-[110px]' />
                  </div>
                  <div className="px-3 py-3 flex flex-col h-20 space-y-1 justify-end">
                    <Skeleton height='h-4' width='w-7/10'/>
                    <Skeleton height='h-4' width='w-7/10'/>
                    <Skeleton height='h-3' width='w-5/10'/>
                  </div>
                </div>
              ))
            }
          </motion.li>

      ) : (

          <AnimatePresence>
            <motion.li
              key="not-found"
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={noDataVariants}
              className="flex items-center"
            >
              <span
                className="w-full h-full text-center py-10 text-primary-400
                text-xl bg-primary-50 border border-primary-300/50 rounded-3xl"
              >No brands found</span>
            </motion.li>
          </AnimatePresence>

        
      )}
        
      {/* Pagination */}
      {brands?.length > itemsPerPage && 
        <motion.li
          key="pagination"
          layout
          className="flex justify-center py-5"
        >
          <AdminPagination 
            currentPage={currentPage} 
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

        </motion.li>
      }

      <AddBrandModal
        isOpen={isAddOpen}
        onCreate={handleCreate}
        onClose={() => setIsAddOpen(false)}
      />

      <EditBrandModal
        brands={brands}
        brand={editingBrand}
        isOpen={isEditOpen}
        onUpdate={handleUpdate}
        onClose={() => setIsEditOpen(false)}
      />

    </motion.ul>
  )
  
}

export default BrandList