import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleAuthAction, userLoginAction, userLogoutAction } from './ApiActions';

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