"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface SensorDataCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  colorClass: string;
  delay: number;
  hasData: boolean;
  onClick?: () => void;
}

const SensorDataCard: React.FC<SensorDataCardProps> = ({
  icon,
  title,
  subtitle,
  value,
  unit,
  colorClass,
  delay,
  hasData,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div 
        className={`
          bg-white/80 backdrop-blur-sm border-2 
          ${colorClass.includes('emerald') ? 'border-emerald-200' : 'border-orange-200'} 
          shadow-xl rounded-xl 
          ${hasData ? 'cursor-pointer hover:shadow-2xl hover:scale-105' : 'opacity-60'}
          transition-all duration-300
        `}
        onClick={hasData ? onClick : undefined}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              {hasData ? (
                <div className="text-4xl font-bold text-slate-800">
                  {title === 'Temperatura' ? value.toFixed(1) : Math.round(value)}{unit}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">Sin información</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    No disponible
                  </span>
                </div>
              )}
            </div>
          </div>
          {hasData && (
            <div className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-500">
              <Info className="h-3 w-3" />
              <span>Click para ver detalles</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SensorDataCard;
