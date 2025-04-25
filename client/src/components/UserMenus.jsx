import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import menuBanner from "../assets/menu-banner.jpg";
import { menus } from '../services/FetchDatas';

const UserMenus = ({isMobile = false}) => {

  

  const menuRefs = useRef({});

  const [expandedMenu, setExpandedMenu] = useState(null);

  /* for smooth animation on submenu expand - mobile */
  useEffect(() => {
    Object.keys(menuRefs.current).forEach(key => {
      const el = menuRefs.current[key];
      
      if(el){
        el.style.maxHeight = expandedMenu === key ? `${el.scrollHeight}px` : "0px";
      }
    })
  }, [expandedMenu]);

  return (
    <>
      {isMobile ? (
          <ul className="flex flex-col sm:hidden">
            {
              menus && menus.map(menu => 
                <li key={menu.label} className='px-3 py-2 border-b-1 border-neutral-200'>

                  <div className='flex items-center justify-between cursor-pointer' 
                    onClick={() => setExpandedMenu(prev => (prev === menu.label ? null : menu.label))}
                    >
                    <span className='text-base font-semibold capitalize'>{menu.label}</span>

                    {/* expand/collapse arrow */}
                    <div className='p-1'>
                      <IoIosArrowDown className={`transition-transform duration-300
                        ${expandedMenu === menu.label ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                  </div>

                  {menu.submenu && (
                    <ul ref={(el) => {
                      if(el) menuRefs.current[menu.label] = el;
                    }} 
                    className={`overflow-hidden transition-all duration-500 ease-in-out bg-white`}
                    >
                      {menu.submenu.map(sub => 
                        <li key={sub.label} className='pl-3 py-1.5 text-sm capitalize'>{sub.label}</li>
                      )}
                    </ul>
                  )}
                </li>
              )
            }
          </ul>
        ): (
          <ul className="hidden sm:flex flex-row items-center pl-6 w-full h-full">
            
            {
              menus && menus.map(menu => 
                <li key={menu.label} className='nav-menu-item h-full inline-flex flex-col items-center justify-center 
                  w-[18%] text-base font-bold relative'>

                  <span className='capitalize'>{menu.label}</span>
                  <div className="menu-indicator w-full h-[3px] bg-primary-300"></div>

                  {menu.submenu && (
                    <ul className={`nav-menu-list absolute top-[calc(100%+3px)] left-1/2 -translate-x-1/2 bg-white 
                      cursor-default inline-grid grid-flow-col auto-cols-max font-normal text-sm
                      shadow-lg border border-primary-300 rounded-md overflow-hidden`}>

                      {menu.submenu.map(sub => 
                        <li key={sub.label} className='flex flex-col min-w-25 w-auto pb-4'>
                          <span className='whitespace-nowrap capitalize font-semibold mb-2 px-5 pt-4'>{sub.label}</span>

                          {sub.items && (
                            <ul>
                              {sub.items.map(item => (
                                <li key={item} className='truncate capitalize py-1 px-5 hover:text-black
                                  hover:bg-primary-25 cursor-pointer transition-colors duration-300'>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                        </li>
                      )}

                      {menu.label === 'categories' && <li className='w-75 m-1.5 rounded-sm overflow-hidden relative'>
                        <img src={menuBanner} alt="menu-banner" />
                        <div className='absolute left-6 top-1/2 -translate-y-1/2 h-full flex flex-col'>
                          <span className='text-lg mt-6'>HOT DEALS</span>
                          <span className='text-3xl mt-4'>Don't Miss</span>
                          <span className='text-2xl font-bold'>Trending</span>
                          <button className='px-5! w-fit rounded-3xl! mt-7'>Shop Now</button>
                        </div>
                        <div className='absolute right-8 top-9 inline-flex flex-col items-center bg-amber-400 
                          leading-5 rounded-full p-3 text-xl text-black -rotate-12'>
                          <span>35%</span>
                          <span>Off</span>
                        </div>
                      </li>}

                    </ul>
                  )}

                </li>
              )
            }
            
          </ul>
        )
      }
    </>
  )
}

export default UserMenus