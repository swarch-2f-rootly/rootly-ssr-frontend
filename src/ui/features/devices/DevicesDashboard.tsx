"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Cpu, Activity, Search, Settings, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDevices, useDeleteDevice } from '@/lib/api/devices-api';
import { useAuth } from '@/hooks/useAuth';

export default function DevicesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [deletingDevices, setDeletingDevices] = useState<Set<string>>(new Set());

  // Usar el hook de la API REST real
  const { data: devices = [], isLoading, error } = useDevices();
  const deleteDevice = useDeleteDevice();
  const { user } = useAuth();

  // Filter devices based on search
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = searchTerm === "" ||
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Categorizar dispositivos
  const microcontrollers = filteredDevices.filter(device => device.category === 'microcontroller');
  const sensors = filteredDevices.filter(device => device.category === 'sensor');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!user?.id) {
      setNotification({
        type: 'error',
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Prevent double deletion
    if (deletingDevices.has(deviceId)) {
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar el dispositivo "${deviceName}"?`)) {
      return;
    }

    // Mark device as being deleted
    setDeletingDevices(prev => new Set(prev).add(deviceId));

    try {
      await deleteDevice.mutateAsync({ deviceId, userId: user.id });
      setNotification({
        type: 'success',
        message: `Dispositivo "${deviceName}" eliminado exitosamente`
      });
    } catch (error: any) {
      // Check if it's a 404 error (device already deleted)
      const is404 = error?.status === 404 || (error instanceof Error && error.message.includes('404'));
      
      if (is404) {
        // 404 is expected - device was already deleted
        setNotification({
          type: 'success',
          message: `Dispositivo "${deviceName}" ya fue eliminado`
        });
      } else {
        // Log unexpected errors
        console.error('Error deleting device:', error);
        setNotification({
          type: 'error',
          message: `Error al eliminar el dispositivo "${deviceName}"`
        });
      }
    } finally {
      // Remove device from deleting state
      setDeletingDevices(prev => {
        const newSet = new Set(prev);
        newSet.delete(deviceId);
        return newSet;
      });
    }
  };

  // Effect to show notification when a device is created
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const created = urlParams.get('created');
    const errorParam = urlParams.get('error');
    
    if (created === 'true') {
      setNotification({
        type: 'success',
        message: '¡Dispositivo creado exitosamente!'
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (errorParam === 'true') {
      setNotification({
        type: 'error',
        message: 'Error al crear el dispositivo. Inténtalo de nuevo.'
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return <Cpu className="h-6 w-6 text-blue-600" />;
      case 'sensor':
        return <Activity className="h-6 w-6 text-green-600" />;
      default:
        return <Settings className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDeviceBgColor = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return 'bg-blue-50 border-blue-200';
      case 'sensor':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 pb-16 pt-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Mis Dispositivos
            </h1>
            <p className="text-slate-600 text-base">
              Gestiona tus controladores y sensores del sistema IoT
            </p>
          </div>
          
          {/* Add Device Button */}
          <div className="w-full md:w-auto">
            <Link
              href="/devices/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl rounded-2xl font-normal transition-all duration-300 text-sm justify-center md:justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Dispositivo
            </Link>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center items-center py-12"
          >
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-emerald-700 font-medium">Cargando dispositivos...</span>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          >
            <p className="text-red-700 font-medium">Error al cargar los dispositivos</p>
            <p className="text-red-600 text-sm mt-1">Por favor, intenta de nuevo más tarde</p>
          </motion.div>
        )}

        {/* Content - only show when not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Stats Cards - Microcontroladores y Sensores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col md:flex-row justify-center gap-6 mt-6"
            >
              {/* Microcontrollers Card */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0 shadow-lg rounded-2xl p-6 max-w-xs w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-50 text-xs font-medium">Microcontroladores</p>
                    <p className="text-xl font-bold">{microcontrollers.length}</p>
                  </div>
                  <Cpu className="h-5 w-5 text-blue-100" />
                </div>
              </div>

              {/* Sensors Card */}
              <div className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0 shadow-lg rounded-2xl p-6 max-w-xs w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-50 text-xs font-medium">Sensores</p>
                    <p className="text-xl font-bold">{sensors.length}</p>
                  </div>
                  <Activity className="h-5 w-5 text-green-100" />
                </div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex justify-center mt-6"
            >
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-600" />
                <input
                  placeholder="🔍 Buscar dispositivos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-xl shadow-lg transition-all duration-300 placeholder:text-emerald-600/60"
                />
              </div>
            </motion.div>

            {/* Devices Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-8"
            >
              {/* Microcontrollers Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-800">Controladores</h2>
                </motion.div>

                {microcontrollers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="text-center p-6 bg-white/60 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded-xl"
                  >
                    <Cpu className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <p className="text-blue-600 font-medium">No hay controladores registrados</p>
                    <p className="text-blue-500 text-sm">Agrega tu primer controlador para empezar</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {microcontrollers.map((device, index) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        className={`${getDeviceBgColor(device.category)} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getDeviceIcon(device.category)}
                          </div>
                          <div className="flex gap-1">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                              <Settings className="h-3 w-3" />
                            </button>
                   <button
                     onClick={() => handleDeleteDevice(device.id, device.name)}
                     disabled={deleteDevice.isPending || deletingDevices.has(device.id)}
                     className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Eliminar dispositivo"
                   >
                     {(deleteDevice.isPending || deletingDevices.has(device.id)) ? (
                       <Loader2 className="h-3 w-3 animate-spin" />
                     ) : (
                       <Trash2 className="h-3 w-3" />
                     )}
                   </button>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-semibold text-slate-800 mb-1">{device.name}</h3>
                        <p className="text-slate-600 text-xs mb-2 line-clamp-2">
                          {device.description || 'Sin descripción'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>v{device.version || 'N/A'}</span>
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {device.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sensors Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Activity className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold text-slate-800">Sensores</h2>
                </motion.div>

                {sensors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    className="text-center p-6 bg-white/60 backdrop-blur-sm border-2 border-dashed border-green-300 rounded-xl"
                  >
                    <Activity className="h-10 w-10 text-green-400 mx-auto mb-3" />
                    <p className="text-green-600 font-medium">No hay sensores registrados</p>
                    <p className="text-green-500 text-sm">Agrega tu primer sensor para empezar</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sensors.map((device, index) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        className={`${getDeviceBgColor(device.category)} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getDeviceIcon(device.category)}
                          </div>
                          <div className="flex gap-1">
                            <button className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                              <Settings className="h-3 w-3" />
                            </button>
                   <button
                     onClick={() => handleDeleteDevice(device.id, device.name)}
                     disabled={deleteDevice.isPending || deletingDevices.has(device.id)}
                     className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Eliminar dispositivo"
                   >
                     {(deleteDevice.isPending || deletingDevices.has(device.id)) ? (
                       <Loader2 className="h-3 w-3 animate-spin" />
                     ) : (
                       <Trash2 className="h-3 w-3" />
                     )}
                   </button>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-semibold text-slate-800 mb-1">{device.name}</h3>
                        <p className="text-slate-600 text-xs mb-2 line-clamp-2">
                          {device.description || 'Sin descripción'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>v{device.version || 'N/A'}</span>
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                            {device.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-200' : 'bg-red-200'
              }`}></div>
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
