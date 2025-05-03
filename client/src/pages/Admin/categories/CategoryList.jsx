import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { HiHome, HiOutlineTrash } from 'react-icons/hi2';
import { IoIosArrowForward, IoMdMore } from 'react-icons/io';
import { LuSearch } from 'react-icons/lu';
import { TbCategoryPlus } from "react-icons/tb";
import category_sample from '../../../assets/12.jpg'
import ContextMenu from '../../../components/ui/ContextMenu';
import { Menu, MenuButton } from '@headlessui/react'
import { MdOutlineEdit } from 'react-icons/md';
import Alert from '../../../components/ui/Alert';
import AddCategoryModal from '../../../components/admin/categories/AddCategoryModal';

const CategoryList = () => {

  const [list, setList] = useState([]);

  /* initial data loader */
    /* useEffect(() => {
      fetchUsers()
    },[])
  
    const fetchUsers = useMemo(() => {
      return async() => {
      
        try {
          
          const response = await Axios({
            ...ApiBucket.getUsers
          })
    
          if(response.data.success){
            
            const sorted = response.data.users.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
        
            setUsers(sorted);
          }
    
        } catch (error) {
          console.log(error.response.data.message)
        }
        
      }
    },[]); */
  
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
    /* const filteredUsers = useMemo(() => {
      return users.filter(user =>{
  
        const fields = ['username','email','role','status','mobile']
  
        return fields.some(field => {
  
          if(user[field]){
            return user[field].includes(searchQuery)
          }
          return false
  
        })
  
      });
  
    },[searchQuery, users]) */
  

    /* add category action */
    const [isAddOpen, setIsAddOpen] = useState(false);

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

  return (
    <section className='min-h-full h-fit flex flex-col p-6 bg-gray-100'>

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
        className="w-full grid grid-cols-5 gap-6">
        {/* Header */}
        <li className="border border-gray-300 bg-white p-3 rounded-4xl shadow-md/4">

          
          <div className="flex rounded-3xl overflow-hidden">
            <img src={category_sample} alt="" />
          </div>
          <div className="p-1 flex flex-col justify-end relative">

            <Menu as="div" className="absolute right-1 top-2 overflow-hidden w-2 inline-flex justify-center">
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

            <span className='text-sm font-semibold'>Scarf Cap</span>
            <span className='text-xs'>Scarf Cap</span>
          </div>
        </li>
      </motion.ul>

      <AddCategoryModal
        onCreate={(doc) => {
          setList(prev => ([...prev, doc]));
          setIsAddOpen(false);
        }}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

    </section>
  )
}

export default CategoryList