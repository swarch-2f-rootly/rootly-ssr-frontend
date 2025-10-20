"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlantDevices, useAssignDeviceToPlant, useRemoveDeviceFromPlant } from '@/lib/api/plant-devices-api';
import { useDevices } from '@/lib/api/devices-api';
import {
  Cpu,
  Activity,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface PlantDevicesManagerProps {
  plantId: string;
  plantName: string;
}

const PlantDevicesManager: React.FC<PlantDevicesManagerProps> = ({ plantId, plantName }) => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // API hooks
  const { data: allDevices = [], isLoading: devicesLoading } = useDevices();
  const { data: plantDevices = [], isLoading: plantDevicesLoading } = usePlantDevices(plantId);
  const assignDeviceMutation = useAssignDeviceToPlant();
  const removeDeviceMutation = useRemoveDeviceFromPlant();

  // Filtrar dispositivos disponibles (no asignados a esta planta)
  const availableDevices = allDevices.filter(device =>
    !plantDevices.some(plantDevice => plantDevice.id === device.id)
  );

  // Categorizar dispositivos
  const microcontrollers = plantDevices.filter(device => device.category === 'microcontroller');
  const sensors = plantDevices.filter(device => device.category === 'sensor');

  const handleAssignDevice = async () => {
    if (!selectedDeviceId) return;

    try {
      await assignDeviceMutation.mutateAsync({ plantId, deviceId: selectedDeviceId });
      setSelectedDeviceId('');
      setShowAssignForm(false);
    } catch (error) {
      console.error('Error assigning device:', error);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres desasignar este dispositivo de la planta?')) {
      return;
    }

    try {
      await removeDeviceMutation.mutateAsync({ plantId, deviceId });
    } catch (error) {
      console.error('Error removing device:', error);
    }
  };

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return <Cpu className="w-5 h-5" />;
      case 'sensor':
        return <Activity className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getDeviceColor = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sensor':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (devicesLoading || plantDevicesLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-emerald-700 font-medium">Cargando dispositivos...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-600" />
            </div>
            Dispositivos de {plantName}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Gestiona los microcontroladores y sensores asignados a esta planta
          </p>
        </div>

        <button
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Asignar Dispositivo</span>
        </button>
      </div>

      {/* Assign Device Form */}
      {showAssignForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
        >
          <h4 className="font-semibold text-blue-800 mb-3">Asignar Nuevo Dispositivo</h4>
          <div className="flex gap-3">
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Seleccionar dispositivo...</option>
              {availableDevices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.category}) - {device.version || 'Sin versión'}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignDevice}
              disabled={!selectedDeviceId || assignDeviceMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignDeviceMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Asignar</span>
            </button>

            <button
              onClick={() => {
                setShowAssignForm(false);
                setSelectedDeviceId('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Cancelar</span>
            </button>
          </div>

          {availableDevices.length === 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 text-sm">
                No hay dispositivos disponibles para asignar. Crea nuevos dispositivos primero.
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-semibold text-slate-800">Microcontroladores</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{microcontrollers.length}</div>
          <div className="text-sm text-emerald-600 font-medium">
            {microcontrollers.length === 0 ? 'Sin microcontrolador' :
             microcontrollers.length === 1 ? 'Conectado' : 'Múltiples'}
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <span className="font-semibold text-slate-800">Sensores</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{sensors.length}</div>
          <div className="text-sm text-teal-600 font-medium">
            {sensors.length === 0 ? 'Sin sensores' : 'Conectados'}
          </div>
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="font-semibold text-slate-800">Estado</span>
          </div>
          <div className={`text-lg font-bold ${microcontrollers.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {microcontrollers.length > 0 ? 'Activo' : 'Inactivo'}
          </div>
          <div className="text-sm text-slate-600 font-medium">
            {microcontrollers.length > 0 ? 'Datos disponibles' : 'Datos simulados'}
          </div>
        </div>
      </div>

      {/* Devices List */}
      {plantDevices.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-600 mb-2">Sin dispositivos asignados</h4>
          <p className="text-slate-500 mb-4">
            Asigna al menos un microcontrolador para que la planta pueda recopilar datos reales.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Microcontrollers */}
          {microcontrollers.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Microcontroladores ({microcontrollers.length})
              </h4>
              <div className="space-y-2">
                {microcontrollers.map(device => (
                  <div key={device.id} className={`flex items-center justify-between p-3 border-2 rounded-lg ${getDeviceColor(device.category)}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {getDeviceIcon(device.category)}
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm opacity-75">
                          {device.version && `v${device.version}`} • {device.description || 'Sin descripción'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      disabled={removeDeviceMutation.isPending}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Desasignar dispositivo"
                    >
                      {removeDeviceMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sensors */}
          {sensors.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Sensores ({sensors.length})
              </h4>
              <div className="space-y-2">
                {sensors.map(device => (
                  <div key={device.id} className={`flex items-center justify-between p-3 border-2 rounded-lg ${getDeviceColor(device.category)}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {getDeviceIcon(device.category)}
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm opacity-75">
                          {device.version && `v${device.version}`} • {device.description || 'Sin descripción'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      disabled={removeDeviceMutation.isPending}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Desasignar dispositivo"
                    >
                      {removeDeviceMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PlantDevicesManager;
