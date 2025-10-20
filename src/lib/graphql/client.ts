import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token') || null;
}

// Helper function to set auth token
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

// Helper function to remove auth token
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

// Query keys for GraphQL
export const graphqlKeys = {
  all: ['graphql'] as const,
};

// Usar el proxy interno de Next.js en lugar del API Gateway directo
const GRAPHQL_ENDPOINT = '/api/graphql';

interface GraphQLQueryOptions<TData = unknown, TVariables = unknown> extends Omit<UseQueryOptions<TData, Error, TData, (string | Record<string, unknown>)[]>, 'queryFn' | 'queryKey'> {
  variables?: TVariables;
}

// Cliente GraphQL para uso en Server Components
// Para Server Components, usar la URL completa del API Gateway
const SERVER_GRAPHQL_ENDPOINT = process.env.API_GATEWAY_URL + '/graphql';
export const serverGraphQLClient = new GraphQLClient(SERVER_GRAPHQL_ENDPOINT);

// Hook para Client Components
export function useGraphQLQuery<TData = unknown, TVariables = unknown>(
  queryKey: (string | Record<string, unknown>)[],
  query: string,
  variables?: TVariables,
  options?: GraphQLQueryOptions<TData, TVariables>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Get JWT token from localStorage or cookies
      const token = getAuthToken();
      
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          window.location.href = '/auth/login';
          throw new Error('Authentication required');
        }
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`);
      }

      return result.data;
    },
    ...options,
  });
}

// Función para Server Components
export async function serverGraphQLRequest<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  try {
    const result = await serverGraphQLClient.request<TData>(query, variables as object);
    return result;
  } catch (error) {
    console.error('Server GraphQL Error:', error);
    throw error;
  }
}
