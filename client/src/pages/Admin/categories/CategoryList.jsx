import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoMdCheckmarkCircleOutline, IoMdMore } from "react-icons/io";
import { TbUserEdit } from "react-icons/tb";
import ContextMenu from "../../../components/ui/ContextMenu";
import { Menu, MenuButton } from "@headlessui/react";
import Alert from "../../../components/ui/Alert";
import AddCategoryModal from "../../../components/admin/categories/AddCategoryModal";
import AdminPagination from "../../../components/ui/AdminPagination";
import EditCategoryModal from "../../../components/admin/categories/EditCategoryModal";
import PreviewImage from "../../../components/ui/PreviewImage";
import AxiosToast from "../../../utils/AxiosToast";
import { setLoading } from "../../../store/slices/CommonSlices";
import { useDispatch } from "react-redux";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import ImagePlaceHolder from "../../../components/ui/ImagePlaceHolder";
import SkeltoList from "../../../components/ui/SkeltoList";
import clsx from "clsx";
import { useOutletContext } from "react-router";
import SearchFilterComponent from "../pageComponents/SearchFilterComponent";
import TableHeaderComponent from "../pageComponents/TableHeaderComponent";
import { FaRegCircleXmark } from "react-icons/fa6";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import { useChangeCategoryStatusMutation, useDeleteCategoryMutation } from "../../../services/MutationHooks";
import { setAllCategories, updateCategory } from "../../../store/slices/CategorySlices";

const CategoryList = () => {

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

	const paginatedCategories = sortedData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/* add category action */
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);

  useEffect(()=>{
    if(action === 'openAddCategoryModal'){
      setIsAddOpen(true)
    }
  },[action])

	/* category actions handleing */
	const changeStatusMutation = useChangeCategoryStatusMutation();
	const deleteCategoryMutation = useDeleteCategoryMutation();

	const handleCreate = (doc) => {
		const parent = sortedData?.find((item) => item._id === doc.parentId);
		const docWithParent = {
			...doc,
			parentId: parent || doc.parentId,
		};

		const sorted = [...sortedData, docWithParent].sort((a, b) =>
			b.createdAt.localeCompare(a.createdAt)
		);

		dispatch(setAllCategories(sorted));
		setIsAddOpen(false);
	};

	/* update action handleing */
	const handleUpdate = (doc) => {
		const parent = sortedData?.find((item) => item._id === doc.parentId);
		const docWithParent = {
			...doc,
			parentId: parent || doc.parentId,
		};

		const updatedCates = sortedData.map((item) => {
			if (item._id === doc._id) {
				return docWithParent;
			} else if (item.parentId?._id === doc._id) {
				return {
					...item,
					parentId: {
						...docWithParent,
					},
				};
			} else {
				return item;
			}
		});

		dispatch(setAllCategories(updatedCates));
		setIsEditOpen(false);
	};

	/* handle delete category */
	const handledelete = async (id) => {
		Alert({
			icon: "question",
			title: "Are you sure?",
			html: "This action cannot revert back",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it",
			customClass: {
				confirmButton: '!bg-red-500 !hover:bg-red-700',
				title: '!text-red-500',
				icon: '!text-red-500',
				htmlContainer: '!text-red-500'
			},
		}).then(async (result) => {
			if (result.isConfirmed) {

				dispatch(setLoading(true));

				const response = await deleteCategoryMutation
					.mutateAsync({ folder:"categories", category_id: id});

				if (response?.data?.success) {
					const restCategories = sortedData?.filter((category) => category._id !== id);
					dispatch(setAllCategories(restCategories));
					AxiosToast(response, false);
				} else {
					AxiosToast(response);
				}
				dispatch(setLoading(false));
			}
		});
	};

	const handleStatusChange = (category, status) => {
		let data = {};
		let statusChange = null;

		switch (status) {
			case "active":
				data = {
					text: "Yes, deactivate now",
					msg: "All products under this category will be hidden.",
					color: "!bg-pink-500 hover:!bg-pink-600",
				};
				statusChange = "inactive";
				break;
			case "inactive":
				data = {
					text: "Yes, activate now",
					msg: "All products under this category will be shown.",
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
					const response = await changeStatusMutation
					.mutateAsync({ category_id: category?._id, status: statusChange });

					if (response?.data?.success) {
						const updatedStatus = response?.data?.category?.status;
						const updated = {
							...category,
							status: updatedStatus
						}
						
						dispatch(updateCategory(updated));
						AxiosToast(response, false);
					}

				} catch (error) {
					AxiosToast(error);
				} finally {
					dispatch(setLoading(false));
				}
			}

		});
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
				<motion.ul layoutRoot className="text-gray-700">

					{/* Rows */}
					{paginatedCategories?.length > 0 ? (

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
							<AnimatePresence exitBeforeEnter>

								{paginatedCategories?.map((category, i) => {
									
									const statusColors = () => {
										switch (category.status) {
											case "active":
												return "bg-green-500/40 text-teal-800";
											case "blocked":
												return "bg-red-100 text-red-500";
											default:
												return "bg-gray-200 text-gray-400";
										}
									};

									const hasParent = category?.parentId;

									return (
										<motion.div
											layout
											key={category._id}
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
											<div className={`grid ${data?.gridCols} items-center w-full px-4 py-2`}>
												{/* Checkbox */}
												<div>
													<input type="checkbox" />
												</div>

												{/* Category Info */}
												<div className="flex gap-2 items-center">
													{category?.thumb?.url ? (
														<PreviewImage
															src={category?.thumb?.url}
															alt={category?.name}
															size="40"
															zoom="120%"
															thumbClass="rounded-xl border border-gray-300 w-12 h-12"
														/>
													) : (
														<ImagePlaceHolder
															size={22}
															className="rounded-xl border border-gray-300 bg-white text-gray-500/60 w-12 h-12"
														/>
													)}

													<div className="inline-flex flex-col capitalize">
														<p
															className={clsx(
																"font-semibold",
																!hasParent && "text-primary-400"
															)}
														>
															{category?.name}
														</p>
														<p
															className={clsx(
																"text-xs",
																!hasParent && "text-primary-400"
															)}
														>
															<span>
																{category?.products}{" "}
																{category?.products > 1 ? "products" : "product"}
															</span>
															<span className="text-gray-300 mx-1">|</span>
															<span>
																{category?.brands}{" "}
																{category?.brands > 1 ? "brands" : "brand"}
															</span>
														</p>
														{category?.featured && (
															<p
																className="text-xs text-featured-500 inline-flex items-center w-fit rounded-xl
																				before:bg-featured-300 before:content[''] before:p-0.75 before:me-1
																				before:inline-flex before:items-center before:rounded-full"
															>
																Featured
															</p>
														)}
													</div>
												</div>

												{/* Slug */}
												<p className={clsx(!hasParent && "text-primary-400")}>
													/{category.slug}
												</p>

												{/* parent name */}
												<div className="capitalize">
													{hasParent?.name || (
														<span className="text-gray-400">Nil</span>
													)}
												</div>

												{/* Status */}
												<div>
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
																		${statusColors()}`}
													>
														{category?.status}
													</span>
												</div>

												{/* visibility */}
												{/* <div className="capitalize">
													{category?.visible ? (
														"visible"
													) : (
														<span className="text-gray-400">Invisible</span>
													)}
												</div> */}

												{/* Actions */}
												<div className="flex items-center justify-center gap-3 z-50">
													<div
														onClick={() => {
															setIsEditOpen(true);
															setEditingCategory(category);
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
																	className="!p-2 !rounded-xl !bg-gray-100 hover:!bg-white 
																					border border-gray-300 !text-gray-900 cursor-pointer"
																>
																	<IoMdMore size={20} />
																</MenuButton>
																<ContextMenu
																	open={open}
																	items={[
																		/* { label: 'view category', icon: IoEyeOutline, onClick: () => {} }, */
																		{
																			id: "active",
																			icon:
																				category?.status === "active" ? (
																					<IoMdCheckmarkCircleOutline className="text-xl text-primary-400" />
																				) : (
																					<FaRegCircleXmark className="text-xl" />
																				),
																			text: (
																				<span className={`capitalize`}>
																					{category?.status}
																				</span>
																			),
																			onClick: () => {},
																			tail: (
																				<ToggleSwitch
																					size={4}
																					value={category?.status === "active"}
																					onChange={() =>
																						handleStatusChange(category, category?.status)
																					}
																				/>
																			),
																		},
																		{
																			id: "delete",
																			icon: <HiOutlineTrash className="text-xl" />,
																			text: (
																				<span className={`capitalize`}>
																					delete
																				</span>
																			),
																			onClick: () => handledelete(category._id),
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
								variants={rowVariants(paginatedCategories?.length)}
								className="flex items-center"
							>
								<span
									className="w-full h-full text-center py-6 text-primary-400
											text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
								>
									No category found
								</span>
							</motion.li>
						</AnimatePresence>
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

					<AddCategoryModal
						categories={sortedData}
						isOpen={isAddOpen}
						onCreate={handleCreate}
						onClose={() => setIsAddOpen(false)}
					/>

					<EditCategoryModal
						category={editingCategory}
						list={sortedData.filter(item => item._id !== editingCategory?._id)}
						isOpen={isEditOpen}
						onUpdate={handleUpdate}
						onClose={() => setIsEditOpen(false)}
					/>
				</motion.ul>
			</div>
		</>
	);
};

export default CategoryList;
