import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuEye, LuSearch, LuUserRoundPlus } from "react-icons/lu";
import ApiBucket from '../../../services/ApiBucket';
import { Axios } from '../../../utils/AxiosSetup';
import place_holder from '../../../assets/user_placeholder.jpg'
import { TbUserEdit } from "react-icons/tb";
import { HiHome, HiOutlineTrash } from "react-icons/hi2";
import { IoIosArrowForward, IoMdMore } from "react-icons/io";
import ContextMenu from '../../../components/ui/ContextMenu';
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import AdminPagination from '../../../components/ui/AdminPagination';
import { useNavigate } from 'react-router';
import { blockUserAction, deleteUserAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import Alert from '../../../components/ui/Alert'
import { Menu, MenuButton } from '@headlessui/react';
import Skeleton from '../../../components/ui/Skeleton';
import DropdownButton from '../../../components/ui/DropdownButton';
import { FaSort } from 'react-icons/fa6';
import { BsSortDown, BsSortDownAlt } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import { containerVariants, rowVariants } from '../../../utils/Anim';

const UsersList = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* initial data loader */
  useEffect(() => {
    fetchUsers()
  },[])

  const fetchUsers = async() => {
    setLoading(true)
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
    }finally{
      setLoading(false)
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

  /* search filter */
  const filteredUsers = useMemo(() => {
    return users.filter(user =>{

      const fields = ['username','email','role','status','mobile']

      return fields.some(field => {

        if(user[field]){
          return user[field].includes(searchQuery)
        }
        return false

      })

    });

  },[searchQuery, users])

  /* handling action buttons */
  const handleUserBlock = (user) => {

    const mode = user?.status === 'blocked' ? '' : 'block'
    Alert({
      title: 'Are you sure?',
      text: mode === 'block' ? 'User cannot access his account' : 'User can access his account',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel',
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        
        const response = await blockUserAction(user?._id, mode);

        if(response.data.success){

          const updatedUser = response.data.user;
          setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u))
          AxiosToast(response, false);

        }else{
          AxiosToast(response)
        }
      }
    });

  }
  const handleUserDelete = (user) => {

    Alert({
      icon: 'question',
      title: "Are you sure?",
      text: 'This action cannot revert back',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: 'var(--color-red-500)'
    }).then(async result => {
      
      if(result.isConfirmed){

        const response = await deleteUserAction('users', user?._id);

        if(response?.data?.success){
          setUsers(prev => prev.filter(u => u._id !== user?._id));
          AxiosToast(response, false);
        }else{
          AxiosToast(response);
        }
      }
    })

  }

  /* paingation logic */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className='min-h-full h-fit flex flex-col p-6'>

      {/* page title & add user button */}
      <div className="mb-5 flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className='text-xl'>Users Management</h3>
          <span className='sub-title'>Add, edit and delete users</span>
        </div>
        <button 
          onClick={() => navigate('/admin/users/add-user')}
          className='px-4! inline-flex items-center gap-2 text-white'>
          <LuUserRoundPlus size={20} />
          <span>Add User</span>
        </button>
      </div>
      
      {/* beadcrumps */}
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-gray-200'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Users</span>
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

      <div className="relative flex flex-col w-full bg-white rounded-3xl shade border border-gray-200">
        {/* Header */}
        <div className="text-gray-400 uppercase font-semibold tracking-wider
          border-b border-gray-300 px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>User</span>
            <span>Roles</span>
            <span>Contact</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>
        </div>

        <motion.ul 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col w-full h-full text-sm text-gray-700">

            {/* Rows */}
            {loading || paginatedUsers.length <= 0 ? 
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

              <motion.li layout className="divide-y divide-gray-300">

                <AnimatePresence exitBeforeEnter>
                  {/* paginatedUsers.length > 0 ? */ 
                    (paginatedUsers.map((user, index) => {

                      const statusColors = () => {
                        switch(user.status){
                          case 'active': return 'bg-green-500/40 text-teal-800'
                          case 'blocked': return 'bg-red-100 text-red-500'
                          default : return 'bg-gray-200 text-gray-400'
                        }
                      }

                      return(
                        
                        <motion.div
                          layout
                          key={user._id}
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
                      
                          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] 
                            items-center w-full px-4 py-2 bg-white"
                          >
                            {/* Checkbox */}
                            <div><input type="checkbox" /></div>

                            {/* User Info */}
                            <div className="flex gap-2 items-center">
                              <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img src={user?.avatar || place_holder} alt="avatar" className="object-cover w-full h-full" />
                              </div>
                              <div className="inline-flex flex-col">
                                <p className="capitalize">{user?.username}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                              </div>
                            </div>

                            {/* Roles */}
                            <div className="flex flex-col text-[13px]">
                              {user.roles.map((role, n) => (
                                <span key={n} className="capitalize">{role}</span>
                              ))}
                            </div>

                            {/* Contact */}
                            <div>{user.mobile || <span className="text-gray-400">Not added</span>}</div>

                            {/* Status */}
                            <div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                                ${statusColors()}`}>
                                {user.status}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3 z-50">
                              <div 
                                onClick={() => navigate('/admin/users/edit-user',{state: {user}})}
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
                                        { id: 'view user', 
                                          icon: <LuEye className='text-xl' />,
                                          text: <span className={`capitalize`}> view user </span>,
                                          onClick: () => navigate('/admin/users/view-user',{state: user}) 
                                        },
                                        { id: 'block', 
                                          icon: user?.status === 'blocked' ? 
                                          <CgUnblock className='text-xl' /> : 
                                          <MdBlock className='text-xl' />,
                                          text: <span className={`capitalize`}> 
                                            {user?.status === 'blocked' ? 'unblock' : 'block'} 
                                          </span>,
                                          onClick: ()=> handleUserBlock(user) 
                                        },
                                        
                                        { id: 'delete', 
                                          icon: <HiOutlineTrash className='text-xl' />,
                                          text: <span className={`capitalize`}> delete </span>,
                                          onClick: () => handleUserDelete(user) ,
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
                      )
                    }))
                  /* :
                  (<div className="flex items-center justify-center h-20 text-primary-400
                    text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl">
                    No Users
                  </div> ) */
                  }

                </AnimatePresence>

              </motion.li>
            }

          

          {/* Pagination */}
          {paginatedUsers.length > 0 && <motion.li
            layout
            key="pagination"
            custom={filteredUsers.length + 1}
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
      </div>
    </section>
  )
}

export default UsersList