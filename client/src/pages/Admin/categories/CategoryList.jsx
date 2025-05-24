import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowForward, IoMdMore } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import { TbCategoryPlus, TbUserEdit } from "react-icons/tb";
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import Alert from '../../../components/ui/Alert';
import AddCategoryModal from '../../../components/admin/categories/AddCategoryModal';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import AdminPagination from '../../../components/ui/AdminPagination';
import Skeleton from '../../../components/ui/Skeleton';
import EditCategoryModal from '../../../components/admin/categories/EditCategoryModal';
import { deleteCategoryAction } from '../../../services/ApiActions';
import PreviewImage from '../../../components/ui/PreviewImage'
import AxiosToast from '../../../utils/AxiosToast';
import { setLoading } from '../../../store/slices/CommonSlices'
import { useDispatch } from 'react-redux';
import DropdownButton from '../../../components/ui/DropdownButton';
import { FaSort } from 'react-icons/fa6';
import { BsSortDown, BsSortDownAlt } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import { containerVariants, rowVariants } from '../../../utils/Anim';
import ImagePlaceHolder from '../../../components/ui/ImagePlaceHolder';

const CategoryList = () => {

  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchCategories();
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

    const parent = categories?.find(item => item._id === doc.parentId);
    const docWithParent = {
      ...doc,
      parentId: parent || doc.parentId
    }

    const sorted = [...categories, docWithParent].sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    
    setCategories(sorted);
    setIsAddOpen(false);
  }

  /* update action handleing */
  const handleUpdate =  (doc) => {

    const parent = categories?.find(item => item._id === doc.parentId);
    const docWithParent = {
      ...doc,
      parentId: parent || doc.parentId
    }

    setCategories(prev => 
      prev.map(item => {
        if(item._id === doc._id){
          return docWithParent;
        }else if(item.parentId?._id === doc._id){
          return{
            ...item,
            parentId:{
              ...docWithParent
            }
          }
        }else{
          return item
        }
      })
    );
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

        {/* filter sort */}
        <div className='flex items-center h-full gap-x-2'>
          {/* sort */}
          <DropdownButton
            label='sort'
            icon={<FaSort className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={[
              { id: 'priceltoh', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> price: low to high </span>,
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
          />

          {/* filter */}
          <DropdownButton
            label='filter'
            icon={<CiFilter className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={[
              { id: 'featured', 
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
              },
            ]}
          />
        </div>
        
      </div>

      {/* content - first div fot smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-300 p-4.5">
          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>Name</span>
            <span>Slug</span>
            <span>Parent</span>
            <span>Status</span>
            <span>Visibility</span>
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

                  {paginatedCategories.length > 0 ?
                    ( paginatedCategories.map((category, index) => {

                    const statusColors = () => {
                      switch(category.status){
                        case 'active': return 'bg-green-500/40 text-teal-800'
                        case 'blocked': return 'bg-red-100 text-red-500'
                        default : return 'bg-gray-200 text-gray-400'
                      }
                    }

                    const parent = category.parentId;

                    return(
                    
                      <motion.div
                        layout
                        key={category._id}
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
                    
                        <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_1fr] 
                          items-center w-full px-4 py-2 bg-white"
                        >
                          {/* Checkbox */}
                          <div><input type="checkbox" /></div>

                          {/* Category Info */}
                          <div className="flex gap-2 items-center">
                            {category?.thumb?.url ? 
                              (<PreviewImage src={category?.thumb?.url} alt={category?.name} size="40" zoom="120%" 
                                thumbClass="rounded-xl border border-gray-300 w-12 h-12"
                              />)
                              :
                              (<ImagePlaceHolder
                                size={22}
                                className="rounded-xl border border-gray-300 bg-white text-gray-500/60 w-12 h-12"
                                />)
                            }
                            
                            <div className="inline-flex flex-col capitalize">
                              <p className="font-semibold">{category?.name}</p>
                              <p className="text-xs">000 products</p>
                              {category?.featured && 
                                <p className="text-xs text-featured-500 inline-flex items-center w-fit rounded-xl
                                  before:bg-featured-300 before:content[''] before:p-0.75 before:me-1
                                  before:inline-flex before:items-center before:rounded-full"
                                >Featured</p>
                              }
                            </div>
                          </div>

                          {/* Slug */}
                          <div>/{category.slug || <span className="text-gray-400">Not added</span>}</div>
                          
                          {/* parent name */}
                          <div className='capitalize'>{parent?.name || <span className="text-gray-400">Nil</span>}</div>

                          {/* Status */}
                          <div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                              ${statusColors()}`}>
                              {category?.status}
                            </span>
                          </div>
                          
                          {/* visibility */}
                          <div className='capitalize'>
                            {category?.visible ? 'visible' : <span className="text-gray-400">Invisible</span>}
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
                                      { id: 'delete', 
                                        icon: <HiOutlineTrash className='text-xl' />,
                                        text: <span className={`capitalize`}> delete </span>,
                                        onClick: () => handledelete(category._id) ,
                                        itemClass: 'bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100'
                                      }
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
                      No categories
                    </div> )
                  }

                </AnimatePresence>

              </li>
            }

          {/* Pagination */}
          {paginatedCategories.length > 0 && <li
            key="pagination"
            custom={filteredCategories.length + 1}
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

      <AddCategoryModal
        categories={categories}
        isOpen={isAddOpen}
        onCreate={handleCreate}
        onClose={() => setIsAddOpen(false)}
      />

      <EditCategoryModal
        category={editingCategory}
        list={categories.filter(item => item._id !== editingCategory?._id)}
        isOpen={isEditOpen}
        onUpdate={handleUpdate}
        onClose={() => setIsEditOpen(false)}
      />

    </section>
  )
}

export default CategoryList