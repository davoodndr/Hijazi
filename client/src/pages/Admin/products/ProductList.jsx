import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowDown, IoIosArrowForward, IoMdMore } from 'react-icons/io';
import { LuEye, LuEyeClosed, LuPackagePlus, LuSearch } from 'react-icons/lu';
import { TbCategoryPlus, TbUserEdit } from "react-icons/tb";
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import Alert from '../../../components/ui/Alert';
import AddCategoryModal from '../../../components/admin/categories/AddCategoryModal';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import AdminPagination from '../../../components/ui/AdminPagination';
import Skeleton from '../../../components/ui/Skeleton';
import ImagePlaceHolder from '../../../components/ui/ImagePlaceHolder';
import { deleteCategoryAction } from '../../../services/ApiActions';
import PreviewImage from '../../../components/ui/PreviewImage'
import AxiosToast from '../../../utils/AxiosToast';
import { setLoading } from '../../../store/slices/CommonSlices'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const ProductList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchDatas()
  },[])

  const fetchDatas = async() => {
    setIsLoading(true)
    try {

      const response = await Promise.all([
        Axios({
          ...ApiBucket.getProducts
        }).then(res => ({products:res.data.products})), 
        Axios({
          ...ApiBucket.getCategories
        }).then(res => ({categories:res.data.categories})), 
        Axios({
          ...ApiBucket.getBrands
        }).then(res => ({brands:res.data.brands}))
      ]);
      
      if(response){
        
        const [productData, categoryData, brandData] = response;
        /* const extractedProducts = productData.products.flatMap(product => {
          if(product.variants.length){
            return product.variants.map(variant => ({
              ...product,
              images:null,
              variants: null,
              baseImage: product.images[0],
              ...variant
            }))
          }else{
            return {
              ...product,
              image: product.images[0]
            }
          }
          
        }) */
        
        // const sortedProducts = extractedProducts.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
        const sortedProducts = productData.products.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
        const sortedCategories = categoryData.categories.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
        const sortedBrands = brandData.brands.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    
        setCategories(sortedCategories);
        setBrands(sortedBrands);
        setProducts(sortedProducts);
      }

    } catch (error) {
      console.log(error.message || error);
      toast.error(error.message || 'Unexpected error happened')
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
  const filteredProducts = useMemo(() => {
    return products.filter(product =>{

      const fields = ['name','slug']

      return fields.some(field => {

        if(product[field]){
          return product[field].includes(searchQuery)
        }
        return false

      })

    });

  },[searchQuery, products])


  /* variant expand */
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (productId) => {
    setExpanded((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

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
        const response = await deleteCategoryAction('products', id);

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
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='flex flex-col p-6 bg-gray-100'>
    
      {/* page title & add category button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Product Management</h3>
          <span className='sub-title'>Add, edit and delete products</span>
        </div>
        <button 
          onClick={() => navigate('/admin/products/add-product',{state:{categories, brands}})}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <LuPackagePlus size={20} />
          <span>Add Product</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Products</span>
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

      {/* content - first div fot smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-300 p-4.5">
          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>status</span>
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
                  
                  {paginatedProducts.length > 0 ?
                    ( paginatedProducts.map((product, index) => {

                    const statusColors = () => {
                      switch(product.status){
                        case 'active': return 'bg-green-500/40 text-teal-800'
                        case 'blocked': return 'bg-red-100 text-red-500'
                        default : return 'bg-gray-200 text-gray-400'
                      }
                    }
                    
                    const variants = product.variants;
                    let price, stock = 0, variantLen = variants.length;
                  
                    if(variants.length){
                      const prices = variants.map(item => {
                        stock += item.stock;
                        return item.price
                      })
                      const min = Math.min(...prices);
                      const max = Math.max(...prices);
                      price = `${min === max ? min : `${min} - ${max}`}`
                    } 

                    return(
                      <React.Fragment key={product._id}>

                        <motion.div 
                          layout
                          key={product._id}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={rowVariants}
                          whileHover={{
                            backgroundColor: '#efffeb',
                            transition: { duration: 0.3 }
                          }}
                          className="bg-white"
                        >

                          <div
                            className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_1fr] 
                            items-center w-full px-4 py-2"
                          >
                            {/* Checkbox */}
                            <div><input type="checkbox" /></div>

                            {/* product Info & thumbnail */}
                            <div className="flex gap-2 items-center relative">

                              {/* varinats expand arrow */}
                              <div 
                                onClick={() => toggleExpand(product._id)}
                                className={`absolute top-1/2 -left-5 -translate-y-1/2 cursor-pointer smooth
                                  hover:text-featured-500
                                  ${product.variants?.length ? 
                                    'text-gray-800' : 
                                    'text-gray-300 pointer-events-none cursor-not-allowed'}`}>
                                <IoIosArrowDown />
                              </div>

                              <PreviewImage src={product?.images[0]?.url} alt={product?.name} size="40" zoom="120%"
                                thumbClass="rounded-xl border border-gray-300 w-12 h-12"
                              />
                              
                              <div className="inline-flex flex-col capitalize">
                                <p className="font-semibold">{product?.name}</p>
                                <p className="text-xs">
                                  {variantLen ? variantLen + ` Variant${variantLen > 1 ? 's': ''}` : product.sku}
                                </p>
                                {product?.featured &&  <p className="point-before">Featured</p>
                                }
                              </div>
                            </div>

                            {/* category */}
                            <div className='capitalize flex flex-col'>
                              <span>{product.category.name}</span>
                              {product.category.parentId && 
                                <span className='text-xs text-gray-400'> 
                                  <span className='me-1'>of:</span>
                                  {categories?.find(cat => cat._id === product.category?.parentId)?.name}
                                </span>
                              }
                            </div>
                            
                            {/* price */}
                            <div className='capitalize flex flex-col'>
                              <span className='price-before'>{price}</span>
                              <span className='text-xs'>Rating</span>
                            </div>

                            {/* stock */}
                            <div className='capitalize'>{stock}</div>

                            {/* Status */}
                            <div className='flex flex-col space-y-0.75 '>
                              <span className={`w-fit px-2 py-0.5 text-xs font-semibold rounded-full capitalize
                                ${statusColors()}`}>
                                {product?.status}
                              </span>
                              {/* visibility */}
                              <div className='capitalize text-xs w-fit'>
                                {product?.visible ? 
                                <span 
                                  className="text-xs text-yellow-600 point-before point-before:bg-yellow-500
                                  point-before:p-0.75"
                                  >Visible</span> 
                                  
                                  :
                                
                                  <span 
                                    className="text-xs text-red-400 point-before point-before:bg-red-400
                                    point-before:p-0.75"
                                    >Hidden</span>
                                }
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3 z-50">
                              <div 
                                onClick={() => navigate(`/admin/products/${product?.slug}/edit`,
                                  {state: {categories, brands, currentProduct:product}})
                                }
                                
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
                                        { label: 'delete', icon: HiOutlineTrash, onClick: () => handledelete(product._id) }
                                      ]}
                                    />
                                  </>
                                )}
                                
                              </Menu>
                              
                            </div>

                            

                          </div>

                        </motion.div>

                        {/* variant items */}
                         <AnimatePresence>
                          {expanded[product._id] && product.variants?.length > 0 && 
                            product.variants.map((variant, i) =>
                              <motion.div
                                key={variant._id}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden border-b-gray-200"
                              >
                                <div
                                  key={variant.sku}
                                  className='grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center w-full px-4 py-1
                                  bg-gray-100/60 smooth hover:bg-primary-50/50 group group:-z-1'>

                                  <div><input type="checkbox" /></div>
                                  <div className="flex gap-2 items-center relative">
                                    {variant.image?.url ? 
                                      (<PreviewImage src={variant.image?.url} alt={product?.name} zoom="80%"
                                      thumbClass="rounded-xl border border-gray-300 w-10 h-10"
                                      />)
                                      :
                                      (<ImagePlaceHolder
                                        size={18}
                                        className="rounded-xl border border-gray-300 bg-gray-200 text-gray-500/60 w-10 h-10"
                                        />)
                                    }
                                    
                                    <div className="inline-flex flex-col capitalize">
                                      <p className="text-xs">SKU: {variant.sku}</p>
                                    </div>
                                  </div>
                                  <div className='flex flex-col uppercase text-xs'>
                                    {Object.keys(variant.attributes).map((key, i) => 
                                      <div key={i}>
                                        <span className='text-gray-400'>{key}:</span>
                                        <span>{variant.attributes[key]}</span>
                                      </div>
                                    )}
                                  </div>
                                  {/* price */}
                                  <div className='capitalize flex flex-col'>
                                    <span className='price-before'>{variant.price}</span>
                                    <span className='text-xs'>Rating</span>
                                  </div>
                                  {/* stock */}
                                  <div className='capitalize'>{variant.stock}</div>
                                </div>
                              </motion.div>
                            )
                          }
                        </AnimatePresence>
                      </React.Fragment>                    
                    )}))
                    :
                    (<div className="flex items-center justify-center h-20 text-primary-400
                      text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl">
                      No products
                    </div> )
                  }

                </AnimatePresence>

              </li>
            }

          {/* Pagination */}
          {paginatedProducts.length > 0 && <li
            key="pagination"
            custom={filteredProducts.length + 1}
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

    </section>
  )
}

export default ProductList