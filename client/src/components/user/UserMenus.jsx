import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import menuBanner from "../../assets/menu-banner.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'
import { setActiveFilter } from '../../store/slices/ProductSlices'

const UserMenus = ({isMobile = false}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRefs = useRef({});
  const mobileMenuRefs = useRef({});
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [menuLeftVal, setMenuLeftVal] = useState(null);
  const { categoryList } = useSelector(state => state.categories);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(getCategoriesMenu())
  },[categoryList])

  const getCategoriesMenu = () => {
    
    let cats = [];
    if(categoryList?.length){
      for(const category of categoryList){

        if (!category?.parentId) {
          cats.push({
            id: category?._id,
            label: category?.name,
            href: '',
            items: []
          });
        }
        if (category?.parentId?._id) {
          const parentIndex = cats.findIndex(c => c.id === category?.parentId?._id);
          if (parentIndex !== -1) {
            cats[parentIndex]?.items?.push({id: category._id, name: category?.name});
          }
        }
      }
    }

    return cats
  }


  const menus = [
    {label: 'home', href: '/'},
    {label: 'about', href: ''},
    {label: 'shop', href: '',
      submenu: categories /* [
        {
          id: 'clothing',
          label: 'clothing',
          href: '',
          items: [
            'Men Formals', 'Men Casuals',
            'Woman Formals', 'Woman Casuals'
          ]
        },
        {
          id: 'foot wears',
          label: 'foot wears',
          href: '',
          items: [
            'slips','shoes','lightweight','washable'
          ]
        },
      ] */
    },
    {label: 'policies', href: ''},
    {label: 'contact', href: ''},
  ]

  /* menu position handling */
  useEffect(() => {
    const submenu = menuRefs?.current['shop'];
    if (!submenu) return;
    
    const rect = submenu.getBoundingClientRect();
    
    const overflowLeft = Math.min(0, rect.left);
    
    let shift = 0;

    if (overflowLeft < 0) {
      shift = -overflowLeft + 8;
      setMenuLeftVal(shift)
    }
    
  }, [menus]);

  /* for smooth animation on submenu expand - mobile */
  useEffect(() => {
    Object.keys(mobileMenuRefs.current).forEach(key => {
      const el = mobileMenuRefs.current[key];
      
      if(el){
        el.style.maxHeight = expandedMenu === key ? `${el.scrollHeight}px` : "0px";
      }
    })
  }, [expandedMenu]);

  /* handleing menu item click */
  const handleCategorySelect = (menu) => {
    if(menuRefs?.current['shop']){
      menuRefs?.current?.['shop'].classList?.remove('show')
    }
    navigate('/collections')
    dispatch(setActiveFilter(menu))
  }

  return (
    <>
      {isMobile ? (
          <ul className="flex flex-col sm:hidden">
            {
              menus && menus.map(menu => 
                <li key={menu.label} className='px-3 py-2 border-b border-neutral-200'>

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
                      if(el) mobileMenuRefs.current[menu.label] = el;
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
              menus && menus?.map(menu => 
                <li 
                  key={menu.label}
                  onMouseEnter={() => {
                    if(menu?.label === 'shop'){
                      menuRefs?.current?.[menu?.label].classList?.add('show')
                    }
                  }}
                  onMouseLeave={() => {
                    if(menu?.label === 'shop'){
                      menuRefs?.current?.[menu?.label].classList?.remove('show')
                    }
                  }}
                  className='nav-menu-item h-full inline-flex flex-col items-center justify-center 
                  w-[18%] text-base font-bold relative'
                >

                  <span className='capitalize'>{menu?.label}</span>
                  <div className="menu-indicator w-full h-[3px] bg-primary-300"></div>

                  {menu?.submenu && (
                    <ul
                      ref={el => (menuRefs.current[menu?.label] = el)}
                      style={{ 
                        '--trans-x': `${menuLeftVal}px` 
                      }}
                      className={`hidden-div absolute top-[calc(100%+3px)] translate-x-(--trans-x) bg-white smooth 
                      cursor-default inline-grid grid-flow-col auto-cols-max font-normal text-sm
                      shadow-lg border border-primary-300 rounded-md overflow-hidden`}
                    >

                      {menu?.submenu?.map(sub => 
                        <li 
                          key={sub?.label} 
                          className='flex flex-col min-w-25 w-auto py-2'
                        >
                          <span
                            onClick={()=> handleCategorySelect({id: sub?.id, name: sub?.label})} 
                            className='whitespace-nowrap capitalize font-semibold px-5 py-1 
                            cursor-pointer smooth hover:text-primary-400'
                          >{sub?.label}</span>

                          {sub.items && (
                            <ul>
                              {sub.items.map(item => (
                                <li 
                                  key={item?.id}
                                  onClick={()=> handleCategorySelect({id: item?.id, name: item?.name})} 
                                  className='truncate capitalize py-1 px-5 hover:text-black
                                  hover:bg-primary-25 cursor-pointer transition-colors duration-300'>
                                  {item?.name}
                                </li>
                              ))}
                            </ul>
                          )}

                        </li>
                      )}

                      {menu.label === 'shop' && <li className='w-75 m-1.5 rounded-sm overflow-hidden relative'>
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