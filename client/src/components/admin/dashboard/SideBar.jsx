import React, { useState } from "react";

import { Link, useLocation } from "react-router";
import logo from '../../../assets/logo.svg'
import { FaChevronLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import clsx from "clsx";
import { AnimatePresence, motion } from 'motion/react'

export const Sidebar = ({menuItems}) => {

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation()

  const path = location.pathname;
  const current = menuItems.find(item => path.includes(item.href)) || menuItems[0]
  
  const [selected, setSelected] = useState(current);

  const handleSelect = (item) => {
    setSelected(item)
  }

  return (
    <aside className={`h-screen bg-white border-r border-gray-200 
      smooth ease-in-out ${ collapsed ? "w-16" : "w-64" }`}>

      <div className={clsx("flex items-center h-20 border-b border-gray-200 smooth ease-in-out relative",
        collapsed ? 'justify-center' : 'justify-between pr-2'
      )}>
        <div
          className={clsx('smooth absolute inset-0 top-1/2 -translate-y-1/2 w-20',collapsed ? 'scale-0 mx-0' : "mx-5 scale-100")}
        >
          <img src={logo} alt="logo" className="object-contain" />
        </div>

        <div 
          onClick={() => setCollapsed(!collapsed)}
          className={clsx("absolute smooth",
            collapsed ? 'right-1/2 translate-x-1/2' : 'right-2'
          )}
        >
          <div className="relative rounded-lg hover:bg-primary-50 smooth cursor-pointer w-10 h-10">
            <AnimatePresence>
              {collapsed ?
                (<motion.span
                  key="menu-icon"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center origin-center"
                >
                  <IoMenu size={28} className="origin-center" />
                </motion.span>)
                :
                (<motion.span
                  key="chevron-icon"
                  initial={{ opacity: 0, rotate: -135 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -135 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center origin-center"
                >
                  <FaChevronLeft size={15} className="origin-center" />
                </motion.span>)
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
      <nav className="bg-primary-50 h-full">
        
        {
          menuItems.map(item => (
            <div
              onClick={() => handleSelect(item)}
              key={item.label}
              className="relative"
            >
              {item === selected && (
                <motion.div
                  layoutId="highlightArrow"
                  className={clsx("absolute -right-2.75 top-1/2 -translate-y-1/2 flex items-center",
                    collapsed && '-right-3.5'
                  )}
                >
                  <span className="w-5 h-5 rotate-45 bg-white inline-flex"></span>
                </motion.div>
              )}
              <Link to={item.href} 
                className={clsx(`flex items-center px-5.25 text-gray-700 h-11 smooth`,
                item === selected ? "bg-primary-300/20 text-primary-400" : 'hover:px-8 hover:bg-primary-25 hover:text-primary-400'
              )}>

                <span>{<item.icon size={20} />}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="ml-3 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

              </Link>
              <span></span>
            </div>
          ))
        }
      </nav>
    </aside>
  )

};
