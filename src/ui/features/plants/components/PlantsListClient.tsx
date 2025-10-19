"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Leaf } from 'lucide-react';
import Link from 'next/link';
import type { PlantsResponse, Plant } from '@/lib/graphql/types';

interface PlantsListClientProps {
  initialData: PlantsResponse;
  userId?: string;
}

export function PlantsListClient({ initialData, userId }: PlantsListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter plants based on search (client-side filtering)
  const filteredPlants = initialData.plants.filter((plant: Plant) => {
    const matchesSearch = searchTerm === "" ||
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
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
            <p className="text-3xl font-bold mb-2">{initialData.total}</p>
            <p className="text-emerald-200 text-xs">
              {initialData.total === 0 ? 'No hay plantas registradas' :
               initialData.total === 1 ? '1 planta en el sistema' :
               `${initialData.total} plantas en el sistema`}
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

      {/* Plants Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden"
          >
            <Link href={`/monitoring/${plant.id}`} className="block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                  alt={plant.name}
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80') {
                      target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
                    }
                  }}
                />
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

      {/* Empty State */}
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
    </div>
  );
}
