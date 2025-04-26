
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';
import Loader from '../../components/ui/LoadingFallOff'

const UserPublicRoutes = ({children}) => {

  const { user, isLoading } = useSelector(state => state.user);
  
  if(isLoading) return <Loader height={70} />;

  if(user?.roles.includes('user')){
    return <Navigate to={'/'} replace />
  }
  
  return children;
}


export default UserPublicRoutes