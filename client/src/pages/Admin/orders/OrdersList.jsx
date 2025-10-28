import React, { useEffect, useMemo, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import AdminPagination from "../../../components/ui/AdminPagination";
import { format } from "date-fns";
import clsx from "clsx";
import { Menu, MenuButton } from "@headlessui/react";
import ContextMenu from "../../../components/ui/ContextMenu";
import { useNavigate, useOutletContext } from "react-router";
import SkeltoList from "../../../components/ui/SkeltoList";

function OrdersList() {

	const navigate = useNavigate();
	const { list, searchQuery, filter, gridCols } = useOutletContext();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		setOrders(list);
	}, [list]);

	/* paingation logic */
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(orders?.length / itemsPerPage);

	const paginatedOrders = orders?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleViewOrderClick = (order) => {
		navigate(`view-order/${order?.order_no}`, {
			state: { order, orders },
		});
	};

	return (
		<motion.ul
      layoutRoot
			className="text-gray-700"
		>
			{/* Rows */}
			{paginatedOrders?.length > 0 ? (
				<motion.li
					layout
					key={`${currentPage}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
					className={clsx(
						"divide-y divide-theme-divider overflow-hidden",
						orders?.length <= itemsPerPage && "rounded-b-3xl"
					)}
				>
					<AnimatePresence exitBeforeEnter>
						{paginatedOrders?.map((order, i) => {
							const title =
								order?.itemsCount > 1
									? `${order?.itemsCount} items includes`
									: order?.name;

							const isPaid = order?.isPaid ? "Paid" : "Unpaid";
							const payment =
								order?.paymentMethod === "cod"
									? "cash on delivery"
									: order?.paymentMethod;

							return (
								<motion.div
                  layout
									key={order._id}
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
										className={`grid ${gridCols} items-center w-full px-4 py-2`}
									>
										{/* Checkbox */}
										<div>
											<input type="checkbox" />
										</div>

										{/* product Info & thumbnail */}
										<div className="flex gap-2 items-center relative">
											<div className="inline-flex">
												<img
													src={order?.image}
													className="rounded-xl border border-gray-300 w-12 h-12"
													alt=""
												/>
											</div>

											<div className="inline-flex flex-col capitalize">
												<p className="font-semibold">{title}</p>
												<p className="text-gray-500/90 text-xs">
													<span>No: </span>
													<span>{order?.order_no} </span>
												</p>
											</div>
										</div>

										{/* customer name */}
										<div className="capitalize flex flex-col text-xs">
											<span className="font-semibold">
												{order?.billingAddress?.name}
											</span>
											<span className="text-gray-500/90">
												{order?.billingAddress?.city}
											</span>
										</div>

										{/* order date */}
										<div className="capitalize flex flex-col">
											<span className="text-xs font-semibold">
												{format(new Date(order?.createdAt), "dd-MM-yyy")}
											</span>
											<span className="text-xs text-gray-400">
												{format(new Date(order?.createdAt), "hh:mm a")}
											</span>
										</div>

										{/* amount */}
										<div className="flex">
											<div className="capitalize flex flex-col items-end w-[60%]">
												<span className="price-before font-semibold inline-block">
													{order?.cancelledTotal || order?.totalPrice}
												</span>
												<span
													className={clsx(
														"text-xs inline-block",
														order?.isPaid
															? " text-primary-400/70"
															: " text-red-400/70"
													)}
												>
													{isPaid}
												</span>
											</div>
										</div>

										{/* payment method */}
										<div className="capitalize flex flex-col">
											<span className="text-xs font-semibold">{payment}</span>
											{order?.paymentMethod === "razor-pay" && (
												<span className="text-xs text-gray-400">
													{order?.paymentResult?.razorpay_payment_id}
												</span>
											)}
										</div>

										{/* status */}
										<div className="capitalize flex items-center justify-center">
											<span
												className={clsx(
													"badge h-fit",
													order?.status === "pending" &&
														"bg-amber-100 text-amber-500",
													order?.status === "processing" &&
														"bg-gray-100 text-gray-500",
													order?.status === "shipped" &&
														"bg-violet-100 text-violet-500",
													order?.status === "delivered" &&
														"bg-green-100 text-primary-400",
													order?.status === "cancelled" &&
														"bg-red-100 text-red-500"
												)}
											>
												{order?.status}
											</span>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-center gap-3 z-50">
											<Menu as="div" className="relative">
												{({ open }) => (
													<>
														<MenuButton
															as="div"
															className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
                                  border border-gray-300 !text-gray-900 cursor-pointer"
														>
															<IoMdMore size={20} />
														</MenuButton>
														<ContextMenu
															open={open}
															items={useMemo(
																() => [
																	{
																		id: "view",
																		icon: <LuEye className="text-xl" />,
																		text: (
																			<span className={`capitalize`}>
																				view order
																			</span>
																		),
																		onClick: () => handleViewOrderClick(order),
																	},
																	{
																		id: "shipped",
																		icon: <LuEye className="text-xl" />,
																		text: (
																			<span className={`capitalize`}>
																				shipped
																			</span>
																		),
																		onClick: () => {},
																	},
																	{
																		id: "delivered",
																		icon: <LuEye className="text-xl" />,
																		text: (
																			<span className={`capitalize`}>
																				delivered
																			</span>
																		),
																		onClick: () => {},
																	},
																],
																[]
															)}
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
					variants={rowVariants(paginatedOrders?.length)}
					className="flex items-center"
				>
					<span
						className="w-full h-full text-center py-6 text-primary-400
                    text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
					>
						No orders found
					</span>
				</motion.li>
			)}

			{/* Pagination */}
			{orders?.length > itemsPerPage && (
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

export default OrdersList;
