import React, { useEffect, useState } from 'react'
import PageTitleComponent from './pageComponents/PageTitleComponent'
import BreadcrumpsComponent from './pageComponents/BreadcrumpsComponent'
import { Outlet, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { dataBank } from './pageComponents/LayoutConstants'
import { getEffectivePrice } from '../../utils/Utils'
import { setAllUsers } from '../../store/slices/UsersSlice'

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
  const dispatch = useDispatch();
  const path = location?.pathname?.split('/').pop();
  const entity = entityToSliceMap[path] || path;

  const dataFromRedux = useSelector(state => state[entity]);

  const [data, setData] = useState(null);
  const [action, setAction] = useState(null);

  /* initial data loader */
  useEffect(()=> {
    
    setData(null);

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

  },[path, dataFromRedux])

  const setupData = (list) => {
//    console.log(list)
    const sorted = [...list]?.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    if(path === 'users'){
      return sorted?.map(user => {
        return {
          ...user,
          name: user?.fullname || user?.username,
          mobile: user?.mobile || "",
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
  

  const handleChildReturn = (values)=>{
    setData({
      ...data,
      list: values
    })
    dispatch(setAllUsers(values))
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

      <Outlet
        key={path}
        context={{
          data,
          action
        }}
      />
      
    </section>
  )
}

export default PageLayout