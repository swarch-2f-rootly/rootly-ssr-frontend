import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantsClient } from './rest-client';

// Plant types
export interface Plant {
  id: string;
  name: string;
  species: string;
  description?: string;
  user_id: string;
  photo_filename?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePlantInput {
  name: string;
  species: string;
  description?: string;
  user_id: string;
  photo_filename?: string;
}

export interface UpdatePlantInput {
  name?: string;
  species?: string;
  description?: string;
  photo_filename?: string;
}

// Query Keys
export const plantsKeys = {
  all: ['plants'] as const,
  lists: () => ['plants', 'list'] as (string | Record<string, unknown>)[],
  list: (filters: Record<string, unknown>) => ['plants', 'list', filters] as (string | Record<string, unknown>)[],
  details: () => ['plants', 'detail'] as (string | Record<string, unknown>)[],
  detail: (id: string) => ['plants', 'detail', id] as (string | Record<string, unknown>)[],
  userPlants: (userId: string) => ['plants', 'user', userId] as (string | Record<string, unknown>)[],
};

// API Functions using REST (similar to original frontend)

/**
 * Get all plants for a specific user
 */
const getUserPlants = async (userId: string): Promise<Plant[]> => {
  return plantsClient.get<Plant[]>(`/api/v1/plants/users/${userId}`);
};

/**
 * Get a specific plant by ID
 */
const getPlant = async (plantId: string): Promise<Plant> => {
  return plantsClient.get<Plant>(`/api/v1/plants/${plantId}`);
};

/**
 * Create a new plant
 */
const createPlant = async (plantData: CreatePlantInput): Promise<Plant> => {
  console.log('🌱 Creating plant - Input data:', plantData);
  
  try {
    const response = await plantsClient.post<Plant>('/api/v1/plants/', plantData);
    console.log('🌱 Plant created successfully:', response);
    return response;
  } catch (error) {
    console.error('🌱 Error creating plant:', error);
    throw error;
  }
};

/**
 * Update an existing plant
 */
const updatePlant = async ({
  plantId,
  plantData
}: {
  plantId: string;
  plantData: UpdatePlantInput;
}): Promise<Plant> => {
  return plantsClient.put<Plant>(`/api/v1/plants/${plantId}`, plantData);
};

/**
 * Delete a plant
 */
const deletePlant = async (plantId: string): Promise<void> => {
  await plantsClient.delete(`/api/v1/plants/${plantId}`);
};

// Query Hooks

/**
 * Hook to get all plants for a user
 */
export const useUserPlants = (userId: string) => {
  return useQuery({
    queryKey: plantsKeys.userPlants(userId),
    queryFn: () => getUserPlants(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to get a specific plant
 */
export const usePlant = (plantId: string) => {
  return useQuery({
    queryKey: plantsKeys.detail(plantId),
    queryFn: () => getPlant(plantId),
    enabled: !!plantId,
  });
};

// Mutation Hooks

/**
 * Hook to create a new plant
 */
export const useCreatePlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlant,
    onMutate: async (newPlantData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        predicate: q => q.queryKey[0] === 'plants' 
      });
      
      // Snapshot the previous value
      const previousPlants = queryClient.getQueryData(
        plantsKeys.userPlants(newPlantData.user_id)
      );
      
      // Optimistically update the cache
      queryClient.setQueryData(
        plantsKeys.userPlants(newPlantData.user_id),
        (old: Plant[] | undefined) => old ? [...old, { ...newPlantData, id: 'temp-' + Date.now() }] : [{ ...newPlantData, id: 'temp-' + Date.now() }]
      );
      
      return { previousPlants };
    },
    onSuccess: (newPlant) => {
      // Update with real server data
      queryClient.setQueryData(plantsKeys.detail(newPlant.id), newPlant);
      console.log('Plant created successfully:', newPlant.name);
    },
    onError: (error, newPlantData, context) => {
      // Rollback on error
      if (context?.previousPlants) {
        queryClient.setQueryData(
          plantsKeys.userPlants(newPlantData.user_id),
          context.previousPlants
        );
      }
      console.error('Error creating plant:', error);
    },
    onSettled: () => {
      // Invalidate all plants queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'plants' 
      });
    },
  });
};

/**
 * Hook to update a plant
 */
export const useUpdatePlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlant,
    onSuccess: (updatedPlant) => {
      // Update the specific plant in cache
      queryClient.setQueryData(
        plantsKeys.detail(updatedPlant.id),
        updatedPlant
      );

      console.log('Plant updated successfully:', updatedPlant.name);
    },
    onError: (error) => {
      console.error('Error updating plant:', error);
    },
    onSettled: () => {
      // Invalidate all plants queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'plants' 
      });
    },
  });
};

/**
 * Hook to delete a plant
 */
export const useDeletePlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlant,
    onSuccess: (_, plantId) => {
      // Remove the plant from cache
      queryClient.removeQueries({
        queryKey: plantsKeys.detail(plantId)
      });

      console.log('Plant deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting plant:', error);
    },
    onSettled: () => {
      // Invalidate all plants queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'plants' 
      });
    },
  });
};