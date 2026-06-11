import { API_BASE_URL } from '@/constants/api.constants';
import type { ApiResponse } from '@/types/api.types';

export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiError(json.message || 'API request failed', response.status);
  }

  return json;
}

export const apiClient = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body?: unknown) =>
            request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown) =>
            request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
