import React, { useEffect, useState } from 'react'
import PageTitleComponent from './pageComponents/PageTitleComponent'
import BreadcrumpsComponent from './pageComponents/BreadcrumpsComponent'
import { Outlet, useLocation } from 'react-router'
import SearchFilterComponent from './pageComponents/SearchFilterComponent'
import { useSelector } from 'react-redux'
import TableHeaderComponent from './pageComponents/TableHeaderComponent'
import { dataBank } from './pageComponents/LayoutConstants'
import { getEffectivePrice } from '../../utils/Utils'
import clsx from 'clsx'

const entityToSliceMap = {
  users: 'user',
};

const reduxSliceMap = {
  orders: 'ordersList',
  products: 'items',
  offers: 'offersList',
  categories: 'categoryList',
  brands: 'brandList',
};

function PageLayout() {

  const location = useLocation();
  const path = location?.pathname?.split('/').pop();
  const entity = entityToSliceMap[path] || path;

  const dataFromRedux = useSelector(state => state[entity]);

  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [filter, setFilter] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentSort, setCurrentSort] = useState(null);
  const [action, setAction] = useState(null);
  const [showTable, setShowTable] = useState(true);

  /* initial data loader */
  useEffect(()=> {
    
    resetFields();

    const dataPath = Object.keys(dataBank).find(key => key === path);
    if(dataPath && dataPath === path){
      const listPath = reduxSliceMap[path]
      const newPath = listPath || path;
      
      const updatedData = {
        ...dataBank[path],
        list: setupData(dataFromRedux[newPath])
      }
      setData(updatedData);
    }else{
      setData(null)
    }

    if(path === 'brands'){
      setShowTable(false)
    }else{
      setShowTable(true)
    }

  },[path, dataFromRedux])

  const setupData = (list) => {
    const sorted = [...list]?.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
//console.log(sorted?.[0])
    if(path === 'users'){
      return sorted?.map(user => {
        return {
          ...user,
          join: new Date(user?.createdAt),
          last_login: user?.last_login ? new Date(user?.last_login) : null
        }
      })
    }else if(path === 'reviews'){

      return sorted?.map(review => {

        return {
          ...review,
          user_name: review?.user_id?.fullname || review?.user_id?.username,
          product_name: review?.product_id?.name,
          category_name: review?.product_id?.category?.name
        }
      })
    }else if(path === 'products'){
      return sorted?.map(product => {
      
        let stock = 0;
                  
        if(product?.variants?.length){
          product?.variants?.forEach(item => {
            stock += item.stock;
          })
        } else {
          stock = product?.stock;
        }
        
        return {
          ...product,
          category_name: product?.category?.name,
          effective_price: getEffectivePrice(product),
          effective_stock: stock,
          variant_count: product?.variants?.length || 0,
          parent_category: product?.category?.parentId?.name || null
        }
      })
    }else if(path === 'categories'){
      return sorted?.map(cat  => {
        return {
          ...cat,
          parent_name: cat?.parentId?.name || ''
        }
      })
    }
    
    return sorted
  }
  
  /* filter */
  const handleOnFilter = (filtered) => {
    setFilteredData(filtered?.list)
    setFilter(filtered?.filter)
  }

  /* sort */
  const [sortedData, setSortedData] = useState([]);
  const handleOnSort = (sorted) => {
    setSortedData(sorted?.list);
    setCurrentSort(sorted?.currentSort);
  }

  const resetFields = ()=> {
    setSearchQuery(null);
    setFilter({});
    setFilteredData([]);
    setCurrentSort(null);
    setData(null);
  }
  
  return (
    <section className='flex flex-col p-6'>

      {/* page title & add user button */}
      <PageTitleComponent
        title={data?.title}
        subTitle={data?.subTitle}
        listType={data?.entity}
        showStrength
        strength={data?.list?.length}
        actions={data?.actions}
        onAction={(activeAction)=> {
          setAction(activeAction)
          setTimeout(() => setAction(null), 0); // reset after triggering
        }}
      />

      {/* beadcrumps */}
      <BreadcrumpsComponent listType={path} />

      {/* search, filter, sort*/}
      <SearchFilterComponent
        key={path}
        currentFilter={filter}
        data={data}
        onSearch={(value)=> setSearchQuery(value)}
        onFilter={handleOnFilter}
        currentSort={currentSort}
        sortMenus={data?.sortMenus}
        onSort={handleOnSort}
      />

      {/* content wrapper */}
      <div className={clsx("flex flex-col w-full",
        showTable && 'rounded-3xl shade border border-theme-divider'
      )}>

        {/* data table header with quick sort facility */}
        {showTable && (
          <TableHeaderComponent
            headers={data?.headers}
            centerHeaders={data?.centerHeaders}
            filteredData={filteredData}
            currentSort={currentSort}
            gridCols={data?.gridCols}
            onSort={handleOnSort}
          />
        )}

        {/* table contents */}
        <Outlet 
          context={{
            list: sortedData,
            searchQuery: searchQuery,
            filter: filter,
            gridCols: data?.gridCols,
            action
          }}
        />

      </div>
      
    </section>
  )
}

export default PageLayout