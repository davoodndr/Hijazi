
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router';
import Loader from '../../components/ui/LoadingFallOff'

const UserPublicRoutes = () => {

  const { user, isLoading } = useSelector(state => state.user);

  if(isLoading) return <Loader />;

  if(user?.roles?.includes('user')){
    return <Navigate to={'/'} replace />
  }
  
  return <Outlet />;
}


export default UserPublicRoutes