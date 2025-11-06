import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCartAction, addToWishlistAction, removeFromCartAction, removeFromWishlistAction } from './ApiActions';
import { getCart, getWishlist } from './FetchDatas';


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

export const useAddToCartMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ item })=>{
      const response = await addToCartAction(item);
      return response;
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['cartItems'], (old) => {
        if(!old) return [newItem];

        const exists = old.some(cartItem => cartItem._id === newItem._id);

        if (exists) {
          return old.map(cartItem =>
            cartItem._id === newItem._id ? newItem : cartItem
          );
        } else {
          return [newItem, ...old];
        }
      });
    },
  })
}

export const useRemoveFromCartMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ item_id })=>{
      const response = await removeFromCartAction(item_id);
      return response;
    },
    onSuccess: (removed_id) => {
      queryClient.setQueryData(['wishlist'], (old) => {
        if(!old) return [];
        return old?.filter(item =>  item?._id !== removed_id);
      });
    },
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

export const useAddToWishlistMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ item })=>{
      const response = await addToWishlistAction(item);
      return response;
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['wishlist'], (old) => {
        if(!old) return [newItem];
        return [newItem, ...old];
      });
    },
  })
}

export const useRemoveFromWishlistMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ item_id })=>{
      const response = await removeFromWishlistAction(item_id);
      return response;
    },
    onSuccess: (removed_id) => {
      queryClient.setQueryData(['wishlist'], (old) => {
        if(!old) return [];
        return old?.filter(item =>  item?._id !== removed_id);
      });
    },
  })
}