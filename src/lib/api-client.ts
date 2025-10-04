'use client';

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiClientError(
      response.status,
      error.error || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export const api = {
  auth: {
    session: () => apiClient('/api/auth/session'),
    login: (data: { email: string; password: string }) =>
      apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    register: (data: { email: string; password: string; username: string }) =>
      apiClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () =>
      apiClient('/api/auth/logout', {
        method: 'POST',
      }),
  },
  categories: {
    getMany: () => apiClient('/api/categories'),
  },
  products: {
    getOne: (id: string) => apiClient(`/api/products/${id}`),
    getMany: (params?: URLSearchParams) =>
      apiClient(`/api/products?${params?.toString() || ''}`),
  },
  tags: {
    getMany: (params?: URLSearchParams) =>
      apiClient(`/api/tags?${params?.toString() || ''}`),
  },
  tenants: {
    getOne: (slug: string) => apiClient(`/api/tenants/${slug}`),
  },
  checkout: {
    purchase: (data: { productIds: string[]; tenantSlug: string }) =>
      apiClient('/api/checkout/purchase', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getProducts: (productIds: string[]) =>
      apiClient(`/api/checkout/products?productIds=${productIds.join(',')}`),
  },
  library: {
    getOne: (productId: string) => apiClient(`/api/library/${productId}`),
    getMany: (params?: URLSearchParams) =>
      apiClient(`/api/library?${params?.toString() || ''}`),
  },
  reviews: {
    getOne: (productId: string) => apiClient(`/api/reviews/${productId}`),
    create: (data: { productId: string; rating: number; description: string }) =>
      apiClient('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (data: { reviewId: string; rating: number; description: string }) =>
      apiClient('/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
};
