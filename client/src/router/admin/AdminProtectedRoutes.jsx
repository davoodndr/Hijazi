import React from 'react'
import { Navigate, Outlet } from 'react-router';
import LoadingFallOff from '../../components/ui/LoadingFallOff';
import { useSelector } from 'react-redux';

const AdminProtectedRoutes = () => {

  const { user, isLoading } = useSelector(state => state.user);

  if(isLoading) return <LoadingFallOff />

  if(!user?.roles.includes('admin') || user?.status === 'blocked'){
    return <Navigate to={'/admin/login'} replace />
  }

  return <Outlet />
}

export default AdminProtectedRoutes