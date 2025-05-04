import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowForward, IoMdMore } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import { TbCategoryPlus, TbUserEdit } from "react-icons/tb";
import category_sample from '../../../assets/12.jpg'
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import { MdOutlineEdit } from 'react-icons/md';
import Alert from '../../../components/ui/Alert';
import AddCategoryModal from '../../../components/admin/categories/AddCategoryModal';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import AdminPagination from '../../../components/ui/AdminPagination';
import Skeleton from '../../../components/ui/Skeleton';
import EditCategoryModal from '../../../components/admin/categories/EditCategoryModal';
import { IoEyeOutline } from 'react-icons/io5';
import PreviewImage from '../../../components/ui/HoverImagePreview';
import { deleteCategoryAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import { setLoading } from '../../../store/slices/CommonSlices'
import { useDispatch } from 'react-redux';

const CategoryList = () => {

  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchCategories()
  },[])

  const fetchCategories = async() => {
    setIsLoading(true)
    try {
        
      const response = await Axios({
        ...ApiBucket.getCategories
      })

      if(response.data.success){
        
        const sorted = response.data.categories.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    
        setCategories(sorted);
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
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>{

      const fields = ['name','slug']

      return fields.some(field => {

        if(category[field]){
          return category[field].includes(searchQuery)
        }
        return false

      })

    });

  },[searchQuery, categories])


  /* add category action */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  /* create action handleing */
  const handleCreate =  (doc) => {
    setCategories(prev => ([...prev, doc]));
    setIsAddOpen(false);
  }

  /* update action handleing */
  const handleUpdate =  (doc) => {
    setCategories(prev => (prev.map(item => item._id === doc._id ? doc : item)));
    setIsEditOpen(false);
  }

  /* handle delete category */
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
        const response = await deleteCategoryAction('categories', id);

        if(response?.data?.success){
          setCategories(prev => prev.filter(category => category._id !== id));
          AxiosToast(response, false);
        }else{
          AxiosToast(response);
        }
        dispatch(setLoading(false))
      }
    })

  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, transform: 'translateY(-20px)' },
    visible: {
      opacity: 1,
      transform: 'translateY(0)',
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='flex flex-col p-6 bg-gray-100'>
    
      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Category Management</h3>
          <span className='sub-title'>Add, edit and delete categories</span>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <TbCategoryPlus size={20} />
          <span>Add Category</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Categories</span>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center relative w-3/10">
          <LuSearch size={20} className='absolute left-3'/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder='Search users'
            className='pl-10! rounded-xl! bg-white' />
        </div>

        <div>
          <span>Filter</span>
        </div>
        
      </div>

      <motion.ul 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col w-full h-full text-sm text-gray-700 bg-white rounded-3xl overflow-hidden
          shadow-lg border border-gray-200 divide-y divide-gray-300">
        {/* Header */}
        <li className="bg-white text-gray-500 uppercase font-semibold tracking-wider p-4.5">
          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2">
            <span><input type="checkbox" /></span>
            <span>Name</span>
            <span>Slug</span>
            <span>Parent</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>
        </li>

        <AnimatePresence>

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
            paginatedCategories.map((category, index) => {

              const statusColors = () => {
                switch(category.status){
                  case 'active': return 'bg-green-100 text-teal-600'
                  case 'blocked': return 'bg-red-100 text-red-500'
                  default : return 'bg-gray-200 text-gray-400'
                }
              }

              const parent = category.parentId;

              return(
              
                <motion.li
                  layout
                  key={category._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="bg-white hover:bg-primary-25 transition-all duration-300 px-4 py-2"
                  >
                  
                  <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2">
                    {/* Checkbox */}
                    <div><input type="checkbox" /></div>

                    {/* Category Info */}
                    <div className="flex gap-2 items-center">
                      <PreviewImage src={category?.image} alt={category?.name} size="40" zoom="120%" />
                      
                      <div className="inline-flex flex-col">
                        <p className="capitalize">{category?.name}</p>
                        {/* <p className="text-xs text-gray-500">{user?.email}</p> */}
                      </div>
                    </div>

                    {/* Slug */}
                    <div>/{category.slug || <span className="text-gray-400">Not added</span>}</div>
                    
                    {/* Contact */}
                    <div>{parent?.name || <span className="text-gray-400">Nil</span>}</div>

                    {/* Status */}
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                        ${statusColors()}`}>
                        {category?.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3 z-50">
                      <div 
                        onClick={() => {
                          setIsEditOpen(true);
                          setEditingCategory(category)
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
                                /* { label: 'view category', icon: IoEyeOutline, onClick: () => {} }, */
                                { label: 'delete', icon: HiOutlineTrash, onClick: () => handledelete(category._id) }
                              ]}
                            />
                          </>
                        )}
                        
                      </Menu>
                      
                    </div>
                  </div>
                  
                </motion.li>
                
              )}
          )}

        </AnimatePresence>

        {/* Pagination */}
        {paginatedCategories && <motion.li
          key="pagination"
          custom={filteredCategories.length + 1}
          initial="hidden"
          animate="visible"
          variants={rowVariants}
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

      <AddCategoryModal
        categories={categories}
        isOpen={isAddOpen}
        onCreate={handleCreate}
        onClose={() => setIsAddOpen(false)}
      />

      <EditCategoryModal
        category={editingCategory}
        list={categories}
        isOpen={isEditOpen}
        onUpdate={handleUpdate}
        onClose={() => setIsEditOpen(false)}
      />

    </section>
  )
}

export default CategoryList