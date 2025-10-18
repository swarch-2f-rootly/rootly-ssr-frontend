"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Sun, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react";

interface PlantChartsProps {
  temperatureData?: Array<{ time: string; value: number }>;
  humidityData?: Array<{ time: string; value: number }>;
  soilHumidityData?: Array<{ time: string; value: number }>;
  lightData?: Array<{ time: string; value: number }>;
  currentData: {
    temperature: number;
    airHumidity: number;
    soilHumidity: number;
    lightLevel: number;
  };
  isLoading?: boolean;
  error?: Error;
}

const PlantCharts: React.FC<PlantChartsProps> = ({ 
  temperatureData = [], 
  humidityData = [], 
  soilHumidityData = [],
  lightData = [], 
  isLoading = false, 
  error 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="mt-16"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mb-2 flex items-center gap-2 justify-center"
            whileHover={{ scale: 1.02 }}
          >
            Análisis Detallado
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
            {!isLoading && !error && <Wifi className="h-5 w-5 text-green-600" />}
            {error && <WifiOff className="h-5 w-5 text-red-600" />}
          </motion.h2>
        </motion.div>

        <motion.p
          className="text-slate-600 text-lg flex items-center gap-2 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {isLoading ? "Cargando datos analíticos..." :
           error ? "Error al cargar datos analíticos" :
           "Monitoreo en tiempo real de todos los parámetros"}
          {error && (
            <span className="text-red-600 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Datos no disponibles
            </span>
          )}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(249, 115, 22, 0.15)"
          }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-slate-800">Temperatura</h3>
          </div>
          {temperatureData && temperatureData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6, fill: '#ea580c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>

        {/* Humidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
          }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Humedad</h3>
          </div>
          {humidityData && humidityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={humidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>

        {/* Soil Humidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.15)"
          }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-slate-800">Humedad Suelo</h3>
          </div>
          {soilHumidityData && soilHumidityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={soilHumidityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>

        {/* Light Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(251, 191, 36, 0.15)"
          }}
          className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-slate-800">Luminosidad</h3>
          </div>
          {lightData && lightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  dot={{ fill: '#eab308', r: 4 }}
                  activeDot={{ r: 6, fill: '#ca8a04' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlantCharts;
