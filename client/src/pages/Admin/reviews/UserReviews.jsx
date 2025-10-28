import React, { useEffect, useState } from "react";
import {
	IoMdCheckmarkCircleOutline,
	IoMdMore,
} from "react-icons/io";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { containerVariants, rowVariants } from "../../../utils/Anim";
import ApiBucket from "../../../services/ApiBucket";
import { Axios } from "../../../utils/AxiosSetup";
import { format } from "date-fns";
import StarRating from "../../../components/ui/StarRating";
import AdminPagination from "../../../components/ui/AdminPagination";
import { Menu, MenuButton } from "@headlessui/react";
import ContextMenu from "../../../components/ui/ContextMenu";
import { FaRegCircleXmark } from "react-icons/fa6";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import { setLoading } from "../../../store/slices/CommonSlices";
import Alert from "../../../components/ui/Alert";
import AxiosToast from "../../../utils/AxiosToast";
import { useDispatch } from "react-redux";
import SkeltoList from "../../../components/ui/SkeltoList";
import { useOutletContext } from "react-router";

function UserReviewsComponent() {
  
	const dispatch = useDispatch();
	const { list, searchQuery, filter, gridCols } = useOutletContext();
	const [reviews, setReviews] = useState([]);

	/* initial data loader */
	useEffect(() => {
		setReviews(list);
	}, [list]);


	/* paingation logic */
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(reviews?.length / itemsPerPage);

	const paginatedReviews = reviews?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/* handle status */
	const handleStatusChange = async (id, status) => {
		let data = {};
		let statusChange = null;

		switch (status) {
			case "approved":
				data = {
					text: "Yes, hide now",
					msg: "Hidden review won't visible publicly",
					color: "!bg-red-500 hover:!bg-red-600",
				};
				statusChange = "hidden";
				break;
			case "pending":
			case "hidden":
				data = {
					text: "Yes, approve now",
					msg: "This review will be visible to the public.",
					color: "",
				};
				statusChange = "approved";
				break;

			default:
				null;
		}

		Alert({
			icon: "question",
			title: "Are you sure?",
			text: data?.msg,
			showCancelButton: true,
			confirmButtonText: data?.text,
			customClass: {
				popup: "!w-[400px]",
				confirmButton: data?.color,
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				dispatch(setLoading(true));

				try {
					const response = await Axios({
						...ApiBucket.changeReviewStatus,
						data: {
							review_id: id,
							status: statusChange,
						},
					});

					if (response?.data?.success) {
						const updated = response?.data?.review;
						setReviews((prev) =>
							prev.map((review) =>
								review?._id === updated?._id ? updated : review
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

	return (
		<motion.ul
			layoutRoot
			className="text-gray-700"
		>
			{paginatedReviews?.length > 0 ? (
				<motion.li
					layout
					key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
					className={clsx(
						"divide-y divide-theme-divider overflow-hidden",
						reviews?.length <= itemsPerPage && "rounded-b-3xl"
					)}
				>
					<AnimatePresence exitBeforeEnter>
						{paginatedReviews?.map((review, i) => {
							const reviewUser = review?.user_id;
							const reviewProduct = review?.product_id;
							const dt = format(new Date(review?.createdAt), "dd MMM y");

							return (
								<motion.div
									layout
									key={review?._id}
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
									<ul
										className={`grid ${gridCols} items-center w-full px-4 py-2`}
									>
										{/* Checkbox */}
										<li>
											<input type="checkbox" />
										</li>

										{/* user */}
										<li>
											<p className="capitalize truncate">
												{reviewUser?.fullname || reviewUser?.username}
											</p>
											<p className="text-xs text-gray-500/80">{dt}</p>
										</li>

										{/* product */}
										<li className="capitalize truncate">
											<p>{reviewProduct?.name}</p>
											<p className="text-xs text-gray-500/80">
												{reviewProduct?.category?.name}
											</p>
										</li>

										{/* rating */}
										<li>
											<StarRating value={review?.rating} starSize={4} />
										</li>

										{/* title */}
										<li className="capitalize truncate font-bold text-sm">
											{review?.title}
										</li>

										{/* review */}
										<li className="truncate">{review?.review}</li>

										{/* status */}
										<li className="capitalize text-xs text-center">
											<span
												className={clsx(
													"badge py-1 px-2",
													review?.status === "pending" &&
														"bg-amber-100 text-amber-500",
													review?.status === "approved" &&
														"bg-green-100 text-green-600",
													review?.status === "hidden" &&
														"bg-gray-100 text-gray-500"
												)}
											>
												{review?.status}
											</span>
										</li>

										{/* Actions */}
										<li className="flex items-center justify-center z-50">
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
																{
																	id: "approved",
																	icon:
																		review?.status === "approved" ? (
																			<IoMdCheckmarkCircleOutline className="text-xl text-primary-400" />
																		) : (
																			<FaRegCircleXmark className="text-xl" />
																		),
																	text: (
																		<span className="capitalize">
																			{" "}
																			{review?.status === "approved"
																				? "approved"
																				: "approve"}{" "}
																		</span>
																	),
																	onClick: () => {},
																	tail: (
																		<ToggleSwitch
																			size={4}
																			value={review?.status === "approved"}
																			onChange={() =>
																				handleStatusChange(
																					review?._id,
																					review?.status
																				)
																			}
																		/>
																	),
																},
															]}
														/>
													</>
												)}
											</Menu>
										</li>
									</ul>
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
						variants={rowVariants(paginatedReviews?.length)}
						className="flex items-center"
					>
						<span
							className="w-full h-full text-center py-6 text-primary-400
                    text-xl bg-primary-50 border border-primary-300/50 border-t-0 rounded-b-3xl"
						>
							No reviews found
						</span>
					</motion.li>
				</AnimatePresence>
			)}

			{/* Pagination */}
			{reviews?.length > itemsPerPage && (
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
			)}
		</motion.ul>
	);
}

const UserReviews = React.memo(UserReviewsComponent);

export default UserReviews;
