import { serverGraphQLRequest } from '@/lib/graphql/client';
import { GET_ANALYTICS_HEALTH, GET_SUPPORTED_METRICS } from '@/lib/graphql/analytics-queries';
import type { AnalyticsHealthResponse, SupportedMetricsResponse } from '@/lib/graphql/types';
import { AnalyticsDashboardClient } from './AnalyticsDashboardClient';

interface AnalyticsDashboardServerProps {
  controllerId?: string;
}

export async function AnalyticsDashboardServer({ controllerId }: AnalyticsDashboardServerProps) {
  try {
    // Fetch analytics data on the server
    const [healthData, metricsData] = await Promise.all([
      serverGraphQLRequest<AnalyticsHealthResponse>(
        GET_ANALYTICS_HEALTH.loc?.source.body || ''
      ),
      serverGraphQLRequest<SupportedMetricsResponse>(
        GET_SUPPORTED_METRICS.loc?.source.body || ''
      )
    ]);

    return (
      <AnalyticsDashboardClient 
        initialHealthData={healthData}
        initialMetricsData={metricsData}
        controllerId={controllerId}
      />
    );
  } catch (error) {
    console.error('Error fetching analytics on server:', error);
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">Error al cargar los datos de analytics</p>
        <p className="text-red-600 text-sm mt-1">Por favor, intenta de nuevo más tarde</p>
      </div>
    );
  }
}
