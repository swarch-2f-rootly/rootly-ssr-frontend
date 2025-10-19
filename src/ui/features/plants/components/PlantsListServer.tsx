import { serverGraphQLRequest } from '@/lib/graphql/client';
import { GET_PLANTS } from '@/lib/graphql/plants-queries';
import type { PlantsResponse } from '@/lib/graphql/types';
import { PlantsListClient } from './PlantsListClient';

interface PlantsListServerProps {
  userId?: string;
  limit?: number;
}

export async function PlantsListServer({ userId, limit = 10 }: PlantsListServerProps) {
  try {
    // Fetch plants data on the server
    const plantsData = await serverGraphQLRequest<PlantsResponse>(
      GET_PLANTS.loc?.source.body || '',
      {
        filter: {
          user_id: userId,
          limit
        }
      }
    );

    return (
      <PlantsListClient 
        initialData={plantsData}
        userId={userId}
      />
    );
  } catch (error) {
    console.error('Error fetching plants on server:', error);
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">Error al cargar las plantas</p>
        <p className="text-red-600 text-sm mt-1">Por favor, intenta de nuevo más tarde</p>
      </div>
    );
  }
}
