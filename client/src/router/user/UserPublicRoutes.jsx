
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router';
import Loader from '../../components/ui/LoadingFallOff'

const UserPublicRoutes = () => {

  const { user, isLoading } = useSelector(state => state.user);
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  if(isLoading) return <Loader />;

  if(user?.roles?.includes('user')){
    return <Navigate to={redirect} replace />
  }
  
  return <Outlet />;
}


export default UserPublicRoutes