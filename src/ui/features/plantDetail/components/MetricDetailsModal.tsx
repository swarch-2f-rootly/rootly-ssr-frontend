"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MetricData {
  metricName: string;
  value: number;
  unit: string;
  calculatedAt: string;
  controllerId: string;
  description?: string | null;
}

interface MetricDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'temperature' | 'air_humidity' | 'soil_humidity' | 'light_intensity';
  metrics: MetricData[];
  title: string;
  icon: React.ReactNode;
}

const MetricDetailsModal: React.FC<MetricDetailsModalProps> = ({
  isOpen,
  onClose,
  metricType,
  metrics,
  title,
  icon
}) => {
  // Filtrar métricas por tipo
  const relevantMetrics = metrics.filter(m => m.metricName.includes(metricType));

  // Extraer métricas específicas
  const average = relevantMetrics.find(m => m.metricName.includes('average'));
  const minimum = relevantMetrics.find(m => m.metricName.includes('minimum'));
  const maximum = relevantMetrics.find(m => m.metricName.includes('maximum'));
  const stdDev = relevantMetrics.find(m => m.metricName.includes('std_deviation'));
  const trend = relevantMetrics.find(m => m.metricName.includes('trend'));

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'temperature': return 'from-orange-500 to-red-500';
      case 'air_humidity': return 'from-blue-500 to-cyan-500';
      case 'soil_humidity': return 'from-red-500 to-orange-500';
      case 'light_intensity': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)} ${unit}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getMetricColor(metricType)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {icon}
                    <div>
                      <h2 className="text-2xl font-bold">{title}</h2>
                      <p className="text-white/80 text-sm">Análisis Detallado</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Métricas principales */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Promedio */}
                  {average && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-700">Promedio</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatValue(average.value, average.unit)}
                      </p>
                    </motion.div>
                  )}

                  {/* Mínimo */}
                  {minimum && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-slate-700">Mínimo</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatValue(minimum.value, minimum.unit)}
                      </p>
                    </motion.div>
                  )}

                  {/* Máximo */}
                  {maximum && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-slate-700">Máximo</h3>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {formatValue(maximum.value, maximum.unit)}
                      </p>
                    </motion.div>
                  )}

                  {/* Desviación Estándar */}
                  {stdDev && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-slate-700">Desviación</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatValue(stdDev.value, stdDev.unit)}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Tendencia */}
                {trend && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl mb-6"
                  >
                    <h3 className="font-semibold text-slate-700 mb-2">Tendencia</h3>
                    <div className="flex items-center gap-2">
                      {trend.value > 0 ? (
                        <>
                          <TrendingUp className="h-6 w-6 text-green-600" />
                          <span className="text-lg text-green-600 font-semibold">Ascendente</span>
                        </>
                      ) : trend.value < 0 ? (
                        <>
                          <TrendingDown className="h-6 w-6 text-red-600" />
                          <span className="text-lg text-red-600 font-semibold">Descendente</span>
                        </>
                      ) : (
                        <>
                          <Activity className="h-6 w-6 text-gray-600" />
                          <span className="text-lg text-gray-600 font-semibold">Estable</span>
                        </>
                      )}
                      <span className="text-slate-600 ml-2">
                        ({formatValue(Math.abs(trend.value), trend.unit)})
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Todas las métricas */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Todas las métricas ({relevantMetrics.length})
                  </h3>
                  <div className="space-y-2">
                    {relevantMetrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="bg-slate-50 p-3 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 capitalize">
                            {metric.metricName.replace(/_/g, ' ')}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {formatValue(metric.value, metric.unit)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(metric.calculatedAt).toLocaleString('es-ES')}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MetricDetailsModal;


