"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Pause } from 'lucide-react';
import { AuthenticatedImage } from '@/ui/components/AuthenticatedImage';

interface PlantStatusCardProps {
  plant: {
    id: string;
    name: string;
    photo_filename?: string;
  } | null;
  isMonitoring: boolean;
  hasMicrocontroller: boolean;
  currentData: {
    sensorId: string;
    temperature: number;
    airHumidity: number;
    soilHumidity: number;
    lightLevel: number;
  };
  isClient: boolean;
  onToggleMonitoring: () => void;
}

const PlantStatusCard: React.FC<PlantStatusCardProps> = ({
  plant,
  isMonitoring,
  hasMicrocontroller,
  currentData,
  isClient,
  onToggleMonitoring,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 shadow-xl rounded-xl">
      <div className="p-6">
        <h3 className="text-center text-emerald-700 font-semibold mb-4">
          Estado de la Planta
        </h3>
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            animate={isMonitoring ? {
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            } : {}}
            transition={{
              duration: 4,
              repeat: isMonitoring ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl organic-shape overflow-hidden">
              {plant.photo_filename ? (
                <AuthenticatedImage
                  src={`/api/plants/${plant.id}/photo`}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {isMonitoring && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Activity className="w-4 h-4 text-white animate-pulse" />
              </motion.div>
            )}
          </motion.div>

          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-1">
              {plant.name}
            </h4>
            <p className="text-sm text-slate-600 mb-2">
              {plant.species}
            </p>
            {isMonitoring && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Monitoreando
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Última actualización: {isClient ? currentData.timestamp : "--:--:--"}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Cpu className={`w-4 h-4 ${hasMicrocontroller ? 'text-slate-500' : 'text-amber-500'}`} />
              <p className={`text-sm font-mono ${
                hasMicrocontroller
                  ? 'text-slate-600'
                  : 'text-amber-600'
              }`}>
                {currentData.sensorId}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onToggleMonitoring}
              disabled={!hasMicrocontroller}
              className={`${isMonitoring
                ? 'bg-red-500 hover:bg-red-600'
                : hasMicrocontroller
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-slate-400 cursor-not-allowed'
              } text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-medium flex items-center gap-2 text-sm ${!hasMicrocontroller ? 'opacity-60' : ''}`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar Monitoreo
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Sin Hardware
                </>
              )}
            </button>
          </div>

          {/* Warning message when no hardware */}
          {!hasMicrocontroller && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-amber-700 font-medium text-sm">Falta implementación física</span>
              </div>
              <p className="text-amber-600 text-xs">
                Asigna un microcontrolador para recibir datos reales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantStatusCard;
