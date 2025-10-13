import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockUserAction, deleteUserAction } from './ApiActions';

/* admin side */

// users
export const useblockUserMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ user_id, status })=> {
      const response = await blockUserAction(user_id, status);
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  })
}

export const useDeleteUserMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ user_id })=> {
      const response = await deleteUserAction('users', user_id);
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  })
}