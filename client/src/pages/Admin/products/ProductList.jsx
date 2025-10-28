import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi2";
import {
	IoIosArrowDown,
	IoMdCheckmarkCircleOutline,
	IoMdMore,
} from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { TbUserEdit } from "react-icons/tb";
import ContextMenu from "../../../components/ui/ContextMenu";
import { Menu, MenuButton } from "@headlessui/react";
import Alert from "../../../components/ui/Alert";
import ApiBucket from "../../../services/ApiBucket";
import { Axios } from "../../../utils/AxiosSetup";
import AdminPagination from "../../../components/ui/AdminPagination";
import ImagePlaceHolder from "../../../components/ui/ImagePlaceHolder";
import PreviewImage from "../../../components/ui/PreviewImage";
import AxiosToast from "../../../utils/AxiosToast";
import { setLoading } from "../../../store/slices/CommonSlices";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router";
import toast from "react-hot-toast";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import { FaRegCircleXmark } from "react-icons/fa6";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import clsx from "clsx";
import StarRating from "../../../components/ui/StarRating";
import SkeltoList from "../../../components/ui/SkeltoList";

const ProductList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { list, searchQuery, filter, gridCols } = useOutletContext();
	const [products, setProducts] = useState([]);

	/* initial data loader */
	useEffect(() => {
    setProducts(list);
  }, [list]);

	/* paingation logic */
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(products?.length / itemsPerPage);

	const paginatedProducts = products?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/* variant expand */
	const [expanded, setExpanded] = useState({});
	const toggleExpand = (productId) => {
		setExpanded((prev) => ({
			...prev,
			[productId]: !prev[productId],
		}));
	};

	/* handle archive product */
	const handleStatusChange = async (id, status) => {
		let data = {};
		let statusChange = null;

		switch (status) {
			case "active":
				data = {
					text: "Yes, deactivate now",
					msg: "The inactive product won't accessible any more.",
					color: "!bg-pink-500 hover:!bg-pink-600",
				};
				statusChange = "inactive";
				break;
			case "inactive":
				data = {
					text: "Yes, activate now",
					msg: "Making active product allow all product operations.",
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
					const response = await Axios({
						...ApiBucket.changeProductStatus,
						data: {
							product_id: id,
							status: statusChange,
						},
					});

					if (response?.data?.success) {
						const updated = response.data.product;
						setProducts((prev) =>
							prev.map((product) =>
								product._id === updated._id ? updated : product
							)
						);
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

	/* handle product visibility */
	const handleVisibility = (product) => {
		Alert({
			icon: "question",
			title: "Are you sure?",
			text: product.visible
				? "This product will be hidden for users"
				: "This product will be shown for users",
			showCancelButton: true,
			confirmButtonText: product.visible ? "Yes, hide now" : "Yes, show now",
			customClass: {
				popup: "!w-[400px]",
				confirmButton: `${
					product.visible
						? "!bg-red-500 hover:!bg-red-600"
						: "!bg-green-500 hover:!bg-green-600"
				}`,
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				try {
					const response = await Axios({
						...ApiBucket.changeProductStatus,
						data: {
							product_id: product._id,
							visibility: !product.visible,
						},
					});

					if (response?.data?.success) {
						setProducts((prev) =>
							prev.map((p) => {
								if (p._id === product._id) {
									return {
										...p,
										visible: !p.visible,
									};
								}
								return p;
							})
						);
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

	/* handle product visibility */
	const handleMakeArchive = (product) => {
		Alert({
			icon: "question",
			title: "Are you sure?",
			text: product.archived
				? "This product get out of all type of access."
				: "This product will get all type of access",
			showCancelButton: true,
			confirmButtonText: product.archived
				? "Yes, archive now"
				: "Yes, unarchive now",
			customClass: {
				popup: "!w-[400px]",
				confirmButton: `${
					product.archived
						? "!bg-orange-500 hover:!bg-orange-600"
						: "!bg-green-500 hover:!bg-green-600"
				}`,
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				try {
					const response = await Axios({
						...ApiBucket.changeProductStatus,
						data: {
							product_id: product._id,
							visibility: !product.archived,
						},
					});

					if (response?.data?.success) {
						setProducts((prev) =>
							prev.map((p) => {
								if (p._id === product._id) {
									return {
										...p,
										archived: !p.archived,
									};
								}
								return p;
							})
						);
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

	/* handle delete product */
	const handledelete = async (id) => {
		/* Alert({
      icon: 'question',
      title: "Are you sure?",
      text: 'This action cannot revert back',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: 'var(--color-red-500)'
    }).then(async result => {
      
      if(result.isConfirmed){
        dispatch(setLoading(true));
        
        dispatch(setLoading(false))
      }
    }) */
		toast.error("Not implimented yet", { position: "top-center" });
	};

	return (
		<motion.ul
      layoutRoot
			className=" text-gray-700"
		>
			{/* Rows */}
			{paginatedProducts?.length > 0 ? (
				<motion.li
					layout
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
					className={clsx(
						"divide-y divide-theme-divider overflow-hidden",
						products?.length <= itemsPerPage && "rounded-b-3xl"
					)}
				>
					<AnimatePresence>
						{paginatedProducts?.map((product, i) => {
							const statusColors = () => {
								switch (product.status) {
									case "active":
										return "bg-green-500/40 text-teal-800";
									case "blocked":
										return "bg-red-100 text-red-500";
									default:
										return "bg-gray-200 text-gray-400";
								}
							};

							const variants = product?.variants;
							let minPrice = 0,
								maxPrice = 0,
								stock = 0,
								variantLen = variants?.length;

							if (variants?.length) {
								const prices = variants?.map((item) => {
									stock += item.stock;
									return item.price;
								});
								minPrice = Math.min(...prices);
								maxPrice = Math.max(...prices);
							} else {
								minPrice = product.price;
								stock = product.stock;
							}

							const category = product?.category?.name;
							const parentCategory = product?.category?.parentId?.name;

							return (
								<React.Fragment key={product._id}>
									<motion.div
										layout
										key={product._id}
										initial="hidden"
										animate="visible"
										exit="exit"
										variants={rowVariants(i)}
										whileHover={{
											backgroundColor: product.archived ? "" : "#efffeb",
											transition: { duration: 0.3 },
										}}
										className={clsx(
											product.archived
												? "disabled-el bg-gray-100 grayscale-100 !opacity-50"
												: "bg-white"
										)}
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
												{/* varinats expand arrow */}
												<div
													onClick={() => toggleExpand(product._id)}
													className={`absolute top-1/2 -left-5 -translate-y-1/2 cursor-pointer smooth
                                hover:text-featured-500
                                ${
																	product.variants?.length
																		? "text-gray-800"
																		: "text-gray-300 pointer-events-none cursor-not-allowed"
																}`}
												>
													<IoIosArrowDown />
												</div>

												<PreviewImage
													src={product?.images?.[0]?.thumb}
													alt={product?.name}
													size="40"
													zoom="120%"
													thumbClass="rounded-xl border border-gray-300 w-12 h-12"
												/>

												<div className="inline-flex flex-col capitalize">
													<p className="font-semibold">{product?.name}</p>
													<p className="text-xs">
														{variantLen
															? variantLen +
															  ` Variant${variantLen > 1 ? "s" : ""}`
															: product.sku}
													</p>
													{product?.featured && (
														<p className="point-before">Featured</p>
													)}
												</div>
											</div>

											{/* category */}
											<div className="capitalize flex flex-col">
												<span>{category}</span>
												{parentCategory && (
													<p className="text-[11px] text-gray-400">
														<span className="me-1">in -</span>
														<span>{parentCategory}</span>
													</p>
												)}
											</div>

											{/* price */}
											<div className="capitalize flex flex-col">
												{minPrice < maxPrice ? (
													<div className="font-semibold">
														<span className="price-before font-semibold">
															{minPrice}
														</span>
														<span className="mx-1">-</span>
														<span className="price-before font-semibold">
															{maxPrice}
														</span>
													</div>
												) : (
													<span className="price-before font-semibold">
														{minPrice}
													</span>
												)}
												<div>
													<StarRating
														value={product?.averageRating}
														starSize={3}
														showValue={true}
													/>
												</div>
											</div>

											{/* stock */}
											<div className="capitalize text-center">{stock}</div>

											{/* Status */}
											<div className="text-center">
												<span
													className={`w-fit px-2 py-1 text-xs font-semibold rounded-full capitalize
                              ${statusColors()}`}
												>
													{product.archived ? "archived" : product?.status}
												</span>
											</div>

											{/* visible */}
											<div className="flex justify-center">
												<ToggleSwitch
													size={4}
													value={product.visible}
													onChange={() => handleVisibility(product)}
												/>
											</div>

											{/* Actions */}
											<div className="flex items-center justify-center space-x-1 z-50">
												<div
													onClick={() =>
														navigate(`/admin/products/${product?.slug}/edit`, {
															state: { currentProduct: product },
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
																					{" "}
																					view{" "}
																				</span>
																			),
																			onclick: () => {},
																		},
																		{
																			id: "status",
																			icon:
																				product.status === "active" ? (
																					<IoMdCheckmarkCircleOutline className="text-xl text-primary-400" />
																				) : (
																					<FaRegCircleXmark className="text-xl" />
																				),
																			text: (
																				<span className={`capitalize`}>
																					{" "}
																					{product.status}{" "}
																				</span>
																			),
																			tail: (
																				<ToggleSwitch
																					size={4}
																					value={product.status === "active"}
																					onChange={() =>
																						handleStatusChange(
																							product._id,
																							product.status
																						)
																					}
																				/>
																			),
																		},
																		{
																			id: "archive",
																			icon: product.archived ? (
																				<MdOutlineArchive className="text-xl" />
																			) : (
																				<MdOutlineUnarchive className="text-xl" />
																			),
																			text: (
																				<span className={`capitalize`}>
																					{" "}
																					{product.archived
																						? "unarchive"
																						: "archive"}{" "}
																				</span>
																			),
																			onClick: () => handleMakeArchive(product),
																		},
																		{
																			id: "delete",
																			icon: (
																				<HiOutlineTrash className="text-xl" />
																			),
																			text: (
																				<span className={`capitalize`}>
																					{" "}
																					delete{" "}
																				</span>
																			),
																			onClick: () => handledelete(product._id),
																			itemClass:
																				"bg-red-50 text-red-300 hover:text-red-500 hover:bg-red-100",
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

									{/* variant items */}
									<motion.div
										key="expanding-box"
										className="grid grid-cols-4 ps-13.5 pr-2 bg-gray-100 gap-2"
										style={{ "--temp-border": "rgba(76, 196, 187, 0.3)" }}
										animate={{
											paddingTop: expanded[product._id] ? 8 : 0,
											paddingBottom: expanded[product._id] ? 8 : 0,
											borderBottomWidth: expanded[product._id] ? 1 : 0,
											borderBottomColor: expanded[product._id]
												? "rgba(76, 196, 187, 0.3)"
												: "rgba(0, 0, 0, 0)",
										}}
										transition={{ duration: 0.2 }}
									>
										<AnimatePresence>
											{expanded[product._id] &&
												product.variants?.length > 0 &&
												product.variants.map((variant, i) => (
													<motion.div
														key={variant._id}
														initial={{ height: 0, opacity: 0 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 0, opacity: 0 }}
														transition={{ duration: 0.3 }}
														className="overflow-hidden"
													>
														<div className="flex space-x-2 items-center relative border border-gray-200 p-2 rounded-2xl bg-white">
															{variant.image?.thumb ? (
																<PreviewImage
																	src={variant.image?.thumb}
																	alt={product?.name}
																	zoom="80%"
																	thumbClass="rounded-xl border border-gray-300 w-12 h-12"
																/>
															) : (
																<ImagePlaceHolder
																	size={18}
																	className="rounded-xl border border-gray-300 bg-gray-100 text-gray-500/60 w-12 h-12"
																/>
															)}

															<div className="flex flex-col columns-2 flex-wrap space-x-3 text-xs h-12">
																<div className="space-x-1 capitalize">
																	<span className="text-gray-400">Price:</span>
																	<span className="price-before font-semibold">
																		{variant?.price}
																	</span>
																</div>
																<div className="space-x-1 capitalize">
																	<span className="text-gray-400">Stock:</span>
																	<span>{variant?.stock}</span>
																</div>

																{Object.keys(variant?.attributes).map(
																	(key, i) => (
																		<div
																			key={i}
																			className="space-x-1 capitalize"
																		>
																			<span className="text-gray-400">
																				{key}:
																			</span>
																			<span
																				style={{
																					"--dynamic":
																						variant?.attributes["color"] ||
																						variant?.attributes["colour"],
																				}}
																				className={clsx(
																					(key === "color" ||
																						key === "colour") &&
																						"point-before point-before:p-1.25 point-before:bg-(--dynamic) point-before:!rounded-sm"
																				)}
																			>
																				{key !== "color" &&
																					key !== "colour" &&
																					variant.attributes[key]}
																			</span>
																		</div>
																	)
																)}
															</div>
														</div>
													</motion.div>
												))}
										</AnimatePresence>
									</motion.div>
								</React.Fragment>
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
					variants={rowVariants(paginatedProducts?.length)}
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
			{products?.length > itemsPerPage && (
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
};

export default ProductList;
