"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';

interface PlantDevicesManagerProps {
  plantId: string;
  plantName: string;
}

const PlantDevicesManager: React.FC<PlantDevicesManagerProps> = ({ plantId, plantName }) => {
  // Mock data - en una app real esto vendría de la API
  const plantDevices = [
    // Sin dispositivos asignados por defecto
  ];

  const microcontrollers = plantDevices.filter(device => device.category === 'microcontroller');
  const sensors = plantDevices.filter(device => device.category === 'sensor');
  const hasDevices = plantDevices.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Dispositivos de {plantName}
            </h3>
            <p className="text-sm text-slate-600">
              Gestiona los microcontroladores y sensores asignados a esta planta
            </p>
          </div>
        </div>

        <Link
          href="/devices/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Asignar Dispositivo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Microcontroladores */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Microcontroladores</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">
            {microcontrollers.length}
          </div>
          <div className="text-xs text-slate-500">
            {microcontrollers.length === 0 ? 'Sin microcontrolador' : `${microcontrollers.length} asignado${microcontrollers.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Sensores */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Sensores</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">
            {sensors.length}
          </div>
          <div className="text-xs text-slate-500">
            {sensors.length === 0 ? 'Sin sensores' : `${sensors.length} asignado${sensors.length > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Estado */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">Estado</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            Inactivo
          </div>
          <div className="text-xs text-slate-500">
            Datos simulados
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasDevices && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-700 mb-2">
            Sin dispositivos asignados
          </h4>
          <p className="text-slate-600 text-sm mb-4">
            Asigna al menos un microcontrolador para que la planta pueda recopilar datos reales.
          </p>
          <Link
            href="/devices/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Asignar Dispositivo
          </Link>
        </div>
      )}

      {/* Device List */}
      {hasDevices && (
        <div className="space-y-3">
          {plantDevices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  device.category === 'microcontroller' ? 'bg-emerald-100' : 'bg-blue-100'
                }`}>
                  {device.category === 'microcontroller' ? (
                    <Cpu className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{device.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{device.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  device.category === 'microcontroller' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {device.category === 'microcontroller' ? 'Controlador' : 'Sensor'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PlantDevicesManager;
