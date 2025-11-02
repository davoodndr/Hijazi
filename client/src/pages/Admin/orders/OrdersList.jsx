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
import SearchFilterComponent from "../pageComponents/SearchFilterComponent";
import TableHeaderComponent from "../pageComponents/TableHeaderComponent";
import Alert from '../../../components/ui/Alert'
import { capitalize, tailwindToRgba } from "../../../utils/Utils";
import { useOrderStatusMutation } from "../../../services/MutationHooks";
import { useDispatch } from "react-redux";
import { setLoading } from '../../../store/slices/CommonSlices'
import { updateOrder } from "../../../store/slices/OrderSlice";
import AxiosToast from "../../../utils/AxiosToast";
import { FaHandHoldingHand } from "react-icons/fa6";
import { ordersColorMap, orderStatusColors, orderStatusList } from "../../../constants/strings";

function OrdersList() {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data } = useOutletContext();
	const statusList = orderStatusList;
	const statusColors = orderStatusColors;
	const colorMap = ordersColorMap;

	/* filter */
	const [searchQuery, setSearchQuery] = useState(null);
	const [filter, setFilter] = useState({});
	const [filteredData, setFilteredData] = useState([]);
	const handleOnFilter = (filtered) => {
		setFilteredData(filtered?.list)
		setFilter(filtered?.filter)
	}

	/* sort */
	const [sortedData, setSortedData] = useState([]);

	const handleOnSort = (sorted) => {
		setSortedData(sorted?.list);
	}

	/* paingation logic */
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

	const paginatedOrders = sortedData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/* order list actions */
	const orderStatusMutation = useOrderStatusMutation();

	const handleSatusChange = (order, statusVal, colorVar) => {

		const status = statusVal === 'out-for-del' ? 'Out for delivery' : statusVal.replace(/[-]/g,' ');

		const colorMap = {
			'--color-gray-400' : { bg:'bg-gray-400!', text: 'text-gray-400!', border: 'border-gray-400!' },
			'--color-sky-400' : { bg:'bg-sky-400!', text: 'text-sky-400!', border: 'border-sky-400!' },
			'--color-amber-400' : { bg:'bg-amber-400!', text: 'text-amber-400!', border: 'border-amber-400!' },
			'--color-pink-400' : { bg:'bg-pink-400!', text: 'text-pink-400!', border: 'border-pink-400!' },
			'--color-green-500' : { bg:'bg-green-500!', text: 'text-green-500!', border: 'border-green-500!' },
			'--color-black': { bg:'bg-black!', text: 'text-black!', border: 'border-black!' },
			'--color-red-500' : { bg:'bg-red-500!', text: 'text-red-600!', border: 'border-red-500!' },
			'--color-red-400' : { bg:'bg-red-400!', text: 'text-red-400!', border: 'border-red-400!' },
			'--color-violet-500' : { bg:'bg-violet-500!', text: 'text-violet-600!', border: 'border-violet-500!' },
			'--color-teal-500' : { bg:'bg-teal-500!', text: 'text-teal-500!', border: 'border-teal-500!' },
		}
		
		Alert({
			icon: "question",
			title: "Are you sure?",
			html: `The customer will see the order as 
				\`<span class="${colorMap[colorVar].text}">${capitalize(status)}</span>\``,
			showCancelButton: true,
			confirmButtonText: 'Yes, change now',
			customClass: {
				popup: "!w-[400px]",
				confirmButton: `${colorMap[colorVar]?.bg}`,
				icon: `${colorMap[colorVar]?.text} ${colorMap[colorVar]?.border}`,
				title: `${colorMap[colorVar]?.text}`,
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				const response = await orderStatusMutation
					.mutateAsync({ order_id: order?._id, status: statusVal });

				if (response?.data?.success) {
					const updatedStatus = response?.data?.order?.status;

					dispatch(updateOrder({...order, status: updatedStatus}))
					AxiosToast(response, false);
				}

				dispatch(setLoading(false));
			}
		});
	}

	const handleViewOrderClick = (order) => {
		dispatch(setLoading(true))
		navigate(`view-order/${order?.order_no}`, {
			state: { order, orders: sortedData },
		});
	};

	const createMenus = (order, onClick) => {
				
		const currentIndex = statusList?.findIndex(el => order?.status === el);
		const availStatuses = statusList?.slice(currentIndex + 1);

		return availStatuses?.map((el,i) => {

			const statusColor = `${statusColors[currentIndex + i + 1]}`;

			return ({
				id: `${el}${i}`,
				icon: 
					<span 
						style={{ '--status-color': `var(${statusColor})` }}
						className={`point-before point-before:bg-(--status-color)`}>

					</span>,
				text: (
					<span className={`capitalize`}>
						{el}
					</span>
				),
				onClick: () => onClick(order, el, `${statusColor}`),
			})
		})
	}

	return (
		<>
			{/* search, filter, sort*/}
			<SearchFilterComponent
				data={data}
				onSearch={(value)=> setSearchQuery(value)}
				onFilter={handleOnFilter}
				onSort={handleOnSort}
			/>

			<div className="flex flex-col w-full rounded-3xl shade border border-theme-divider">

				{/* data table header with quick sort facility */}
				<TableHeaderComponent
					data={data}
					filteredData={filteredData}
					onSort={handleOnSort}
				/>

				{/* table contents */}
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
								sortedData?.length <= itemsPerPage && "rounded-b-3xl"
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

									const currentStatusIndex = statusList?.findIndex(el => order?.status === el);
									const statusColorVal = statusColors[currentStatusIndex];
									const statusBgColor = tailwindToRgba(statusColorVal, 0.1)
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
												className={`grid ${data?.gridCols} items-center w-full px-4 py-2`}
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
														style={{ 
															backgroundColor: `${statusBgColor}`
														}}
														className={`badge h-fit ${colorMap[statusColorVal]?.text}`}
													>
														{order?.status}
													</span>
												</div>

												{/* Actions */}
												<div className="flex items-center justify-center space-x-1 z-50">
													<div
														onClick={() => handleViewOrderClick(order)}
														className="p-2 rounded-xl bg-blue-100/50 hover:bg-sky-300 border 
														border-primary-300/60 hover:scale-103 transition-all duration-300 cursor-pointer"
													>
														<LuEye className="text-xl" />
													</div>
													<Menu as="div" className="relative">
														{({ open }) => (
															<>
																<MenuButton
																	as="div"
																	className="p-2 rounded-xl bg-gray-100 hover:bg-white 
																			border border-gray-300 text-gray-900 cursor-pointer"
																>
																	<IoMdMore size={20} />
																</MenuButton>
																<ContextMenu
																	open={open}
																	items={[
																		...(order?.status !== 'on-hold' ?
																			[{
																				id: "hold",
																				icon: <FaHandHoldingHand className="text-lg" />,
																				text: (
																					<span className={`capitalize`}>
																						hold order
																					</span>
																				),
																				onClick: () => handleSatusChange(order, 'on-hold', '--color-violet-500'),
																			}]
																			: 
																			[]
																		),
																		...(createMenus(order, handleSatusChange))
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
					{sortedData?.length > itemsPerPage && (
						<motion.li layout key="pagination" className="flex justify-end px-4 py-5">
							<AdminPagination
								currentPage={currentPage}
								totalPages={totalPages}
								setCurrentPage={setCurrentPage}
							/>
						</motion.li>
					)}
				</motion.ul>
			</div>
		</>
	);
}

export default OrdersList;
