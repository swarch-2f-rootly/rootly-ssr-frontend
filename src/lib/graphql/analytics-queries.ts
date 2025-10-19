import { gql } from 'graphql-tag';
import { useGraphQLQuery } from './client';
import type {
  SupportedMetricsResponse,
  AnalyticsHealthResponse,
  SingleMetricReportResponse,
  MultiMetricReportResponse,
  TrendAnalysisResponse,
  AnalyticsFilterInput,
  MultiMetricReportInput,
  TrendAnalysisInput
} from './types';

// GraphQL Queries para Analytics
export const GET_SUPPORTED_METRICS = gql`
  query GetSupportedMetrics {
    getSupportedMetrics
  }
`;

export const GET_ANALYTICS_HEALTH = gql`
  query GetAnalyticsHealth {
    getAnalyticsHealth {
      status
      service
      influxdb
      influxdbUrl
      timestamp
    }
  }
`;

export const GET_SINGLE_METRIC_REPORT = gql`
  query GetSingleMetricReport(
    $metricName: String!
    $controllerId: String!
    $filters: AnalyticsFilterInput
  ) {
    getSingleMetricReport(
      metricName: $metricName
      controllerId: $controllerId
      filters: $filters
    ) {
      controllerId
      generatedAt
      dataPointsCount
      metrics {
        metricName
        value
        unit
        calculatedAt
        controllerId
        description
      }
    }
  }
`;

export const GET_MULTI_METRIC_REPORT = gql`
  query GetMultiMetricReport($input: MultiMetricReportInput!) {
    getMultiMetricReport(input: $input) {
      generatedAt
      totalControllers
      totalMetrics
      reports {
        controllerId
        dataPointsCount
        generatedAt
        metrics {
          metricName
          value
          unit
          calculatedAt
          controllerId
          description
        }
      }
    }
  }
`;

export const GET_TREND_ANALYSIS = gql`
  query GetTrendAnalysis($input: TrendAnalysisInput!) {
    getTrendAnalysis(input: $input) {
      metricName
      controllerId
      interval
      generatedAt
      totalPoints
      averageValue
      minValue
      maxValue
      dataPoints {
        timestamp
        value
        interval
      }
    }
  }
`;

// React Hooks que integran con TanStack Query

/**
 * Hook para obtener métricas soportadas
 */
export function useSupportedMetrics() {
  return useGraphQLQuery<SupportedMetricsResponse>(
    ['analytics', 'supported-metrics'],
    GET_SUPPORTED_METRICS.loc?.source.body || '',
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    }
  );
}

/**
 * Hook para verificar el estado de salud del servicio de analytics
 */
export function useAnalyticsHealth() {
  return useGraphQLQuery<AnalyticsHealthResponse>(
    ['analytics', 'health'],
    GET_ANALYTICS_HEALTH.loc?.source.body || '',
    undefined,
    {
      staleTime: 30 * 1000, // 30 segundos
      gcTime: 5 * 60 * 1000, // 5 minutos
      refetchInterval: 60 * 1000, // Refetch cada minuto
    }
  );
}

/**
 * Hook para obtener reporte de una sola métrica
 */
export function useSingleMetricReport(
  metricName: string,
  controllerId: string,
  filters?: AnalyticsFilterInput
) {
  const queryKey = ['analytics', 'single-metric', metricName, controllerId, filters].filter(Boolean);

  return useGraphQLQuery<SingleMetricReportResponse>(
    queryKey as (string | Record<string, unknown>)[],
    GET_SINGLE_METRIC_REPORT.loc?.source.body || '',
    { metricName, controllerId, filters },
    {
      enabled: !!metricName && !!controllerId,
      staleTime: 2 * 60 * 1000, // 2 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    }
  );
}

/**
 * Hook para obtener reporte multi-métrica
 */
export function useMultiMetricReport(input: MultiMetricReportInput, options?: { enabled?: boolean }) {
  const queryKey = [
    'analytics',
    'multi-metric',
    input.controllers.sort().join(','),
    input.metrics.sort().join(','),
    input.filters
  ].filter(Boolean);

  return useGraphQLQuery<MultiMetricReportResponse>(
    queryKey as (string | Record<string, unknown>)[],
    GET_MULTI_METRIC_REPORT.loc?.source.body || '',
    { input },
    {
      enabled: (input.controllers.length > 0 && input.metrics.length > 0) && (options?.enabled !== false),
      staleTime: 2 * 60 * 1000, // 2 minutos - datos no se consideran stale
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché
      refetchInterval: false, // NO refetch automático
      refetchOnWindowFocus: false, // NO refetch al enfocar ventana  
      refetchOnReconnect: false, // NO refetch al reconectar
    }
  );
}

/**
 * Hook para obtener análisis de tendencias
 */
export function useTrendAnalysis(input: TrendAnalysisInput) {
  const queryKey = [
    'analytics',
    'trend',
    input.metricName,
    input.controllerId,
    input.startTime,
    input.endTime,
    input.interval
  ].filter(Boolean);

  return useGraphQLQuery<TrendAnalysisResponse>(
    queryKey as (string | Record<string, unknown>)[],
    GET_TREND_ANALYSIS.loc?.source.body || '',
    { input },
    {
      enabled: !!input.metricName && !!input.controllerId && !!input.startTime && !!input.endTime,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
    }
  );
}


