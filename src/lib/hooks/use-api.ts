'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DEFAULT_LIMIT } from '@/constants';

export function useSession(options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: api.auth.session,
    ...options,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.getMany,
  });
}

export function useProduct(id: string, enabled = true) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.products.getOne(id),
    enabled,
  });
}

export function useProducts(params?: Record<string, any>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });
  }
  
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.products.getMany(searchParams),
  });
}

export function useInfiniteProducts(params?: Record<string, any>) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams();
      searchParams.set('cursor', String(pageParam));
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              searchParams.set(key, value.join(','));
            } else {
              searchParams.set(key, String(value));
            }
          }
        });
      }
      return api.products.getMany(searchParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => 
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
}

export function useTenant(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['tenants', slug],
    queryFn: () => api.tenants.getOne(slug),
    enabled,
  });
}

export function useLibraryProduct(productId: string, enabled = true) {
  return useQuery({
    queryKey: ['library', productId],
    queryFn: () => api.library.getOne(productId),
    enabled,
  });
}

export function useInfiniteLibrary() {
  return useInfiniteQuery({
    queryKey: ['library', 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams();
      searchParams.set('cursor', String(pageParam));
      searchParams.set('limit', String(DEFAULT_LIMIT));
      return api.library.getMany(searchParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => 
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
}

export function useReview(productId: string, enabled = true) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => api.reviews.getOne(productId),
    enabled,
  });
}

export function useCheckoutProducts(productIds: string[], enabled = true) {
  return useQuery({
    queryKey: ['checkout', 'products', productIds],
    queryFn: () => api.checkout.getProducts(productIds),
    enabled: enabled && productIds.length > 0,
  });
}

export function useCreateReview(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.reviews.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    ...options,
  });
}

export function useUpdateReview(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.reviews.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    ...options,
  });
}

export function usePurchase(options?: UseMutationOptions<any, any, any>) {
  return useMutation({
    mutationFn: api.checkout.purchase,
    ...options,
  });
}
