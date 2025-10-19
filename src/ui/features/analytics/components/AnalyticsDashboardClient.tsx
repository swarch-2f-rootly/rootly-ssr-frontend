"use client";

import { motion } from 'framer-motion';
import { Activity, TrendingUp, BarChart3, CheckCircle } from 'lucide-react';
import type { AnalyticsHealthResponse, SupportedMetricsResponse } from '@/lib/graphql/types';

interface AnalyticsDashboardClientProps {
  initialHealthData: AnalyticsHealthResponse;
  initialMetricsData: SupportedMetricsResponse;
  controllerId?: string;
}

export function AnalyticsDashboardClient({ 
  initialHealthData, 
  initialMetricsData, 
  controllerId 
}: AnalyticsDashboardClientProps) {
  const health = initialHealthData.getAnalyticsHealth;
  const metrics = initialMetricsData.getSupportedMetrics;

  return (
    <div className="space-y-6">
      {/* Health Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Estado del Sistema</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className={`h-5 w-5 ${health.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="font-semibold capitalize">{health.status}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Servicio</p>
              <p className="font-semibold">{health.service}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <TrendingUp className={`h-5 w-5 ${health.influxdb === 'connected' ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <p className="text-sm text-gray-600">InfluxDB</p>
              <p className="font-semibold capitalize">{health.influxdb}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="font-semibold text-xs">
                {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Métricas Disponibles</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <p className="text-sm font-medium text-emerald-800 capitalize">
                {metric.replace(/_/g, ' ')}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {metrics.length} métricas disponibles para monitoreo
          </p>
        </div>
      </motion.div>

      {/* Controller Info */}
      {controllerId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Controlador Activo</h2>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <span className="font-medium">ID del Controlador:</span> {controllerId}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Este controlador está configurado para recopilar datos de las métricas disponibles.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
