import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const AdminProtectedRoutes = ({children}) => {

  const { user } = useSelector(state => state.user);

  if(isLoading) return null

  if(!user || !user.role === 'admin'){
    return <Navigate to={'/admin/login'} replace />
  }

  return children
}

export default AdminProtectedRoutes