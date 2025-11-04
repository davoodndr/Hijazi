import React from 'react'
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import Loader from '../../components/ui/LoadingFallOff';

const AdminProtectedRoutes = () => {

  const { user, isLoading } = useSelector(state => state.user);

  if(isLoading) return <Loader loading={isLoading} />;

  if(!user?.roles?.includes('admin') || user?.status === 'blocked'){
    return <Navigate to={'/admin/login'} replace />
  }

  return <Outlet />
}

export default AdminProtectedRoutes