"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Calendar, Clock } from 'lucide-react';

interface PlantInfoCardProps {
  plant: any;
  isClient: boolean;
}

const PlantInfoCard: React.FC<PlantInfoCardProps> = ({ plant, isClient }) => {
  // Calcular la fecha de registro formateada
  const registrationDate = plant?.created_at 
    ? new Date(plant.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No disponible';

  // Calcular la edad en el sistema
  const calculateAge = () => {
    if (!plant?.created_at) return 'No disponible';
    
    const createdDate = new Date(plant.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return '1 día';
    if (diffDays < 30) return `${diffDays} días`;
    
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    
    if (months === 1 && remainingDays === 0) return '1 mes';
    if (remainingDays === 0) return `${months} meses`;
    if (months === 1) return `1 mes y ${remainingDays} días`;
    return `${months} meses y ${remainingDays} días`;
  };

  const age = isClient ? calculateAge() : 'Cargando...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-gradient-to-br from-teal-800 to-emerald-900 border-2 border-teal-700 shadow-xl rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-semibold text-lg">Información de la Planta</h3>
      </div>

      <div className="space-y-4">
        {/* Especie */}
        <div className="flex items-center gap-4 py-3 border-b border-teal-700/50">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-teal-300 text-sm">Especie</p>
            <p className="text-white font-semibold text-base">
              {plant?.species || 'Tomate'}
            </p>
          </div>
        </div>

        {/* Fecha de registro */}
        <div className="flex items-center gap-4 py-3 border-b border-teal-700/50">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-teal-300 text-sm">Fecha de registro</p>
            <p className="text-white font-semibold text-base">
              {registrationDate}
            </p>
          </div>
        </div>

        {/* Edad en el sistema */}
        <div className="flex items-center gap-4 py-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-teal-300 text-sm">Edad en el sistema</p>
            <p className="text-white font-semibold text-base">
              {age}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantInfoCard;
