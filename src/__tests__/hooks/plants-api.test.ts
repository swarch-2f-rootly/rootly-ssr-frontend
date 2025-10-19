import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserPlants, usePlants, usePlant } from '@/lib/api/plants-api';

// Mock del cliente GraphQL
jest.mock('@/lib/graphql/client', () => ({
  useGraphQLQuery: jest.fn()
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Plants API Hooks', () => {
  const mockUseGraphQLQuery = require('@/lib/graphql/client').useGraphQLQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUserPlants', () => {
    it('should fetch user plants successfully', () => {
      const mockData = {
        plants: [
          {
            id: '1',
            name: 'Test Plant',
            species: 'Test Species',
            user_id: 'user-1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      mockUseGraphQLQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null
      });

      const { result } = renderHook(() => useUserPlants('user-1'), {
        wrapper: createWrapper()
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading state', () => {
      mockUseGraphQLQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null
      });

      const { result } = renderHook(() => useUserPlants('user-1'), {
        wrapper: createWrapper()
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockError = new Error('Failed to fetch plants');

      mockUseGraphQLQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError
      });

      const { result } = renderHook(() => useUserPlants('user-1'), {
        wrapper: createWrapper()
      });

      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('usePlants', () => {
    it('should fetch all plants successfully', () => {
      const mockData = {
        plants: [
          {
            id: '1',
            name: 'Plant 1',
            species: 'Species 1',
            user_id: 'user-1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };

      mockUseGraphQLQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null
      });

      const { result } = renderHook(() => usePlants(), {
        wrapper: createWrapper()
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('usePlant', () => {
    it('should fetch single plant successfully', () => {
      const mockData = {
        plant: {
          id: '1',
          name: 'Test Plant',
          species: 'Test Species',
          user_id: 'user-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      mockUseGraphQLQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null
      });

      const { result } = renderHook(() => usePlant('1'), {
        wrapper: createWrapper()
      });

      expect(result.current.data).toEqual(mockData);
    });
  });
});