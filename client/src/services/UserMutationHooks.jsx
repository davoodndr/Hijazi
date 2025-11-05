import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleAuthAction, userLoginAction, userLogoutAction } from './ApiActions';
import { getCart, getWishlist } from './FetchDatas';

//user
export const useUserLoginMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=>{
      const response = await userLoginAction(data);
      return response;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
    }
  })
}

export const useGoogleAuthMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ tokenResponse, role })=>{
      const response = await googleAuthAction(tokenResponse, role);
      return response;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
    }
  })
}

export const useUserLogoutMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async()=>{
      const response = await userLogoutAction();
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    }
  })
}

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