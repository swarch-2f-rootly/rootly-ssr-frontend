import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlantsDashboard from '@/ui/features/plants/PlantsDashboard';

// Mock del hook de autenticación
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'test@example.com' }
  })
}));

// Mock del hook de plantas
jest.mock('@/lib/api/plants-api', () => ({
  useUserPlants: jest.fn()
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

describe('PlantsDashboard Component', () => {
  const mockUseUserPlants = require('@/lib/api/plants-api').useUserPlants;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseUserPlants.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Cargando plantas...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseUserPlants.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch plants')
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Error al cargar las plantas')).toBeInTheDocument();
  });

  it('should render plants list', () => {
    const mockPlants = {
      plants: [
        {
          id: '1',
          name: 'Test Plant 1',
          species: 'Species 1',
          user_id: 'user-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Test Plant 2',
          species: 'Species 2',
          user_id: 'user-1',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    };

    mockUseUserPlants.mockReturnValue({
      data: mockPlants,
      isLoading: false,
      error: null
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Test Plant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Plant 2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total count
  });

  it('should filter plants by search term', () => {
    const mockPlants = {
      plants: [
        {
          id: '1',
          name: 'Tomato Plant',
          species: 'Solanum lycopersicum',
          user_id: 'user-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Rose Plant',
          species: 'Rosa',
          user_id: 'user-1',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    };

    mockUseUserPlants.mockReturnValue({
      data: mockPlants,
      isLoading: false,
      error: null
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText('🔍 Buscar plantas...');
    fireEvent.change(searchInput, { target: { value: 'tomato' } });

    expect(screen.getByText('Tomato Plant')).toBeInTheDocument();
    expect(screen.queryByText('Rose Plant')).not.toBeInTheDocument();
  });

  it('should show empty state when no plants match search', () => {
    const mockPlants = {
      plants: [
        {
          id: '1',
          name: 'Tomato Plant',
          species: 'Solanum lycopersicum',
          user_id: 'user-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    };

    mockUseUserPlants.mockReturnValue({
      data: mockPlants,
      isLoading: false,
      error: null
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText('🔍 Buscar plantas...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No se encontraron plantas')).toBeInTheDocument();
  });

  it('should render Nueva Planta button', () => {
    mockUseUserPlants.mockReturnValue({
      data: { plants: [], total: 0, page: 1, limit: 10 },
      isLoading: false,
      error: null
    });

    render(<PlantsDashboard />, { wrapper: createWrapper() });

    const newPlantButton = screen.getByText('Nueva Planta');
    expect(newPlantButton).toBeInTheDocument();
    expect(newPlantButton.closest('a')).toHaveAttribute('href', '/monitoring/new');
  });
});
