import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devicesClient } from './rest-client';
import type { Device } from '../graphql/types';

// Query keys
export const plantDevicesKeys = {
  all: ['plantDevices'] as const,
  byPlant: (plantId: string) => ['plantDevices', 'plant', plantId] as const,
};

// API Functions

/**
 * Get all devices assigned to a plant
 */
const getPlantDevices = async (plantId: string): Promise<Device[]> => {
  return devicesClient.get<Device[]>(`/api/plants/${plantId}/devices`);
};

/**
 * Assign a device to a plant
 */
const assignDeviceToPlant = async ({ plantId, deviceId }: { plantId: string; deviceId: string }): Promise<void> => {
  return devicesClient.post<void>(`/api/plants/${plantId}/devices/${deviceId}`, {});
};

/**
 * Remove a device from a plant
 */
const removeDeviceFromPlant = async ({ plantId, deviceId }: { plantId: string; deviceId: string }): Promise<void> => {
  return devicesClient.delete<void>(`/api/plants/${plantId}/devices/${deviceId}`);
};

// Query Hooks

/**
 * Hook to get all devices assigned to a plant
 */
export const usePlantDevices = (plantId: string) => {
  return useQuery({
    queryKey: plantDevicesKeys.byPlant(plantId),
    queryFn: () => getPlantDevices(plantId),
    enabled: !!plantId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Mutation Hooks

/**
 * Hook to assign a device to a plant
 */
export const useAssignDeviceToPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDeviceToPlant,
    onSuccess: (_, { plantId }) => {
      // Invalidate plant devices query
      queryClient.invalidateQueries({
        queryKey: plantDevicesKeys.byPlant(plantId),
      });
      // Also invalidate devices list
      queryClient.invalidateQueries({
        predicate: q => q.queryKey[0] === 'devices',
      });
    },
  });
};

/**
 * Hook to remove a device from a plant
 */
export const useRemoveDeviceFromPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeDeviceFromPlant,
    onSuccess: (_, { plantId }) => {
      // Invalidate plant devices query
      queryClient.invalidateQueries({
        queryKey: plantDevicesKeys.byPlant(plantId),
      });
      // Also invalidate devices list
      queryClient.invalidateQueries({
        predicate: q => q.queryKey[0] === 'devices',
      });
    },
  });
};


