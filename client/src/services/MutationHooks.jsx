import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addBrandAction,
  addCategoryAction,
  blockUserAction,
  changeBrandStatusAction,
  changeCategoryStatusAction,
  changeOfferStatusAction,
  changeProductStatusAction,
  changeReviewStatusAction,
  createOfferAction,
  deleteBrandAction,
  deleteCategoryAction,
  deleteOfferAction,
  deleteUserAction,
  updateBrandAction,
  updateCategoryAction,
  updateOfferAction 
} from './ApiActions';

/* admin side */

// users
export const useblockUserMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ user_id, status })=> {
      const response = await blockUserAction(user_id, status);
      return response
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users'], (oldData) => {
      if (!oldData) return oldData;

      if (!oldData) return oldData;
        return oldData?.map(u =>
          u._id === updatedUser?._id ? { ...u, status: updatedUser?.status } : u
        );
      });
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

//user reviews
export const useHandleReviewStatusMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ review_id, status })=> {
      const response = await changeReviewStatusAction(review_id, status);
      return response
    },
    onSuccess: (updatedReview) => {
      queryClient.setQueryData(['reviews'], (oldData) => {

        if (!oldData) return [];
        return oldData?.map(review =>
          review._id === updatedReview?._id ? { ...review, status: updatedReview?.status } : review
        );
      });
    }
  })
}

// categories
export const useCreateCategoryMutaion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data }) => {
      const response = await addCategoryAction(data);
      return response;
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData(['categories'], (oldData) => {

        if(!oldData) return [newCategory];

        return [newCategory, ...oldData]
      })
    }
  })
}

export const useUpdateCategoryMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await updateCategoryAction(data);
      return response
    },
    onSuccess: (updatedCategory) => {

      queryClient.setQueryData(['categories'], (oldData) => {

        if (!oldData) return [updatedCategory];

        return oldData?.map(category =>
          category._id === updatedCategory?._id ? updatedCategory : category
        );
      });
    }
  })
}

export const useChangeCategoryStatusMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ category_id, status })=> {
      const response = await changeCategoryStatusAction(category_id, status);
      return response
    },
    onSuccess: (updatedCategory) => {

      queryClient.setQueryData(['categories'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(category =>
          category._id === updatedCategory?._id ? { ...category, status: updatedCategory?.status } : category
        );
      });
    }
  })
}

export const useDeleteCategoryMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ folder, category_id })=> {
      const response = await deleteCategoryAction(folder, category_id);
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  })
}

//brand
export const useCreateBrandMutaion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data }) => {
      const response = await addBrandAction(data);
      return response;
    },
    onSuccess: (newBrand) => {
      queryClient.setQueryData(['brands'], (oldData) => {

        if(!oldData) return [newBrand];

        return [newBrand, ...oldData]
      })
    }
  })
}

export const useUpdateBrandMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await updateBrandAction(data);
      return response
    },
    onSuccess: (updatedBrand) => {

      queryClient.setQueryData(['brands'], (oldData) => {

        if (!oldData) return [updatedBrand];

        return oldData?.map(brand =>
          brand._id === updatedBrand?._id ? updatedBrand : brand
        );
      });
    }
  })
}

export const useBrandStatusMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ brand_id, status })=> {
      const response = await changeBrandStatusAction(brand_id, status);
      return response
    },
    onSuccess: (updatedBrand) => {

      queryClient.setQueryData(['brands'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(brand =>
          brand._id === updatedBrand?._id ? { ...brand, status: updatedBrand?.status } : brand
        );
      });
    }
  })
}

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ folder, brand_id }) => {
      const response = await deleteBrandAction(folder, brand_id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['brands']);
    }
  })
}

//products
export const useHandleProductStatusMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ product_id, status })=> {
      const response = await changeProductStatusAction({product_id, status});
      return response
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(product =>
          product._id === updatedProduct?._id ? { ...product, status: updatedProduct?.status } : product
        );
      });
    }
  })
}

export const useHandleProductVisibilityMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ product_id, visibility })=> {
      const response = await changeProductStatusAction({product_id, visibility});
      return response
    },
    onSuccess: (updatedProduct) => {

      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(product =>
          product._id === updatedProduct?._id ? { ...product, visible: updatedProduct?.visible } : product
        );
      });
    }
  })
}

export const useHandleProductArchiveMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ product_id, archived })=> {
      const response = await changeProductStatusAction({product_id, archived});
      return response
    },
    onSuccess: (updatedProduct) => {

      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(product =>
          product._id === updatedProduct?._id ? { ...product, archived: updatedProduct?.archived } : product
        );
      });
    }
  })
}

// offers
export const useCreateOfferMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await createOfferAction(data);
      return response
    },
    onSuccess: (newOffer) => {

      queryClient.setQueryData(['offers'], (oldData) => {

        if (!oldData) return [newOffer];
        const updatedList = [newOffer, ...oldData]
        return updatedList;
      });
    }
  })
}

export const useUpdateOfferMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ data })=> {
      const response = await updateOfferAction(data);
      return response
    },
    onSuccess: (updatedOffer) => {

      queryClient.setQueryData(['offers'], (oldData) => {

        if (!oldData) return [updatedOffer];

        return oldData?.map(offer =>
          offer._id === updatedOffer?._id ? updatedOffer : offer
        );
      });
    }
  })
}

export const useChangeOfferStatusMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ offer_id, status })=> {
      const response = await changeOfferStatusAction(offer_id, status);
      return response
    },
    onSuccess: (updatedOffer) => {

      queryClient.setQueryData(['offers'], (oldData) => {
        if (!oldData) return [];

        return oldData?.map(offer =>
          offer._id === updatedOffer?._id ? { ...offer, status: updatedOffer?.status } : offer
        );
      });
    }
  })
}

export const useDeleteOfferMutation = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ offer_id })=> {
      const response = await deleteOfferAction(offer_id);
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['offers']);
    }
  })
}
