import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const UserProtectedRoutes = ({children}) => {

  const { user } = useSelector(state => state.user);
  
  if(isLoading) return null

  if(!user || !user.role === 'user'){
    return <Navigate to={'/login'} replace />
  }

  return children
}

export default UserProtectedRoutes