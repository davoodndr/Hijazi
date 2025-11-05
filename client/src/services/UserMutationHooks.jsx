import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleAuthAction, userLoginAction, userLogoutAction } from './ApiActions';
import { getCart, getWishlist } from './FetchDatas';

//user


//cart
export const useFetchCartMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async()=>{
      const response = await getCart();
      return response;
    },
    onSuccess: (cartItems) => {
      queryClient.setQueryData(['cartItems'], cartItems);
    }
  })
}

//wishlist
export const useFetchWishlistMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async()=>{
      const response = await getWishlist();
      return response;
    },
    onSuccess: (wishlist) => {
      queryClient.setQueryData(['wishlist'], wishlist);
    }
  })
}