import { useMemo } from 'react';
import { useMultiMetricReport, useTrendAnalysis } from './analytics-queries';
import type { MultiMetricReportInput, TrendAnalysisInput } from './types';

// Hook personalizado para obtener datos de planta para gráficos
export function usePlantChartData(controllerId: string) {
  const multiMetricInput: MultiMetricReportInput = useMemo(() => ({
    controllers: controllerId ? [controllerId] : [],
    metrics: ['temperature', 'air_humidity', 'soil_humidity', 'light_intensity'],
    filters: {
      limit: 100,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
    }
  }), [controllerId]);

  const shouldExecuteQuery = !!controllerId && controllerId.length > 0;

  const { data: multiMetricData, isLoading, error } = useMultiMetricReport(multiMetricInput, {
    enabled: shouldExecuteQuery,
    staleTime: 5 * 60 * 1000, // 5 minutos - no refetch tan seguido
    gcTime: 10 * 60 * 1000,   // 10 minutos en caché
  });

  // Transformar los datos al formato esperado por PlantCharts
  const chartData = useMemo(() => {
    if (!multiMetricData?.getMultiMetricReport?.reports?.[0]?.metrics) {
      return [];
    }

    const report = multiMetricData.getMultiMetricReport.reports[0];
    const metricsByTime: Record<string, {
      time: string;
      temperature: number | null;
      humidity: number | null;
      soilHumidity: number | null;
      lightLevel: number | null;
    }> = {};

    report.metrics.forEach(metric => {
      const time = new Date(metric.calculatedAt).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      if (!metricsByTime[time]) {
        metricsByTime[time] = {
          time,
          temperature: null,
          humidity: null,
          soilHumidity: null,
          lightLevel: null,
        };
      }

      switch (metric.metricName) {
        case 'temperature':
          metricsByTime[time].temperature = metric.value;
          break;
        case 'air_humidity':
          metricsByTime[time].humidity = metric.value;
          break;
        case 'soil_humidity':
          metricsByTime[time].soilHumidity = metric.value;
          break;
        case 'light_intensity':
          metricsByTime[time].lightLevel = metric.value;
          break;
      }
    });

    const dataArray = Object.values(metricsByTime)
      .filter((entry) => entry.temperature !== null || entry.humidity !== null)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-20);

    return dataArray;
  }, [multiMetricData]);

  const currentData = useMemo(() => {
    if (!chartData.length) {
      return {
        temperature: 0,
        airHumidity: 0,
        lightLevel: 0,
      };
    }

    const latest = chartData[chartData.length - 1];
    return {
      temperature: latest.temperature || 0,
      airHumidity: latest.humidity || 0,
      lightLevel: latest.lightLevel || 0,
    };
  }, [chartData]);

  const allMetrics = useMemo(() => {
    if (!multiMetricData?.getMultiMetricReport?.reports?.[0]?.metrics) {
      return [];
    }
    return multiMetricData.getMultiMetricReport.reports[0].metrics;
  }, [multiMetricData]);

  const getMetricAverage = (metricType: string) => {
    const avgMetric = allMetrics.find(m => 
      m.metricName.includes(metricType) && m.metricName.includes('average')
    );
    return avgMetric?.value || null;
  };

  const hasTemperature = allMetrics.some(m => m.metricName.includes('temperature'));
  const hasHumidity = allMetrics.some(m => m.metricName.includes('air_humidity'));
  const hasSoilHumidity = allMetrics.some(m => m.metricName.includes('soil_humidity'));
  const hasLight = allMetrics.some(m => m.metricName.includes('light_intensity'));

  return {
    chartData,
    currentData,
    isLoading,
    error,
    hasData: chartData.length > 0,
    allMetrics,
    getMetricAverage,
    hasTemperature,
    hasHumidity,
    hasSoilHumidity,
    hasLight,
  };
}

// Hook para análisis de tendencias de una métrica específica
export function usePlantMetricTrend(
  plantId: string,
  metricName: string,
  hours: number = 24
) {
  const trendInput: TrendAnalysisInput = useMemo(() => ({
    metricName,
    controllerId: plantId,
    startTime: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
    endTime: new Date().toISOString(),
    interval: '1h',
  }), [metricName, plantId, hours]);

  const { data, isLoading, error } = useTrendAnalysis(trendInput);

  const trendData = useMemo(() => {
    if (!data?.getTrendAnalysis?.dataPoints) {
      return [];
    }

    return data.getTrendAnalysis.dataPoints.map(point => ({
      time: new Date(point.timestamp).toLocaleString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      }),
      value: point.value,
    }));
  }, [data]);

  return {
    trendData,
    summary: data?.getTrendAnalysis ? {
      average: data.getTrendAnalysis.averageValue,
      min: data.getTrendAnalysis.minValue,
      max: data.getTrendAnalysis.maxValue,
      totalPoints: data.getTrendAnalysis.totalPoints,
    } : null,
    isLoading,
    error,
  };
}


