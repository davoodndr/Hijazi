import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router';
import LoadingFallOff from '../../components/ui/LoadingFallOff';

const UserProtectedRoutes = ({user, isLoading}) => {

  
  if(isLoading) return <LoadingFallOff height={100} />

  if(!user?.roles.includes('user') || user?.status === 'blocked'){
    return <Navigate to={'/login'} replace />
  }
  
  return <Outlet />
}

export default UserProtectedRoutes