

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiOutlineTrash } from "react-icons/hi2";
import { IoMdCheckmarkCircleOutline, IoMdMore } from "react-icons/io";
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
import SearchFilterComponent from '../pageComponents/SearchFilterComponent';
import clsx from 'clsx';
import { addBrand, setAllBrands, updateBrand } from '../../../store/slices/BrandSlice';
import { useBrandStatusMutation, useDeleteBrandMutation } from '../../../services/MutationHooks';
import { FaRegCircleXmark } from 'react-icons/fa6';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';


function BrandList() {

  const dispatch = useDispatch();
  
  const { data, action } = useOutletContext();

  /* filter */
  const [searchQuery, setSearchQuery] = useState(null);
  const [filter, setFilter] = useState({});
  const handleOnFilter = (filtered) => {
    setFilter(filtered?.filter)
  }

  /* sort */
  const [sortedData, setSortedData] = useState([]);

  const handleOnSort = (sorted) => {
    setSortedData(sorted?.list);
  }

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const paginatedBrands = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(()=>{
    if(action === 'openAddBrandModal'){
      setIsAddOpen(true)
    }
  },[action])
  

  /* brand actions handling */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const changeStatusMutation = useBrandStatusMutation();
  const deleteBrandMutation = useDeleteBrandMutation();

  const handleCreate =  (doc) => {
    dispatch(addBrand(doc))
    setIsAddOpen(false);
  }

  const handleUpdate =  (doc) => {
    dispatch(updateBrand(doc));
    setIsEditOpen(false);
  }

  const handledelete = async(id) => {

    Alert({
      icon: 'question',
      title: "Are you sure?",
      html: 'This action cannot revert back',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      customClass: {
				confirmButton: '!bg-red-500 !hover:bg-red-700',
				title: '!text-red-500',
				icon: '!text-red-500',
				htmlContainer: '!text-red-500'
			},
    }).then(async result => {
      
      if(result.isConfirmed){

        dispatch(setLoading(true));

        const response = await deleteBrandMutation.mutateAsync({ folder: 'brands', brand_id: id });

        if(response?.data?.success){

          const restBrands = sortedData?.filter(brand => brand._id !== id);
          dispatch(setAllBrands(restBrands))
          AxiosToast(response, false);

        }else{
          AxiosToast(response);
        }
        dispatch(setLoading(false))
      }
    })

  }

  const handleStatusChange = (brand, status) => {
    let data = {};
    let statusChange = null;

    switch (status) {
      case "active":
        data = {
          text: "Yes, deactivate now",
          msg: "All products under this brand will be hidden.",
          color: "!bg-pink-500 hover:!bg-pink-600",
        };
        statusChange = "inactive";
        break;
      case "inactive":
        data = {
          text: "Yes, activate now",
          msg: "All products under this brand will be shown.",
          color: "",
        };
        statusChange = "active";
        break;

      default:
        null;
    }

    Alert({
      icon: "question",
      title: "Are you sure?",
      text: data.msg,
      showCancelButton: true,
      confirmButtonText: data.text,
      customClass: {
        popup: "!w-[400px]",
        confirmButton: data.color,
      },
    }).then(async (result) => {

      if (result.isConfirmed) {
        dispatch(setLoading(true));

        try {
          const response = await changeStatusMutation
          .mutateAsync({ brand_id: brand?._id, status: statusChange });

          if (response?.data?.success) {
            const updatedBrand = response?.data?.brand;
            
            dispatch(updateBrand(updatedBrand));
            AxiosToast(response, false);
          }

        } catch (error) {
          AxiosToast(error);
        } finally {
          dispatch(setLoading(false));
        }
      }

    });
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
    
    <>
      {/* search, filter, sort*/}
      <SearchFilterComponent
        data={data}
        onSearch={(value)=> setSearchQuery(value)}
        onFilter={handleOnFilter}
        onSort={handleOnSort}
      />

      <div className="flex flex-col w-full">

        {/* table contents */}
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
                                    {
                                      id: "active",
                                      icon:
                                        brand?.status === "active" ? (
                                          <IoMdCheckmarkCircleOutline className="text-xl text-primary-400" />
                                        ) : (
                                          <FaRegCircleXmark className="text-xl" />
                                        ),
                                      text: (
                                        <span className={`capitalize`}>
                                          {brand?.status}
                                        </span>
                                      ),
                                      onClick: () => {},
                                      tail: (
                                        <ToggleSwitch
                                          size={4}
                                          value={brand?.status === "active"}
                                          onChange={() =>
                                            handleStatusChange(brand, brand?.status)
                                          }
                                        />
                                      ),
                                    },
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
                      <div className="px-3 py-1 mb-2 flex space-y-1 flex-col justify-end">
                        <div className="flex items-center justify-between">
                          <span className='text-sm font-semibold capitalize leading-3'>{brand.name}</span>
                          {brand?.featured && 
                            <span className='point-before'>Featured</span>
                          }
                        </div>
                        <p className="text-xs leading-4">
                          <span>{brand?.products} {brand?.products > 1 ? 'products' : 'product'}</span>
                          <span className='text-gray-300 mx-1'>|</span>
                          <span>{brand?.categories} {brand?.categories > 1 ? 'categories' : 'category'}</span>
                        </p>
                        <div className="flex items-center capitalize space-x-2">
                          {/* <span className='text-xs'>{brand.visible ? 'Visible' : 'Invisible'}</span>
                          <div className="w-[1.5px] h-3 bg-gray-300"></div> */}
                          <span 
                            className={clsx('text-xs px-2 py-0.5 rounded-full',
                              brand?.status === 'active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-500'
                            )}
                          >{brand?.status}</span>
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
          {sortedData?.length > itemsPerPage && 
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
            brands={sortedData}
            brand={editingBrand}
            isOpen={isEditOpen}
            onUpdate={handleUpdate}
            onClose={() => setIsEditOpen(false)}
          />

        </motion.ul>
      </div>
    </>
  )
  
}

export default BrandList