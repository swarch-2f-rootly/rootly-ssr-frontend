import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devicesClient } from './rest-client';
import type { Device, CreateDeviceInput, UpdateDeviceInput } from '../graphql/types';

// Query keys for devices
export const devicesKeys = {
  all: ['devices'] as const,
  lists: () => ['devices', 'list'] as const,
  list: (filters: Record<string, unknown>) => ['devices', 'list', filters] as const,
  details: () => ['devices', 'detail'] as const,
  detail: (id: string) => ['devices', 'detail', id] as const,
  plantDevices: (plantId: string) => ['devices', 'plant', plantId] as const,
};

// Get all devices
export function useDevices() {
  return useQuery({
    queryKey: devicesKeys.lists(),
    queryFn: () => devicesClient.get<Device[]>('/api/v1/devices'),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Get plant devices
export function usePlantDevices(plantId: string) {
  return useQuery({
    queryKey: devicesKeys.plantDevices(plantId),
    queryFn: () => devicesClient.get<Device[]>(`/api/v1/devices?plant_id=${plantId}`),
    enabled: !!plantId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Get single device
export function useDevice(deviceId: string) {
  return useQuery({
    queryKey: devicesKeys.detail(deviceId),
    queryFn: () => devicesClient.get<Device>(`/api/v1/devices/${deviceId}`),
    enabled: !!deviceId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Create device mutation
export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeviceInput) => 
      devicesClient.post<Device>('/api/v1/devices', data),
    onMutate: async (newDeviceData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
      
      // Snapshot the previous value
      const previousDevices = queryClient.getQueryData(devicesKeys.lists());
      
      // Optimistically update the cache
      queryClient.setQueryData(devicesKeys.lists(), old => 
        old ? [...old, { ...newDeviceData, id: 'temp-' + Date.now() }] : [newDeviceData]
      );
      
      return { previousDevices };
    },
    onSuccess: (newDevice) => {
      // Update with real server data
      queryClient.setQueryData(devicesKeys.detail(newDevice.id), newDevice);
    },
    onError: (error, newDeviceData, context) => {
      // Rollback on error
      if (context?.previousDevices) {
        queryClient.setQueryData(devicesKeys.lists(), context.previousDevices);
      }
    },
    onSettled: () => {
      // Invalidate all devices queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
    },
  });
}

// Update device mutation
export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceInput }) => 
      devicesClient.put<Device>(`/api/v1/devices/${id}`, data),
    onSuccess: (updatedDevice) => {
      // Update the device in cache
      queryClient.setQueryData(devicesKeys.detail(updatedDevice.id), updatedDevice);
    },
    onSettled: () => {
      // Invalidate all devices queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
    },
  });
}

// Delete device mutation
export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: string) => 
      devicesClient.delete<{ success: boolean; message: string }>(`/api/v1/devices/${deviceId}`),
    onSuccess: (_, deviceId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: devicesKeys.detail(deviceId) });
    },
    onSettled: () => {
      // Invalidate all devices queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
    },
  });
}

// Assign device to plant mutation
export function useAssignDeviceToPlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, plantId }: { deviceId: string; plantId: string }) => 
      devicesClient.post<{ success: boolean; message: string }>(`/api/v1/devices/${deviceId}/assign`, { plant_id: plantId }),
    onSettled: () => {
      // Invalidate all devices queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
    },
  });
}

// Remove device from plant mutation
export function useRemoveDeviceFromPlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, plantId }: { deviceId: string; plantId: string }) => 
      devicesClient.post<{ success: boolean; message: string }>(`/api/v1/devices/${deviceId}/unassign`, { plant_id: plantId }),
    onSettled: () => {
      // Invalidate all devices queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'devices' 
      });
    },
  });
}


