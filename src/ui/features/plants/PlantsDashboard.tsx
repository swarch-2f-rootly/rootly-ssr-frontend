"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUserPlants } from '@/lib/api/plants-api';
import type { Plant } from '@/lib/api/plants-api';
import { useAuth } from '@/hooks/useAuth';
import { AuthenticatedImage } from '@/ui/components/AuthenticatedImage';


export default function PlantsDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Usar el hook de la API REST real
  const { data: plants = [], isLoading, error } = useUserPlants(user?.id || '');
  
  // Debug: log plant data
  React.useEffect(() => {
    if (plants.length > 0) {
      console.log('Plants data:', plants);
      plants.forEach(plant => {
        console.log(`Plant ${plant.id}:`, {
          name: plant.name,
          photo_filename: plant.photo_filename,
          hasPhoto: !!plant.photo_filename
        });
      });
    }
  }, [plants]);

  // Filter plants based on search (client-side filtering)
  const filteredPlants = plants.filter((plant: Plant) => {
    const matchesSearch = searchTerm === "" ||
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const totalPlants = plants.length;

  // Effect to show notification when a plant is created
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const created = urlParams.get('created');
    const error = urlParams.get('error');
    
    if (created === 'true') {
      setNotification({
        type: 'success',
        message: '¡Planta creada exitosamente!'
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (error === 'true') {
      setNotification({
        type: 'error',
        message: 'Error al crear la planta. Inténtalo de nuevo.'
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

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 pb-16 pt-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Plantas Monitoreadas
            </h1>
          </div>

          <Link
            href="/monitoring/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl rounded-2xl font-normal transition-all duration-300 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Planta
          </Link>
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
              <span className="text-emerald-700 font-medium">Cargando plantas...</span>
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
            <p className="text-red-700 font-medium">Error al cargar las plantas</p>
            <p className="text-red-600 text-sm mt-1">Por favor, intenta de nuevo más tarde</p>
          </motion.div>
        )}

        {/* Content - only show when not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Stats Card - Solo Total de Plantas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mt-8"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg rounded-2xl p-6 max-w-xs w-full">
                <div className="text-center">
                  <div className="mb-3">
                    <Leaf className="h-8 w-8 text-emerald-200 mx-auto" />
                  </div>
                  <p className="text-emerald-100 text-xs font-medium mb-2">Plantas Monitoreadas</p>
                  <p className="text-3xl font-bold mb-2">{totalPlants}</p>
                  <p className="text-emerald-200 text-xs">
                    {totalPlants === 0 ? 'No hay plantas registradas' :
                     totalPlants === 1 ? '1 planta en el sistema' :
                     `${totalPlants} plantas en el sistema`}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-600" />
                <input
                  placeholder="🔍 Buscar plantas..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-xl shadow-lg transition-all duration-300 placeholder:text-emerald-600/60"
                />
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPlants.map((plant: Plant) => (
                <div
                  key={plant.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden"
                >
                  <Link href={`/monitoring/${plant.id}`} className="block">
                    <div className="relative">
                      {plant.photo_filename ? (
                        <AuthenticatedImage
                          src={`/api/plants/${plant.id}/photo`}
                          alt={plant.name}
                          className="w-full h-36 object-cover"
                          fallbackSrc="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                          onError={() => {
                            console.log('Image load error for plant:', plant.id, 'photo_filename:', plant.photo_filename);
                          }}
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                          alt={plant.name}
                          className="w-full h-36 object-cover"
                        />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border-emerald-200">
                          Activa
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-emerald-600">{plant.name}</h3>
                          <p className="text-xs text-gray-600">{plant.species}</p>
                        </div>

                        {plant.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">{plant.description}</p>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/30">
                          <span className="text-xs text-gray-600">
                            Creada: {new Date(plant.created_at).toLocaleDateString()}
                          </span>
                          {plant.photo_filename && (
                            <span className="text-xs text-emerald-600">📷 Con foto</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>

            {filteredPlants.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-12 text-center"
              >
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron plantas</h3>
                <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
              </motion.div>
            )}
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
