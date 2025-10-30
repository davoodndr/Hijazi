import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi2";
import {
	IoMdCheckmarkCircleOutline,
	IoMdMore,
} from "react-icons/io";
import { TbUserEdit } from "react-icons/tb";
import ContextMenu from "../../../components/ui/ContextMenu";
import { Menu, MenuButton } from "@headlessui/react";
import Alert from "../../../components/ui/Alert";
import AdminPagination from "../../../components/ui/AdminPagination";
import AxiosToast from "../../../utils/AxiosToast";
import { setLoading } from "../../../store/slices/CommonSlices";
import { useDispatch } from "react-redux";
import { FaRegCircleXmark } from "react-icons/fa6";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import clsx from "clsx";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import { format } from "date-fns";
import AddOfferModal from "../../../components/admin/offers/AddOfferModal";
import EditOfferModal from "../../../components/admin/offers/EditOfferModal";
import { useOutletContext } from "react-router";
import SearchFilterComponent from "../pageComponents/SearchFilterComponent";
import TableHeaderComponent from "../pageComponents/TableHeaderComponent";
import { useChangeOfferStatusMutation, useDeleteOfferMutation } from "../../../services/MutationHooks";
import { setAllOffers, updateOffer } from "../../../store/slices/OfferSlice";
import SkeltoList from "../../../components/ui/SkeltoList";

const OffersList = () => {

	const dispatch = useDispatch();

	const { data, action } = useOutletContext();

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

	const paginatedOffers = sortedData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/* add offer action */
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingOffer, setEditingOffer] = useState(null);

  useEffect(()=>{
    if(action === 'openAddOfferModal'){
      setIsAddOpen(true)
    }
  },[action])

	/* offers action handleing */

	const changeOfferStatusMutation = useChangeOfferStatusMutation();
	const deleteOfferMutation = useDeleteOfferMutation();

	/* handle delete offer */
	const handledelete = async (id) => {
		Alert({
			icon: "question",
			title: "Are you sure?",
			html: "<span class='text-red-400'>This action cannot revert back</span>",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it",
			customClass: {
				confirmButton: '!bg-red-500',
				title: '!text-red-500',
				icon: '!text-red-500'
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				const response = await deleteOfferMutation.mutateAsync({ offer_id: id });

				if (response?.data?.success) {
					
					const restOffers = sortedData?.filter(el => el?._id !== id);
					dispatch(setAllOffers(restOffers))
					
					AxiosToast(response, false);
				} else {
					AxiosToast(response);
				}
				dispatch(setLoading(false));
			}
		});
	};

	/* handle archive offer */
	const handleStatusChange = async (id, status) => {
		let data = {};
		let statusChange = null;

		switch (status) {
			case "active":
				data = {
					text: "Yes, deactivate now",
					msg: "The inactive offer won't accessible any more.",
					color: "!bg-pink-500 hover:!bg-pink-600",
				};
				statusChange = "inactive";
				break;
			case "inactive":
				data = {
					text: "Yes, activate now",
					msg: "Making active offer allow all offer operations.",
					color: "",
				};
				statusChange = "active";
				break;

			default:
				null;
		}

		Alert({
			icon: "question",
			title: "Are you sure?",
			text: data.msg,
			showCancelButton: true,
			confirmButtonText: data.text,
			customClass: {
				popup: "!w-[400px]",
				confirmButton: data.color,
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				try {
					const response = await changeOfferStatusMutation
					.mutateAsync({ offer_id: id, status: statusChange });

					if (response?.data?.success) {
						const updated = response?.data?.offer;
						
						dispatch(updateOffer(updated));
						AxiosToast(response, false);
					}

				} catch (error) {
					AxiosToast(error);
				} finally {
					dispatch(setLoading(false));
				}
			}
		});
	};

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

					{paginatedOffers?.length > 0 ? (
						<motion.li
							layout
							key={currentPage}
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className={clsx(
								"divide-y divide-theme-divider overflow-hidden",
								sortedData?.length <= itemsPerPage && "rounded-b-3xl"
							)}
						>
							<AnimatePresence>
								{paginatedOffers?.map((offer, i) => {
									const statusColors = () => {
										switch (offer.status) {
											case "active":
												return "bg-green-500/40 text-teal-800";
											case "expired":
												return "bg-red-100 text-red-500";
											default:
												return "bg-gray-200 text-gray-400";
										}
									};

									return (
										<motion.div
											layout
											key={offer._id}
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

												{/* Caoupon Info */}
												<div>
													<p className="text-sm font-semibold capitalize">
														{offer?.title}
													</p>
													<p className="text-xs text-gray-500 capitalize">
														{offer?.type === "coupon" ? (
															<span>
																{offer?.type} | {offer?.couponCode}
															</span>
														) : (
															<span>Offer | {offer?.type} level</span>
														)}
													</p>
												</div>

												{/* discount */}
												<div className="flex flex-col text-sm">
													<p className="tracking-tight space-x-1">
														<span className="text-gray-400">Value:</span>
														<span
															className={clsx(
																offer?.discountType === "fixed"
																	? "price-before"
																	: 'content-after content-after:content-["%"]'
															)}
														>
															{offer.discountValue}
														</span>
													</p>
													{offer?.discountType === "percentage" && (
														<p className="tracking-tight space-x-1">
															<span className="text-gray-400">Max:</span>
															{offer?.maxDiscount > 0 ? (
																<span className="price-before">
																	{offer?.maxDiscount}
																</span>
															) : (
																<span>Unlimited</span>
															)}
														</p>
													)}
												</div>

												{/* validity */}
												<div className="flex flex-col text-sm">
													<p className="tracking-tight space-x-1">
														<span className="text-gray-400">Start:</span>
														{offer?.startDate ? (
															<span>
																{format(new Date(offer?.startDate), "dd-MM-yy")}
															</span>
														) : (
															<span>Unlimited</span>
														)}
													</p>
													<p className="tracking-tight space-x-1">
														<span className="text-gray-400">End:</span>
														{offer?.endDate ? (
															<span>
																{format(new Date(offer?.endDate), "dd-MM-yy")}
															</span>
														) : (
															<span>Unlimited</span>
														)}
													</p>
												</div>

												{/* min puschase value */}
												<div className="text-sm w-[50%] text-end">
													{offer?.minPurchase ? (
														<span className="price-before">
															{offer?.minPurchase}
														</span>
													) : (
														<span>All Purchase</span>
													)}
												</div>

												{/* usage limit */}
												<div className="flex flex-col">
													<div className="inline-flex space-x-1 text-sm">
														<span className="text-gray-400">Total:</span>
														<span>{offer?.usageLimit ?? "No limit"}</span>
													</div>
													<div className="inline-flex text-sm">
														<span>{offer?.usagePerUser ?? "No limit"}</span>
														<span className="text-gray-400"> /per user</span>
													</div>
												</div>

												{/* Status */}
												<div className="flex justify-center">
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
																	${statusColors()}`}
													>
														{offer?.status}
													</span>
												</div>

												{/* Actions */}
												<div className="flex items-center justify-center gap-3 z-50">
													<div
														onClick={() => {
															setIsEditOpen(true);
															setEditingOffer(offer);
														}}
														className="p-2 rounded-xl bg-blue-100/50 hover:bg-sky-300 border 
																	border-primary-300/60 hover:scale-103 transition-all duration-300 cursor-pointer"
													>
														<TbUserEdit size={20} />
													</div>

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
																	items={[
																		...(offer?.status === "active" ||
																		offer?.status === "inactive"
																			? [
																					{
																						id: "active",
																						icon:
																							offer?.status === "active" ? (
																								<IoMdCheckmarkCircleOutline className="text-xl text-primary-400" />
																							) : (
																								<FaRegCircleXmark className="text-xl" />
																							),
																						text: (
																							<span className={`capitalize`}>
																								{" "}
																								{offer?.status}{" "}
																							</span>
																						),
																						onClick: () => {},
																						tail: (
																							<ToggleSwitch
																								size={4}
																								value={offer?.status === "active"}
																								onChange={() =>
																									handleStatusChange(
																										offer?._id,
																										offer?.status
																									)
																								}
																							/>
																						),
																					},
																				]
																			: []),
																		{
																			id: "delete",
																			icon: <HiOutlineTrash className="text-xl" />,
																			text: (
																				<span className={`capitalize`}>
																					{" "}
																					delete{" "}
																				</span>
																			),
																			onClick: () => handledelete(offer._id),
																			itemClass:
																				"bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100",
																		},
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
						<AnimatePresence>
							<motion.li
								key="not-found"
								layout
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={rowVariants(paginatedOffers?.length)}
								className="flex items-center"
							>
								<span
									className="w-full h-full text-center py-6 text-primary-400
												text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
								>
									No offers found
								</span>
							</motion.li>
						</AnimatePresence>
					)}

					{/* Pagination */}
					{sortedData?.length > itemsPerPage && (
						<motion.li
							layout
							key="pagination"
							className="flex justify-end px-4 py-5"
						>
							<AdminPagination
								currentPage={currentPage}
								totalPages={totalPages}
								setCurrentPage={setCurrentPage}
							/>
						</motion.li>
					)}

					<AddOfferModal
						offers={sortedData}
						isOpen={isAddOpen}
						onClose={() => setIsAddOpen(false)}
					/>

					<EditOfferModal
						offer={editingOffer}
						isOpen={isEditOpen}
						onClose={() => setIsEditOpen(false)}
					/>
				</motion.ul>
			</div>
		</>
	);
};

export default OffersList;
