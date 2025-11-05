import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import AxiosToast from "../utils/AxiosToast";
import { logoutUser, setUser } from "../store/slices/UsersSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { clearCart, setCartItems } from "../store/slices/CartSlice";
import { clearWishlist, setWishlist } from "../store/slices/WishlistSlice";
import { useFetchCartMutation, useFetchWishlistMutation } from "./UserMutationHooks";
import { useGoogleAuthMutation, useUserLogoutMutation } from "./AuthMutationHooks";

export const useLogout = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect' || '/')
  const logoutMutation = useUserLogoutMutation();

  const logout = async() => {
    try {
    
      const response = await logoutMutation.mutateAsync();
  
      if(response?.data?.success){
        dispatch(logoutUser());
        localStorage.clear();
        dispatch(clearCart());
        dispatch(clearWishlist())
        AxiosToast(response, false);
        navigate(redirect)
      }
  
    } catch (error) {
      console.log(error)
      AxiosToast(error);
    }
  }

  return logout;
}

export const useGoogleAuth = (role = 'user') => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleAuthMutation = useGoogleAuthMutation();
  const cartMutation = useFetchCartMutation();
  const wishlistMutation = useFetchWishlistMutation();

  const goodleLogin = useGoogleLogin({
  
      flow: 'auth-code',
      onSuccess: async(tokenResponse) => {
  
        try {

          const response = await googleAuthMutation.mutateAsync({ tokenResponse, role })
  
          if(response?.data?.success){
              
            localStorage.setItem('accessToken',response?.data?.accessToken);
            localStorage.setItem('refreshToken',response?.data?.refreshToken);
  
            const userData = response?.data?.user;
            const cartItems = await cartMutation.mutateAsync();
            const wishlist = await wishlistMutation.mutateAsync();
  
            dispatch(setUser(userData));
            dispatch(setCartItems(cartItems))
            dispatch(setWishlist(wishlist))

            AxiosToast(response, false);
            navigate('/');
          }
  
        } catch (error) {
          console.log(error)
          AxiosToast(error)
        }
  
      }
    })

  return goodleLogin;
}