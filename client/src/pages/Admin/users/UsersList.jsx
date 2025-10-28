import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import place_holder from "../../../assets/user_placeholder.jpg";
import SkeltoList from "../../../components/ui/SkeltoList";
import clsx from "clsx";
import { format } from "date-fns";
import { TbUserEdit } from "react-icons/tb";
import { Menu, MenuButton } from "@headlessui/react";
import { IoMdMore } from "react-icons/io";
import ContextMenu from "../../../components/ui/ContextMenu";
import { LuEye } from "react-icons/lu";
import { useOutletContext } from "react-router";
import AdminPagination from "../../../components/ui/AdminPagination";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi2";
import Alert from "../../../components/ui/Alert";
import { useblockUserMutation, useDeleteUserMutation } from "../../../services/MutationHooks";
import AxiosToast from "../../../utils/AxiosToast";

function UsersList() {
  
	const { list, searchQuery, filter, gridCols } = useOutletContext();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		setUsers(list);
	}, [list]);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(users?.length / itemsPerPage);

	const paginatedUsers = users?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

  const blockMutation = useblockUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

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

	return (
		<motion.ul 
      layoutRoot
			className="text-gray-700"
		>
			{paginatedUsers?.length > 0 ? (
				<motion.li
          layout
					key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
					className={clsx(
						"divide-y divide-theme-divider overflow-hidden",
						users?.length <= itemsPerPage && "rounded-b-3xl"
					)}
				>
					<AnimatePresence>
						{paginatedUsers.map((user, i) => {

							const statusColors = () => {
								switch (user.status) {
									case "active":
										return "bg-green-500/40 text-teal-800";
									case "blocked":
										return "bg-red-100 text-red-500";
									default:
										return "bg-gray-200 text-gray-400";
								}
							};

							const lastLogin = user?.last_login
								? format(new Date(user?.last_login), "dd/MM/yy, hh:mm a")
										.replace("AM", "am")
										.replace("PM", "pm")
								: null;

							const join = format(user?.createdAt, "dd-MMM-yyyy")
								.replace("AM", "am")
								.replace("PM", "pm");

							const { orders, pendings, cancelled } = user?.orderDetails || {};

							return (
								<motion.div
									layout
									key={user._id}
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={rowVariants(i)}
									whileHover={{
										backgroundColor: "#efffeb",
										transition: { duration: 0.3 },
									}}
									className="bg-white"
								>
									<div
										className={`grid ${gridCols} 
                    items-center w-full px-4 py-2`}
									>
										{/* Checkbox */}
										<div>
											<input type="checkbox" />
										</div>

										{/* User Info */}
										<div className="flex gap-2 items-center">
											<div className="w-12 h-12 rounded-full overflow-hidden">
												<img
													src={user?.avatar?.url || place_holder}
													alt="avatar"
													className="object-cover w-full h-full"
												/>
											</div>
											<div className="inline-flex flex-col">
												<p className="capitalize">{user?.username}</p>
												<p className="text-xs text-gray-500">Joined: {join}</p>

												<p className="text-xs text-gray-500/80">
													<span>{lastLogin ? "Logined: " : "Not logined"}</span>
													<span>{lastLogin}</span>
												</p>
											</div>
										</div>

										{/* Roles */}
										<div className="flex flex-col text-[13px]">
											{user?.roles?.map((role, n) => (
												<span key={n} className="capitalize">
													{role}
												</span>
											))}
										</div>

										{/* Contact */}
										<div>
											<p>
												{user?.mobile || (
													<span className="text-gray-400">Not added</span>
												)}
											</p>
											<p className="text-xs text-gray-500">{user?.email}</p>
										</div>

										{/* orders */}
										<div className="text-[13px]">
											{orders > 0 ? (
												<>
													<p>
														<span className="text-gray-500">Total: </span>
														<span className="font-semibold">{orders}</span>
													</p>
													{pendings > 0 && (
														<p>
															<span className="text-gray-500">Pendings: </span>
															<span className="font-semibold">{pendings}</span>
														</p>
													)}
													{cancelled > 0 && (
														<p>
															<span className="text-gray-500">Cancelled: </span>
															<span className="font-semibold">{cancelled}</span>
														</p>
													)}
												</>
											) : (
												<span className="text-gray-400">No orders made</span>
											)}
										</div>

										{/* reviews */}
										<div className="text-center">{user?.reviews}</div>

										{/* Status */}
										<div className="text-center">
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                        ${statusColors()}`}
											>
												{user.status}
											</span>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-center space-x-1 z-50">
											<div
												onClick={() =>
													navigate("/admin/users/edit-user", {
														state: { user },
													})
												}
												className="p-2 rounded-xl bg-blue-100/50 hover:bg-sky-300 border 
                        border-primary-300/60 hover:scale-103 transition-all duration-300 cursor-pointer"
											>
												<TbUserEdit size={20} />
											</div>

											<Menu as="div" className="relative">
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
																{
																	id: "view user",
																	icon: <LuEye className="text-xl" />,
																	text: (
																		<span className={`capitalize`}>
																			{" "}
																			view user{" "}
																		</span>
																	),
																	onClick: () =>
																		navigate("/admin/users/view-user", {
																			state: { user: user?._id },
																		}),
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
							);
						})}
					</AnimatePresence>
				</motion.li>
			) : !searchQuery?.trim() && !Object.keys(filter)?.length ? (
				<SkeltoList />
			) : (
				<motion.li
					key="not-found"
					layout
					initial="hidden"
					animate="visible"
					exit="exit"
					variants={rowVariants(paginatedUsers?.length)}
					className="flex items-center"
				>
					<span
						className="w-full h-full text-center py-6 text-primary-400
                text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
					>
						No users found
					</span>
				</motion.li>
			)}

			{/* Pagination */}
			{users?.length > itemsPerPage && (
				<motion.li layout key="pagination" className="flex justify-end px-4 py-5">
					<AdminPagination
						currentPage={currentPage}
						totalPages={totalPages}
						setCurrentPage={setCurrentPage}
					/>
				</motion.li>
			)}
		</motion.ul>
	);
}

export default UsersList;
