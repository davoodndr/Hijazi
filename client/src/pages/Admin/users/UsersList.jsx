import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuEye, LuSearch, LuUserRoundPlus } from "react-icons/lu";
import place_holder from '../../../assets/user_placeholder.jpg'
import { TbUserEdit } from "react-icons/tb";
import { HiHome, HiOutlineTrash } from "react-icons/hi2";
import { IoIosArrowForward, IoMdMore } from "react-icons/io";
import ContextMenu from '../../../components/ui/ContextMenu';
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import AdminPagination from '../../../components/ui/AdminPagination';
import { useNavigate } from 'react-router';
import AxiosToast from '../../../utils/AxiosToast';
import Alert from '../../../components/ui/Alert'
import { Menu, MenuButton } from '@headlessui/react';
import DropdownButton from '../../../components/ui/DropdownButton';
import { FaCheck, FaSort } from 'react-icons/fa6';
import { BsFillMenuButtonFill, BsSortDown, BsSortDownAlt } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import { containerVariants, rowVariants } from '../../../utils/Anim';
import { format } from 'date-fns'
import SearchBar from '../../../components/ui/Searchbar';
import SkeltoList from '../../../components/ui/SkeltoList';
import { useSelector } from 'react-redux';
import { useblockUserMutation, useDeleteUserMutation } from '../../../services/MutationHooks';
import { filterData } from '../../../utils/Utils';
import clsx from 'clsx';

const UsersList = () => {

  const navigate = useNavigate();
  const blockMutation = useblockUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const [users, setUsers] = useState([]);
  const { users: usersList } = useSelector(state => state.user);

  /* initial data loader */
  useEffect(() => {
    const sorted = [...usersList]?.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    setUsers(sorted)
  },[usersList])

  /* search filter */
  const [searchQuery, setSearchQuery] = useState(null);
  const [filter, setFilter] = useState({});
  const fields = ['username','email','roles','status','mobile'];
  const filterMenus = [
    {id: 'none', value: {}, color: '--color-gray-200'},
    {id: 'user', value: {'roles': 'user'}, color: '--color-amber-400'},
    {id: 'admin', value: {'roles': 'admin'}, color: '--color-blue-400'},
    {id: 'active', value: {'status': 'active'}, color: '--color-green-400'},
    {id: 'inactive', value: {'status': 'inactive'}, color: '--color-gray-400'},
    {id: 'blocked', value: {'status': 'blocked'}, color: '--color-red-400'},
  ]

  const filteredUsers = filterData(searchQuery, filter, users, fields)

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
      customClass: {
        confirmButton: mode === 'block' ? '!bg-red-500' : '!bg-green-500'
      }
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        
        const response = await blockMutation.mutateAsync({user_id: user?._id, status: mode});

        if(response?.data?.success){
          const newStatus = response?.data?.updates;

          const updatedUsers = users?.map(u => u._id === user?._id ? {...u, status: newStatus} : u)

          setUsers(updatedUsers)
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
      customClass: {
        confirmButton: '!bg-red-500'
      }
    }).then(async result => {
      
      if(result.isConfirmed){

        const response = await deleteUserMutation.mutateAsync({ user_id: user?._id })

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

  const paginatedUsers = filteredUsers?.slice(
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
      <div className='flex items-center gap-2 mb-5 py-2 border-y border-theme-divider'>
        <HiHome size={20} />
        <IoIosArrowForward size={13} />
        <div className='inline-flex items-center text-sm gap-2'>
          <span>Users</span>
        </div>
      </div>

      {/* search */}
      <div className="flex items-center justify-between mb-5">
        
        <SearchBar
          onSearch={(value) => setSearchQuery(value)}
          placeholder='Search users'
          className='w-3/10'
          inputClass="!pl-10 rounded-xl bg-white peer"
          iconClass='left-3 smooth peer-focus:text-primary-400'
        />

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
            label={ Object?.values(filter)[0] || 'filter'}
            icon={<CiFilter className='text-lg me-1' />}
            style={{ 
              '--dynamic': `var(${
                filterMenus?.find(el => Object.values(el?.value)[0] === Object.values(filter)[0]).color
              })` 
            }}
            className={clsx('bg-white border rounded-xl',
              Object?.values(filter)[0] ? 'text-(--dynamic) border-(--dynamic)' : 'border-gray-300 text-gray-500'
            )}
            items={
              filterMenus?.map(menu => {
                const key = Object.keys(menu?.value)[0];
                const value = menu?.value[key];
                const isSelected = menu?.id === 'none' ? 
                  !Object.keys(filter)?.length 
                  :
                  filter[key] === value

                return {
                  id: menu?.id, 
                  icon: <span 
                          style={{ '--point-color': `var(${menu?.color})` }} 
                          className={`text-xl point-before point-before:bg-(--point-color)`}>
                        </span>,
                  text: <span className={`capitalize`}> {menu?.id} </span>,
                  tail: isSelected ? (<span><FaCheck /></span>) : null,
                  onClick: () => setFilter(menu?.value)
                }
              })
            }
          />
        </div>
        
      </div>

      <div className="relative flex flex-col w-full bg-white rounded-3xl shade border border-theme-divider">
        {/* Header */}
        <div className="text-gray-400 uppercase font-semibold tracking-wider
          border-b border-theme-divider px-4.5 py-3.5 bg-gray-50 rounded-t-3xl">
          <div className="grid grid-cols-[30px_1.75fr_0.75fr_1fr_0.75fr_0.5fr_0.75fr_0.75fr] items-center w-full">
            <span><input type="checkbox" /></span>
            <span>User</span>
            <span>Roles</span>
            <span>Contact</span>
            <span>Orders</span>
            <span className='text-center'>Reviews</span>
            <span className='text-center'>Status</span>
            <span className="flex items-center justify-center">
              <BsFillMenuButtonFill className='text-xl' />
            </span>
          </div>
        </div>

        <motion.ul 
          layout
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col w-full h-full text-sm text-gray-700"
        >

          {paginatedUsers?.length > 0 ? (

            <motion.li
              key="list-container"
              layout 
              className="divide-y divide-theme-divider"
              >
              <AnimatePresence>
                {paginatedUsers.map((user) => {

                    const statusColors = () => {
                      switch(user.status){
                        case 'active': return 'bg-green-500/40 text-teal-800'
                        case 'blocked': return 'bg-red-100 text-red-500'
                        default : return 'bg-gray-200 text-gray-400'
                      }
                    }

                    const lastLogin = user?.last_login ? 
                      format(new Date(user?.last_login), 'dd/MM/yy, hh:mm a')
                        .replace('AM','am')
                        .replace('PM','pm') : null;
                    
                    const { orders, pendings, cancelled } = user?.orderDetails;

                    return(
                      
                      <motion.div
                        layout
                        key={user._id}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={rowVariants}
                        whileHover={{
                          backgroundColor: '#efffeb',
                          transition: { duration: 0.3 }
                        }}
                      >
                    
                        <div className="grid grid-cols-[30px_1.75fr_0.75fr_1fr_0.75fr_0.5fr_0.75fr_0.75fr] 
                          items-center w-full px-4 py-2 bg-white"
                        >
                          {/* Checkbox */}
                          <div><input type="checkbox" /></div>

                          {/* User Info */}
                          <div className="flex gap-2 items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img src={user?.avatar?.url || place_holder} alt="avatar" className="object-cover w-full h-full" />
                            </div>
                            <div className="inline-flex flex-col">
                              <p className="capitalize">{user?.username}</p>
                              <p className="text-xs text-gray-500">{user?.email}</p>
                              <p className="text-xs text-gray-400">
                                <span>{lastLogin ? 'Logined: ' : 'Not logined'}</span>
                                <span>{lastLogin}</span>
                              </p>
                            </div>
                          </div>

                          {/* Roles */}
                          <div className="flex flex-col text-[13px]">
                            {user?.roles.map((role, n) => (
                              <span key={n} className="capitalize">{role}</span>
                            ))}
                          </div>

                          {/* Contact */}
                          <div>{user?.mobile || <span className="text-gray-400">Not added</span>}</div>

                          {/* orders */}
                          <div className='text-[13px]'>
                            {orders > 0 ?
                              (
                                <>
                                  <p>
                                    <span className='text-gray-500'>Total: </span>
                                    <span className='font-semibold'>{orders}</span>
                                  </p>
                                  {pendings > 0 &&
                                    (
                                      <p>
                                        <span className='text-gray-500'>Pendings: </span>
                                        <span className='font-semibold'>{pendings}</span>
                                      </p>
                                    )
                                  }
                                  {cancelled > 0 &&
                                    (
                                      <p>
                                        <span className='text-gray-500'>Cancelled: </span>
                                        <span className='font-semibold'>{cancelled}</span>
                                      </p>
                                    )
                                  }
                                </>
                              )
                              :
                              (
                                <span className='text-gray-400'>No orders made</span>
                              )
                            }
                          </div>

                          {/* reviews */}
                          <div className='text-center'>{user?.reviews}</div>

                          {/* Status */}
                          <div className='text-center'>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                              ${statusColors()}`}>
                              {user.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-center space-x-1 z-50">
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
                                        onClick: () => 
                                          navigate('/admin/users/view-user',
                                          { state: 
                                            { user: user?._id }
                                          }
                                        ) 
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
                  })
                }
              </AnimatePresence>
            </motion.li>

          ) : (
            !searchQuery?.trim() && !Object.keys(filter)?.length ? (
              <SkeltoList />
            ):(
              
                <motion.li
                  key="not-found"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={rowVariants}
                  className="flex items-center"
                >
                  <span
                    className="w-full h-full text-center py-6 text-primary-400
                    text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
                  >No users found</span>
                </motion.li>
              
            )
          )}

          {/* Pagination */}
          {paginatedUsers?.length > 0 && 
            <motion.li
              layout
              key="pagination"
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