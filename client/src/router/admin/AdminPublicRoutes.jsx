
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';
import Loader from '../../components/ui/LoadingFallOff';

const AdminPublicRoutes = ({children}) => {

  const { user, isLoading } = useSelector(state => state.user);
  
  if(isLoading) return <Loader />;

  if(user?.role === 'admin'){
    return <Navigate to={'/admin/dashboard'} replace />
  }
  
  return children;
}

export default AdminPublicRoutes