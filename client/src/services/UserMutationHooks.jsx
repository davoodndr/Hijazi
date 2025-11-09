import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFundAction, addNewAddressAction, addToCartAction, addToWishlistAction, makeDefaultAddressAction, placeOrderAction, removeAddressAction, removeFromCartAction, removeFromWishlistAction, updateAddressAction, updateUserDetailAction, withdrawFundAction } from './ApiActions';
import { getAddressList, getCart, getOrdersList, getWallet, getWishlist } from './FetchDatas';

// user
export const useUpdateUserMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data }) => {
      const response = await updateUserDetailAction(data);
      return response;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
    }
  })
}

//cart
export const useFetchCartMutation = ()=> {
  const queryClient = useQueryClient();

  return async()=>{
    await queryClient.prefetchQuery({
      queryKey: ['cartItems'],
      queryFn: getCart
    })
    return queryClient.getQueryData(['cartItems']);
  }
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
  return async()=> {
    await queryClient.prefetchQuery({
      queryKey: ['wishlist'],
      queryFn: getWishlist
    })
    return queryClient.getQueryData(['wishlist']);
  }
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

//addresses
export const useFetchAddressMutation = ()=> {
  const queryClient = useQueryClient();
  return async()=> {
    await queryClient.prefetchQuery({
      queryKey: ['addressList'],
      queryFn: getAddressList,
    })
    return queryClient.getQueryData(['addressList']);
  }
}

export const useAddAddressMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await addNewAddressAction(data);
      return response;
    },
    onSuccess: (newAddress) => {
      queryClient.setQueryData(['addressList'], (old) => {
        if(!old) return [newAddress];
        return [newAddress, ...old];
      })
    }
  })
}

export const useUpdateAddressMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await updateAddressAction(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['addressList']);
    }
  })
}

export const useDefaultAddressMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await makeDefaultAddressAction(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['addressList'], (oldData) => {
        
        if(!oldData) return [];

        const { updated, old } = response?.data;

        return oldData?.map(el => {
          if(el?._id === updated?._id){
            return updated;
          }else if(el?._id === old?._id){
            return old;
          }else{
            return el;
          }
        })
      })
    }
  })
}

export const useRemoveAddressMutation = ()=> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ address_id })=> {
      const response = await removeAddressAction(address_id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['addressList'])
    }
  })
}

// wallet
export const useFetchWalletMutation = ()=> {
  const queryClient = useQueryClient();
  return async()=> {
    await queryClient.prefetchQuery({
      queryKey: ['wallet'],
      queryFn: getWallet,
    })
    return queryClient.getQueryData(['wallet']);
  }
}

export const useAddFundMutation = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async({ data })=>{
      const response = await addFundAction(data);
      return response;
    },
    onSuccess: (updates) => {
      queryClient.setQueryData(['wallet'], (old) => {
        if(!old) return {
          balance: updates?.balance,
          transactions: [updates?.transaction]
        }

        return {
          ...old,
          balance: updates?.balance,
          transactions: [updates?.transaction, ...old?.transactions]
        }
      })
    }
  })
}

export const useWithdrawFundMutation = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async({ data })=>{
      const response = await withdrawFundAction(data);
      return response;
    },
    onSuccess: (updates) => {
      queryClient.setQueryData(['wallet'], (old) => {
        if(!old) return {
          balance: updates?.balance,
          transactions: [updates?.transaction]
        }

        return {
          ...old,
          balance: updates?.balance,
          transactions: [updates?.transaction, ...old?.transactions]
        }
      })
    }
  })
}

// orders
export const useFetchOrdersMutation = ()=> {
  const queryClient = useQueryClient();
  return async()=> {
    await queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: getOrdersList,
    })
    return queryClient.getQueryData(['orders']);
  }
}

export const usePlaceOrderMutation = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async({ order })=>{
      const response = await placeOrderAction(order);
      return response;
    },
    onSuccess: (newOrder) => {
      queryClient.setQueryData(['orders'], (old) => {
        if(!old) return [newOrder];
        return [newOrder, ...old];
      })
    }
  })
}