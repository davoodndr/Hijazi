
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { IoIosArrowDown } from 'react-icons/io';


function DropdownMenuButtonComponent({ 
	items,
	anchor = 'auto',
	className,
	icon,
	style,
	labelClass,
	label
}) {

	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({top: 0, left: 0});
	
	const buttonRef = useRef(null);
	const menuRef = useRef(null);

  useLayoutEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

	useLayoutEffect(() => {
		if (!isOpen) return;

		const updatePosition = () => {
			const rect = buttonRef.current?.getBoundingClientRect();
			if (!rect) return;

			// Re-run same logic as toggleMenu (or call toggleMenu directly if safe)
			const menuWidth = 160;
			const menuHeight = 200;
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;

			const spaceBelow = screenHeight - rect.bottom;
			const spaceAbove = rect.top;
			const spaceRight = screenWidth - rect.left;
			const spaceLeft = rect.right;

			let top;
			if (spaceBelow >= menuHeight) {
				top = rect.bottom;
			} else if (spaceAbove >= menuHeight) {
				top = rect.top - menuHeight;
			} else {
				top = Math.max(0, screenHeight - menuHeight - 8);
			}

			let left;
			if (anchor === 'auto') {
				if (spaceRight >= menuWidth) {
					left = rect.left;
				} else if (spaceLeft >= menuWidth) {
					left = rect.right - menuWidth;
				} else {
					left = Math.max(0, screenWidth - menuWidth - 8);
				}
			} else if (anchor === 'left') {
				left = spaceLeft > menuWidth
					? rect.right - menuWidth
					: Math.max(0, rect.left);
			} else {
				left = spaceRight > menuWidth
					? rect.left
					: Math.max(0, rect.right - menuWidth);
			}

			setPosition({ top, left });
		};

		// ✅ Attach listeners
		window.addEventListener('scroll', updatePosition, true); // `true` to capture scroll in nested containers
		window.addEventListener('resize', updatePosition);

		// ✅ Cleanup
		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		};
	}, [isOpen]);

	const toggleMenu = () => {
    const rect = buttonRef.current.getBoundingClientRect();

    const menuWidth = 160;
		const menuHeight = 200;
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const spaceBelow = screenHeight - rect.bottom;
		const spaceAbove = rect.top;
		const spaceRight = screenWidth - rect.left;
		const spaceLeft = rect.right;

		let top;
		if (spaceBelow >= menuHeight) {
			top = rect.bottom;
		} else if (spaceAbove >= menuHeight) {
			top = rect.top - menuHeight;
		} else {
			top = Math.max(0, screenHeight - menuHeight - 8);
		}

		let left;
		if (anchor === 'auto') {
			if (spaceRight >= menuWidth) {
				left = rect.left;
			} else if (spaceLeft >= menuWidth) {
				left = rect.right - menuWidth;
			} else {
				left = Math.max(0, screenWidth - menuWidth - 8);
			}
		} else if (anchor === 'left') {
			left = spaceLeft > menuWidth
				? rect.right - menuWidth
				: Math.max(0, rect.left);
		} else {
			left = spaceRight > menuWidth
				? rect.left
				: Math.max(0, rect.right - menuWidth);
		}

		setPosition({ top, left });
		setIsOpen(prev => !prev);
  };
  
  return (
		<div>
			{/* button */}
			<motion.div
				layout
				key='dropdown-button'
        ref={buttonRef}
        onClick={toggleMenu}
				style={style}
        className={`inline-flex h-9 items-center cursor-pointer ${className}`}
      >
        {icon}
				<p className={`capitalize pe-2 ${labelClass}`}>{label}</p>
				<span className='h-full w-px bg-gray-500/30'></span>
				<span className={clsx('inline-flex items-center p-2 h-full rounded-e-xl',
					isOpen && 'bg-gray-100'
				)}>
					<IoIosArrowDown />
				</span>
      </motion.div>

			{/* menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={menuRef}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						style={{ top: position.top, left: position.left }}
						className={`absolute min-w-40 outline-0 origin-top-left z-200`}
					>
						<div className='border border-gray-200 divide-y divide-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden'>
							{items?.length > 0 ? 
								items.map((item, idx) => (
									<MenuItem 
										key={idx} 
										item={item} 
										parentRect={menuRef}
										onClose= {() => setIsOpen(false)}
									/>
								))
								:
								(
									<div
										className="h-12 px-4 flex items-center justify-between bg-gray-100/50"
									>No menu item</div>
								)
							}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
  )
	
}

const DropdownMenuButton = React.memo(DropdownMenuButtonComponent)

export default DropdownMenuButton;

function hasSelectedChild(item) {
  if (!item.children) return false;

  return item.children.some(child => {
    if (child.isSelected) return true;
    return hasSelectedChild(child);
  });
}

const MenuItem = forwardRef(({ item, parentDirection, onClose }, parentRect) => {

  const [submenuPos, setSubmenuPos] = useState(null);
	const [submenuOpen, setSubmenuOpen] = useState(false);
	const [isChildHovered, setIsChildHovered] = useState(false);
	const childIsSelected = hasSelectedChild(item);
  const itemRef = useRef(null);

	const handleMouseEnter = () => {

		if (!item?.children || !itemRef?.current) return;

		const rect = itemRef?.current?.getBoundingClientRect();

		if (!rect) return;

		const submenuWidth = 160;
		const submenuHeight = item.children.length * 36 + 16;

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		const spaceRight = screenWidth - rect.right;
		const spaceLeft = rect.left;
		const spaceBelow = screenHeight - rect.top;

		let left = rect?.right;
		let direction = 'right';

		if (parentDirection === 'left' || (spaceRight < submenuWidth && spaceLeft >= submenuWidth)) {
			left = rect.left - submenuWidth;
			direction = 'left';
		}

		let top = rect?.top;
		if (spaceBelow < submenuHeight && rect.bottom >= submenuHeight) {
			top = rect.bottom - submenuHeight;
		}

		// Clamp
		left = Math.max(0, Math.min(left, screenWidth - submenuWidth));
		top = Math.max(0, Math.min(top, screenHeight - submenuHeight));

		setSubmenuPos({ top, left, direction });
		setSubmenuOpen(true);
		setIsChildHovered(true);

  };

  const handleMouseLeave = () => {
		setIsChildHovered(false);
    if (item?.children) {
      setSubmenuOpen(false);
    }
  };

	useEffect(() => {
		let timeout;

		if (!submenuOpen) {
			timeout = setTimeout(() => {
				setSubmenuPos(null);
			}, 150);
		}

		return () => clearTimeout(timeout);
	}, [submenuOpen]);

  return (
    <div
      ref={itemRef}
      className={clsx(`h-9 px-4 flex items-center cursor-pointer group smooth hover:bg-primary-25 ${item?.itemClass}`,
				isChildHovered && 'bg-primary-25',
				childIsSelected && 'bg-primary-50'
			)}
      onClick={(e) => {
        e.stopPropagation();
        if (!item.children) {
					item.action?.();
					onClose?.();
				}
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
			<div className='smooth group-hover:pl-1 capitalize space-x-1 temp'>
				{item?.icon}
				<span>{item?.label}</span>
			</div>
      {item?.children && <span className="ml-auto">▶</span>}
			{!item?.children && item?.tail && (
				<div className='ml-auto'>{item?.tail}</div>
			)}

      {item.children && submenuOpen && submenuPos?.top != null && submenuPos?.left != null &&
        createPortal(
					<AnimatePresence>
						<motion.div 
							key="submenu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
							style={{
								top: submenuPos?.top || 0,
								left: submenuPos?.left || 0,
							}}
							className='min-w-40 outline-0 origin-top fixed z-200 overflow-hidden
								border border-gray-200 divide-y divide-gray-200 bg-white shadow-lg rounded-2xl'
						>
							{item.children.map((child, idx) => (
								<MenuItem 
									key={idx} 
									item={child}
									isSelected={item?.isSelected}
									parentDirection={submenuPos?.direction} 
								/>
							))}
						</motion.div>
					</AnimatePresence>,
          document.getElementById('portal')
        )}
    </div>
  );
})