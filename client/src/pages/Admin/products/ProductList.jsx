import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowDown, IoIosArrowForward, IoMdCheckmarkCircleOutline, IoMdMore } from 'react-icons/io';
import { LuEye, LuEyeClosed, LuPackagePlus, LuSearch } from 'react-icons/lu';
import { TbUserEdit } from "react-icons/tb";
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import Alert from '../../../components/ui/Alert';
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import AdminPagination from '../../../components/ui/AdminPagination';
import Skeleton from '../../../components/ui/Skeleton';
import ImagePlaceHolder from '../../../components/ui/ImagePlaceHolder';
import { CiFilter } from "react-icons/ci";
import PreviewImage from '../../../components/ui/PreviewImage'
import AxiosToast from '../../../utils/AxiosToast';
import { setLoading } from '../../../store/slices/CommonSlices'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { MdOutlineArchive, MdOutlineUnarchive } from 'react-icons/md';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { FaRegCircleXmark, FaSort } from "react-icons/fa6";
import { BsSortDown, BsSortDownAlt } from "react-icons/bs";
import DropdownButton from '../../../components/ui/DropdownButton';
import { sortProductsByPrice } from '../../../utils/Utils';
import { containerVariants, rowVariants } from '../../../utils/Anim';

const ProductList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items:productList } = useSelector(state => state.products);
  const { categoryList } = useSelector(state => state.categories);
  const { brandList } = useSelector(state => state.brands);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    if(productList?.length){
      const sortedProducts = [...productList].sort((a,b) => b.createdAt.localeCompare(a.createdAt))
      setProducts(sortedProducts);
    }
    if(categoryList?.length){
      const sortedCategories = [...categoryList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      setCategories(sortedCategories);
    }
    if(brandList?.length){
      const sortedBrands = [...brandList].sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      setBrands(sortedBrands);
    }
  },[productList, categoryList, brandList]);
  
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
  const filteredProducts = useMemo(() => {
    return products.filter(product =>{

      if(searchQuery){
        const fields = ['name','slug']

        return fields.some(field => {

          if(product[field]){
            return product[field].includes(searchQuery)
          }
          return false

        })

      }else{

        if(!filter || !Object.keys(filter).length) return product;
        const [[key, value]] = Object.entries(filter)
        return product[key] === value
      }

    });

  },[searchQuery, filter, products])


  /* sort data */
  const sortData = (need, order) => {
    let sorted; 
    
    switch (need) {
      case 'price':
        sorted = sortProductsByPrice(products, order);
        break;

      default:
        sorted = [...products].sort((a, b) => {
          const aVal = a[need];
          const bVal = b[need];

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return order === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          return order === 'asc'
            ? (aVal > bVal ? 1 : aVal < bVal ? -1 : 0)
            : (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
        });
    }

    if(sorted?.length){
      setProducts(sorted);
    }
  }

  /* variant expand */
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (productId) => {
    setExpanded((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  /* handle archive product */
  const handleStatusChange = async(id,status) => {

    let data = {};
    let statusChange = null;

    switch(status){
      case 'active' : 
        data = {
          text: 'Yes, deactivate now', 
          msg: 'The inactive product won\'t accessible any more.',
          color: '!bg-pink-500 hover:!bg-pink-600'
        };
        statusChange = 'inactive'
        break;
      case 'inactive' : 
        data = {
          text: 'Yes, activate now', 
          msg: 'Making active product allow all product operations.',
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
            ...ApiBucket.changeProductStatus,
            data: {
              product_id: id,
              status: statusChange,
            }
          })

          if(response?.data?.success){
            const updated = response.data.product;
            setProducts(prev => prev.map(product => product._id === updated._id ? updated : product));
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

  /* handle product visibility */
  const handleVisibility = (product) => {
    
    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: product.visible ? 'This product will be hidden for users' : 'This product will be shown for users',
      showCancelButton: true,
      confirmButtonText: product.visible ? 'Yes, hide now' : 'Yes, show now',
      customClass: {
        popup: '!w-[400px]',
        confirmButton: `${product.visible ? '!bg-red-500 hover:!bg-red-600' 
          : '!bg-green-500 hover:!bg-green-600'}`
      },
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        try {

          const response = await Axios({
            ...ApiBucket.changeProductStatus,
            data: {
              product_id: product._id,
              visibility: !product.visible
            }
          })

          if(response?.data?.success){
            setProducts(prev => prev.map(p => {
              if(p._id === product._id){
                return {
                  ...p,
                  visible: !p.visible
                }
              }
              return p
            }));
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

  /* handle product visibility */
  const handleMakeArchive = (product) => {
    
    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: product.archived ? 'This product get out of all type of access.' 
        : 'This product will get all type of access',
      showCancelButton: true,
      confirmButtonText: product.archived ? 'Yes, archive now' : 'Yes, unarchive now',
      customClass: {
        popup: '!w-[400px]',
        confirmButton: `${product.archived ? '!bg-orange-500 hover:!bg-orange-600' 
          : '!bg-green-500 hover:!bg-green-600'}`
      },
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        try {

          const response = await Axios({
            ...ApiBucket.changeProductStatus,
            data: {
              product_id: product._id,
              visibility: !product.archived
            }
          })

          if(response?.data?.success){
            setProducts(prev => prev.map(p => {
              if(p._id === product._id){
                return {
                  ...p,
                  archived: !p.archived
                }
              }
              return p
            }));
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

  /* handle delete product */
  const handledelete = async(id) => {

    /* Alert({
      icon: 'question',
      title: "Are you sure?",
      text: 'This action cannot revert back',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: 'var(--color-red-500)'
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        dispatch(setLoading(false))
      }
    }) */
   toast.error('Not implimented yet',{position: 'top-center'})

  }

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
    
      {/* page title & add product button */}
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

      {/* search sort filter*/}
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
            icon={<FaSort className='text-md me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-500'
            items={useMemo(() => [
              { id: 'priceltoh', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> price: low to high </span>,
                onClick: () => sortData('price')
              },
              { id: 'pricehtol', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> price: high to low</span>,
                onClick: () => sortData('price','desc')
              },
              { id: 'newfirst', 
                icon: <BsSortDown className='text-xl'/>,
                text: <span className={`capitalize`}> Newest First</span>,
                onClick: () => sortData('createdAt','asc')
              },
              { id: 'oldfirst', 
                icon: <BsSortDownAlt className='text-xl'/>,
                text: <span className={`capitalize`}> Oldest First</span>,
                onClick: () => sortData('createdAt','desc')
              },
            ],[])}
          />

          {/* filter */}
          <DropdownButton
            label='filter'
            icon={<CiFilter className='text-lg me-1' />}
            className=' bg-white border border-gray-300 rounded-xl !text-gray-600'
            items={useMemo(() => [
              { id: 'none',
                icon: <span className='text-xl point-before point-before:bg-gray-300'></span>,
                text: <span className={`capitalize`}> None </span>,
                onClick: () => setFilter({})
              },
              { id: 'featured',
                icon: <span className='text-xl point-before'></span>,
                text: <span className={`capitalize`}> featured </span>,
                onClick: () => setFilter({'featured':true})
              },
              { id: 'active', 
                icon: <span className='text-xl point-before point-before:bg-green-400'></span>,
                text: <span className={`capitalize`}> active </span>,
                onClick: () => setFilter({'status':'active'})
              },
              { id: 'inactive', 
                icon: <span className='text-xl point-before point-before:bg-gray-400'></span>,
                text: <span className={`capitalize`}> inactive </span>,
                onClick: () => setFilter({'status':'inactive'})
              },
              { id: 'outofstock', 
                icon: <span className='text-xl point-before point-before:bg-red-400'></span>,
                text: <span className={`capitalize`}> out of stock </span>,
                onClick: () => setFilter({'stock':0})
              },
              { id: 'archived', 
                icon: <span className='text-xl point-before point-before:bg-yellow-400'></span>,
                text: <span className={`capitalize`}> archived </span>,
                onClick: () => setFilter({'archived':true})
              },
            ],[])}
          />
        </div>
        
      </div>

      {/* content - first div for smooth animaion */}
      <div className="relative flex flex-col w-full bg-white rounded-3xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-300 p-4.5">
          <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_88px] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>status</span>
            <span>visible</span>
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
                    } else {
                      price = product.price;
                      stock = product.stock;
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
                            backgroundColor: product.archived ? '' : '#efffeb',
                            transition: { duration: 0.3 }
                          }}
                          className={`${product.archived ? 'cursor-not-allowed pointer-events-none bg-gray-100 grayscale-100 !opacity-50' : 'bg-white'}`}
                        >

                          <div
                            className={`grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_88px] 
                              items-center w-full px-4 py-2`}
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

                              <PreviewImage src={product?.images[0]?.thumb} alt={product?.name} size="40" zoom="120%"
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
                                <span className='text-[11px] text-gray-400'> 
                                  <span className='me-1'>in</span>
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
                            <div>
                              <span className={`w-fit px-2 py-1 text-xs font-semibold rounded-full capitalize
                                ${statusColors()}`}>
                                {product.archived ? 'archived' : product?.status}
                              </span>
                            </div>

                            {/* visible */}
                            <div className='ps-3'>
                              <ToggleSwitch 
                                size={4}
                                value={product.visible}
                                onChange={() => handleVisibility(product)}
                              />
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
                                    <MenuButton as="div"
                                      className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
                                      border border-gray-300 !text-gray-900 cursor-pointer"
                                    >
                                      <IoMdMore size={20} />
                                    </MenuButton>
                                    <ContextMenu 
                                      open={open}
                                      items={useMemo(() => [
                                        { id: 'view', 
                                          icon: <LuEye className='text-xl'/>,
                                          text: <span className={`capitalize`}> view </span>,
                                          onclick: () => {}
                                        },
                                        { id: 'status', 
                                          icon: product.status === 'active' ? 
                                          <IoMdCheckmarkCircleOutline className='text-xl text-primary-400' />
                                          : <FaRegCircleXmark className='text-xl' />,
                                          text: <span className={`capitalize`}> {product.status} </span>,
                                          tail: <ToggleSwitch 
                                                  size={4}
                                                  value={product.status === 'active'}
                                                  onChange={() => 
                                                    handleStatusChange(product._id, product.status)
                                                  }
                                                />
                                        },
                                        { id: 'archive', 
                                          icon: product.archived ? <MdOutlineArchive className='text-xl'/>
                                            : <MdOutlineUnarchive className='text-xl' />,
                                          text: <span className={`capitalize`}> {
                                            product.archived ? 'unarchive' : 'archive'
                                          } </span>, 
                                          onClick: () => handleMakeArchive(product) 
                                        },
                                        { id: 'delete', 
                                          icon: <HiOutlineTrash className='text-xl' />,
                                          text: <span className={`capitalize`}> delete </span>,
                                          onClick: () => handledelete(product._id) ,
                                          itemClass: 'bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100'
                                        }
                                      ],[])}
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
                                  <div className="flex gap-2 items-center relative ms-2">
                                    {variant.image?.thumb ? 
                                      (<PreviewImage src={variant.image?.thumb} alt={product?.name} zoom="80%"
                                      thumbClass="rounded-xl border border-gray-300 w-10 h-10"
                                      />)
                                      :
                                      (<ImagePlaceHolder
                                        size={18}
                                        className="rounded-xl border border-gray-300 bg-white text-gray-500/60 w-10 h-10"
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