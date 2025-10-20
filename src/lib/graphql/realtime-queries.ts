import React from 'react';
import { gql } from 'graphql-tag';
import { useGraphQLQuery, graphqlKeys } from './client';

// Query para obtener mediciones históricas
export const GET_HISTORICAL_MEASUREMENTS = gql`
  query GetHistoricalMeasurements($input: HistoricalQueryInput!) {
    getHistoricalMeasurements(input: $input) {
      dataPoints {
        timestamp
        controllerId
        parameter
        value
        sensorId
      }
      generatedAt
      totalPoints
      filtersApplied {
        startTime
        endTime
        limit
        controllerId
        sensorId
        parameter
      }
    }
  }
`;

// Query para obtener la última medición de un controlador
export const GET_LATEST_MEASUREMENT = gql`
  query GetLatestMeasurement($controllerId: String!) {
    getLatestMeasurement(controllerId: $controllerId) {
      controllerId
      status
      lastChecked
      dataAgeMinutes
      measurement {
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

// Tipos para las mediciones históricas
export interface HistoricalDataPoint {
  timestamp: string;
  controllerId: string;
  parameter: string;
  value: number;
  sensorId: string;
}

export interface HistoricalMeasurementsFilters {
  startTime?: string;
  endTime?: string;
  limit?: number;
  controllerId?: string;
  sensorId?: string;
  parameter?: string;
}

export interface HistoricalQueryInput {
  controllerId: string;
  parameter: string;
  startTime: string;
  endTime: string;
  limit?: number;
}

export interface HistoricalMeasurementsResponse {
  getHistoricalMeasurements: {
    dataPoints: HistoricalDataPoint[];
    generatedAt: string;
    totalPoints: number;
    filtersApplied: HistoricalMeasurementsFilters;
  };
}

// Tipos para la última medición
export interface LatestMeasurement {
  metricName: string;
  value: number;
  unit: string;
  calculatedAt: string;
  controllerId: string;
  description?: string;
}

export interface LatestMeasurementResponse {
  getLatestMeasurement: {
    controllerId: string;
    status: string;
    lastChecked: string;
    dataAgeMinutes: number;
    measurement: LatestMeasurement | null;
  };
}

// Hook para obtener la última medición de un controlador
export function useLatestMeasurement(
  controllerId: string,
  enabled: boolean = false,
  pollingInterval: number = 3000
) {
  return useGraphQLQuery<LatestMeasurementResponse>(
    [...graphqlKeys.all, 'latest-measurement', controllerId],
    GET_LATEST_MEASUREMENT.loc?.source.body || '',
    { controllerId },
    {
      enabled: enabled && !!controllerId,
      staleTime: 0,
      gcTime: 30 * 1000,
      refetchInterval: enabled ? pollingInterval : false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
}

// Hook para obtener mediciones históricas
export function useHistoricalMeasurements(
  input: HistoricalQueryInput,
  enabled: boolean = true
) {
  return useGraphQLQuery<HistoricalMeasurementsResponse>(
    [...graphqlKeys.all, 'historical-measurements', input.controllerId, input.parameter, input.startTime, input.endTime].filter(Boolean),
    GET_HISTORICAL_MEASUREMENTS.loc?.source.body || '',
    { input },
    {
      enabled: enabled && !!input.controllerId && !!input.parameter,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
}

// Hook para monitoreo en tiempo real con múltiples parámetros
export function useRealtimeMonitoring(
  controllerId: string,
  parameters: string[] = ['temperature', 'air_humidity', 'soil_humidity', 'light_intensity'],
  enabled: boolean = false,
  hours: number = 24,
  refreshInterval: number = 5 * 60 * 1000
) {
  // Recalcular las fechas periódicamente
  const [dates, setDates] = React.useState(() => {
    const now = new Date();
    return {
      startTime: new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString(),
      endTime: now.toISOString()
    };
  });

  React.useEffect(() => {
    const updateDates = () => {
      const now = new Date();
      setDates({
        startTime: new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString(),
        endTime: now.toISOString()
      });
    };

    updateDates();
    const interval = setInterval(updateDates, refreshInterval);
    return () => clearInterval(interval);
  }, [hours, refreshInterval]);

  const { startTime, endTime } = dates;

  // Queries para cada parámetro
  const temperatureQuery = useHistoricalMeasurements(
    { controllerId, parameter: 'temperature', startTime, endTime, limit: 50 },
    enabled && parameters.includes('temperature')
  );

  const airHumidityQuery = useHistoricalMeasurements(
    { controllerId, parameter: 'air_humidity', startTime, endTime, limit: 50 },
    enabled && parameters.includes('air_humidity')
  );

  const soilHumidityQuery = useHistoricalMeasurements(
    { controllerId, parameter: 'soil_humidity', startTime, endTime, limit: 50 },
    enabled && parameters.includes('soil_humidity')
  );

  const lightQuery = useHistoricalMeasurements(
    { controllerId, parameter: 'light_intensity', startTime, endTime, limit: 50 },
    enabled && parameters.includes('light_intensity')
  );

  const isLoading = 
    temperatureQuery.isLoading || 
    airHumidityQuery.isLoading || 
    soilHumidityQuery.isLoading || 
    lightQuery.isLoading;

  const hasError = 
    temperatureQuery.error || 
    airHumidityQuery.error || 
    soilHumidityQuery.error || 
    lightQuery.error;

  const combinedData = {
    temperature: temperatureQuery.data?.getHistoricalMeasurements?.dataPoints || [],
    airHumidity: airHumidityQuery.data?.getHistoricalMeasurements?.dataPoints || [],
    soilHumidity: soilHumidityQuery.data?.getHistoricalMeasurements?.dataPoints || [],
    light: lightQuery.data?.getHistoricalMeasurements?.dataPoints || [],
  };

  const latestValues = {
    temperature: combinedData.temperature[combinedData.temperature.length - 1]?.value || 0,
    airHumidity: combinedData.airHumidity[combinedData.airHumidity.length - 1]?.value || 0,
    soilHumidity: combinedData.soilHumidity[combinedData.soilHumidity.length - 1]?.value || 0,
    lightLevel: combinedData.light[combinedData.light.length - 1]?.value || 0,
  };

  const chartData = {
    temperature: combinedData.temperature.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: point.value
    })),
    humidity: combinedData.airHumidity.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: point.value
    })),
    soilHumidity: combinedData.soilHumidity.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: point.value
    })),
    light: combinedData.light.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      value: point.value
    })),
  };

  return {
    data: combinedData,
    chartData,
    latestValues,
    isLoading,
    error: hasError,
    hasTemperatureData: combinedData.temperature.length > 0,
    hasAirHumidityData: combinedData.airHumidity.length > 0,
    hasSoilHumidityData: combinedData.soilHumidity.length > 0,
    hasLightData: combinedData.light.length > 0,
  };
}


