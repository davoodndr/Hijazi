
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const PublicRoutes = ({children}) => {

  const { user, isLoading } = useSelector(state => state.user);
  
  if(isLoading) return <div>Loading...</div>;

  if(user?.role === 'user'){
    return <Navigate to={'/'} replace />
  }
  
  return children;
}

export default PublicRoutes