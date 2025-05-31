
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router';
import Loader from '../../components/ui/LoadingFallOff';

const AdminPublicRoutes = () => {

  const { user, isLoading } = useSelector(state => state.user);
  
  if(isLoading) return <Loader />;

  if(user?.roles.includes('admin')){
    return <Navigate to={'/admin/dashboard'} replace />
  }
  
  return <Outlet />;
}

export default AdminPublicRoutes