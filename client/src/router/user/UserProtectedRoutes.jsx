import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router';
import LoadingFallOff from '../../components/ui/LoadingFallOff';

const UserProtectedRoutes = ({user, isLoading}) => {

  const location = useLocation();
  
  if(isLoading) return <LoadingFallOff height={100} />

  if(!user?.roles.includes('user') || user?.status === 'blocked'){
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  
  return <Outlet />
}

export default UserProtectedRoutes