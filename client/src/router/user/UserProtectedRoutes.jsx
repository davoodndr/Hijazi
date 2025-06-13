import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router';
import LoadingFallOff from '../../components/ui/LoadingFallOff';
import { useSelector } from 'react-redux';

const UserProtectedRoutes = () => {

  const location = useLocation();
  const { user, isLoading } = useSelector(state => state.user);
  
  if(isLoading) return <LoadingFallOff />

  if(!user?.roles.includes('user') || user?.status === 'blocked'){
    return <Navigate to={`/login`} replace />
  }
  
  return <Outlet />
}

export default UserProtectedRoutes