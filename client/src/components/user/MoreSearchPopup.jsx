import { AnimatePresence } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import CustomModal from "../../components/ui/CustomModal";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

function MoreSearchPopup({
	isOpen,
	onClose,
	onChange,
	list,
	selectedList,
	type = "",
}) {
	/* debouncer */
	const [query, setQuery] = useState("");
	const [searchQuery, setSearchQuery] = useState(query);
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchQuery(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	/* search filter */
	const filteredList = useMemo(() => {
		return list.filter((item) => {
			const fields = ["name", "slug", "status"];

			return fields.some((field) => {
				if (item[field]) {
					return item[field].includes(searchQuery);
				}
				return false;
			});
		});
	}, [searchQuery, list]);

	const handleClose = () => {
		onClose();
	};

	return (
		<AnimatePresence>
			{/* should keep this pattern to maintain exit animation */}
			{isOpen && (
				<CustomModal
					isOpen={isOpen}
					className="border border-primary-300 w-[70vw] h-[80vh]
             bg-white absolute top-0 left-0 z-150 shadow-md"
				>
					{/* content */}
					<div className="flex flex-col relative">
						{/* close button */}
						<div
							onClick={handleClose}
							className="absolute top-0 right-0 p-1 cursor-pointer
              smooth hover:bg-red-200"
						>
							<IoClose className="text-xl" />
						</div>

						{/* search */}
						<div className="flex p-2 border-b border-gray-200">
							<div className="w-[30%] inline-flex relative">
								<span className="absolute top-1/2 -translate-y-1/2 p-2 text-gray-400">
									<LuSearch className="text-xl" />
								</span>
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="!ps-8 !h-9"
									placeholder={`Search ${type}`}
								/>
							</div>
						</div>

						<div className="grid auto-cols-fr p-4">
							{filteredList?.map((item, i) => (
								<li key={item._id} className="flex items-center w-fit py-1.5">
									<input
										type="checkbox"
										id={item._id}
										onChange={(e) => onChange(e, item._id)}
										checked={selectedList?.includes(item._id)}
									/>
									<label
										htmlFor={item._id}
										className="!text-sm !text-gray-600 !ps-2 cursor-pointer capitalize"
									>
										{item.name}
									</label>
								</li>
							))}
						</div>
					</div>
				</CustomModal>
			)}
		</AnimatePresence>
	);
}

export default MoreSearchPopup;
