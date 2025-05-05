import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuSearch, LuUserRoundPlus } from "react-icons/lu";
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
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router';
import { blockUserAction, deleteUserAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import Alert from '../../../components/ui/Alert'
import { Menu, MenuButton } from '@headlessui/react';
import Skeleton from '../../../components/ui/Skeleton';

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
    <section className='min-h-full h-fit flex flex-col p-6 bg-gray-100'>

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

        <div>
          <span>Filter</span>
        </div>
        
      </div>

      <div className="flex w-full relative">
        <motion.ul 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-sm text-gray-700 bg-white rounded-3xl
            shadow-lg border border-gray-200">
          {/* Header */}
          <li
            className="text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-300 p-4.5">
            <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2">
              <span><input type="checkbox" /></span>
              <span>User</span>
              <span>Roles</span>
              <span>Contact</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>
          </li>

            {/* Rows */}
            {loading ? 
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
                  {paginatedUsers.map((user, index) => {

                    const statusColors = () => {
                      switch(user.status){
                        case 'active': return 'bg-green-100 text-teal-600'
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
                        className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2 px-4 py-2 bg-white">
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
                                    { label: 'view user', icon: IoEyeOutline, onClick: () => navigate('/admin/users/view-user',{state: user}) },
                                    { label: user?.status === 'blocked' ? 'unblock' : 'block', 
                                      icon: user?.status === 'blocked' ? CgUnblock : MdBlock, onClick: ()=> handleUserBlock(user) },
                                    { label: 'delete', icon: HiOutlineTrash, onClick: () => handleUserDelete(user) }
                                  ]}
                                />
                              </>
                            )}
                            
                          </Menu>
                          
                        </div>
                      </motion.div>
                        
                    )
                  })}
                  </AnimatePresence>
                </li>
              }

          

          {/* Pagination */}
          {paginatedUsers && <li
            key="pagination"
            custom={filteredUsers.length + 1}
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

export default UsersList