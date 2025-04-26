import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const AdminProtectedRoutes = ({children}) => {

  const { user, isLoading } = useSelector(state => state.user);

  if(isLoading) return null

  if(!user?.roles.includes('admin')){
    return <Navigate to={'/admin/login'} replace />
  }

  return children
}

export default AdminProtectedRoutes