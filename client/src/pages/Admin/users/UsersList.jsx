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
import { blockUserAction } from '../../../services/ApiActions';
import AxiosToast from '../../../utils/AxiosToast';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UsersList = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  

  /* logic for displaying popup menu on row items */
  const iconRef = useRef({});
  const [menu, setMenu] = useState(null);

  const getUserRef = (userId)=> {
    if(!iconRef.current[userId]){
      iconRef.current[userId] = React.createRef();
    }
    return iconRef.current[userId];
  }

  /* initial data loader */
  useEffect(() => {
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
  },[]);

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

  /* handling action buttons */
  const handleUserBlock = (user) => {
    const mode = user?.status === 'blocked' ? '' : 'block'

    MySwal.fire({
      title: 'Are you sure?',
      text: mode === 'block' ? 'User cannot access his account' : 'User can access his account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
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
  const handleUserDelete = (user_id) => {
    
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
    <section className='h-fit flex flex-col p-6 bg-gray-100'>

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
          <span>Add New</span>
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
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder='Search for products'
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
        className="w-full text-sm text-gray-700 bg-white rounded-3xl overflow-hidden
          shadow-lg border border-gray-200 divide-y divide-gray-300">
        {/* Header */}
        <li className="bg-white text-gray-500 uppercase font-semibold tracking-wider p-4.5">
          <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2">
            <span><input type="checkbox" /></span>
            <span>User</span>
            <span>Roles</span>
            <span>Contact</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>
        </li>

        <AnimatePresence>

        {/* Rows */}
        {paginatedUsers.map((user, index) => {

          const ref = getUserRef(user._id)

          const statusColors = () => {
            switch(user.status){
              case 'active': return 'bg-green-100 text-teal-600'
              case 'blocked': return 'bg-red-100 text-red-500'
              default : return 'bg-gray-200 text-gray-400'
            }
          }

          return(
          
            <motion.li
              layout
              key={user._id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="bg-white hover:bg-primary-25 transition-all duration-300 px-4 py-2"
              >
              <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] items-center w-full gap-2">
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
                <div className="flex items-center justify-center gap-3">
                  <div 
                    onClick={() => navigate('/admin/users/edit-user',{state: {user}})}
                    className="p-2 rounded-xl bg-blue-100/50 hover:bg-sky-300 border border-primary-300/60 hover:scale-103 transition-all duration-300 cursor-pointer">
                    <TbUserEdit size={20} />
                  </div>

                  <div
                    ref={ref}
                    onMouseEnter={() => setMenu(user._id)}
                    onMouseLeave={() => setMenu(null)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-white hover:scale-103 
                    border border-gray-300 transition-all duration-300 cursor-pointer relative">
                    <IoMdMore size={20} />
                    <ContextMenu
                      iconRef={ref}
                      isToggeled={menu === user._id}
                      onClose={() => setMenu(null)}
                      items={[
                        { label: 'view user', icon: IoEyeOutline, onClick: () => navigate('/admin/users/view-user',{state: user}) },
                        { label: user?.status === 'blocked' ? 'unblock' : 'block', 
                          icon: user?.status === 'blocked' ? CgUnblock : MdBlock, onClick: ()=> handleUserBlock(user) },
                        { label: 'delete', icon: HiOutlineTrash, onClick: handleUserDelete(user._id) }
                      ]} 
                      />
                  </div>
                </div>
              </div>
              
            </motion.li>
            
          )
        })}

        </AnimatePresence>

        {/* Pagination */}
        {paginatedUsers && <motion.li
          key="pagination"
          custom={filteredUsers.length + 1}
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

    </section>
  )
}

export default UsersList