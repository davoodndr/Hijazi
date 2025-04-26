import React from 'react'
import { Navigate, Outlet } from 'react-router';
import LoadingFallOff from '../../components/ui/LoadingFallOff';

const AdminProtectedRoutes = ({user, isLoading}) => {

  if(isLoading) return <LoadingFallOff height={100} />

  if(!user?.roles.includes('admin')){
    return <Navigate to={'/admin/login'} replace />
  }

  return <Outlet />
}

export default AdminProtectedRoutes