import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantsClient } from './rest-client';

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  profile_photo_url?: string;
  is_active?: boolean;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
}

// Query Keys
export const usersKeys = {
  all: ['users'] as const,
  details: () => ['users', 'detail'] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

// API Functions

/**
 * Register a new user
 */
const registerUser = async (userData: RegisterUserInput): Promise<User> => {
  return plantsClient.post<User>('/api/users', userData);
};

/**
 * Get a specific user by ID
 */
const getUser = async (userId: string): Promise<User> => {
  return plantsClient.get<User>(`/api/users/${userId}`);
};

/**
 * Update an existing user
 */
const updateUser = async ({
  userId,
  userData
}: {
  userId: string;
  userData: UpdateUserInput;
}): Promise<User> => {
  return plantsClient.put<User>(`/api/users/${userId}`, userData);
};

/**
 * Delete a user
 */
const deleteUser = async (userId: string): Promise<void> => {
  await plantsClient.delete(`/api/users/${userId}`);
};

/**
 * Upload user photo
 */
const uploadUserPhoto = async ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/users/${userId}/photo`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload photo: ${errorText}`);
  }

  return response.json();
};

/**
 * Delete user photo
 */
const deleteUserPhoto = async (userId: string): Promise<void> => {
  await plantsClient.delete(`/api/users/${userId}/photo`);
};

// Query Hooks

/**
 * Hook to get a specific user
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

// Mutation Hooks

/**
 * Hook to register a new user
 */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (newUser) => {
      console.log('User registered successfully:', newUser.email);
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        usersKeys.detail(updatedUser.id),
        updatedUser
      );

      // Update user in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === updatedUser.id) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      console.log('User updated successfully:', updatedUser.email);
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
    onSettled: () => {
      // Invalidate all users queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'users' 
      });
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      // Remove the user from cache
      queryClient.removeQueries({
        queryKey: usersKeys.detail(userId)
      });

      console.log('User deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
    },
    onSettled: () => {
      // Invalidate all users queries
      queryClient.invalidateQueries({ 
        predicate: q => q.queryKey[0] === 'users' 
      });
    },
  });
};

/**
 * Hook to upload user photo
 */
export const useUploadUserPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadUserPhoto,
    onSuccess: (_, { userId }) => {
      // Invalidate user query to refetch with new photo
      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(userId)
      });

      console.log('User photo uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading user photo:', error);
    },
  });
};

/**
 * Hook to delete user photo
 */
export const useDeleteUserPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserPhoto,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors (photo already deleted)
      if (error?.status === 404 || (error instanceof Error && error.message.includes('404'))) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    onSuccess: (_, userId) => {
      // Invalidate user query to refetch without photo
      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(userId)
      });

      console.log('User photo deleted successfully');
    },
    onError: (error: any) => {
      // Don't log 404 errors as they're expected
      if (error?.status !== 404 && !(error instanceof Error && error.message.includes('404'))) {
        console.error('Error deleting user photo:', error);
      }
    },
  });
};

