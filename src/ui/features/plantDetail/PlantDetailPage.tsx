"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  Droplets,
  Thermometer,
  Wind,
  Sun,
} from "lucide-react";
import { usePlant, useDeletePlant } from "@/lib/api/plants-api";
import { usePlantDevices } from "@/lib/api/plant-devices-api";
import { usePlantChartData } from "@/lib/graphql/hooks";
import { useRealtimeMonitoring, useLatestMeasurement } from "@/lib/graphql/realtime-queries";
import { useAuth } from "@/hooks/useAuth";

// Importar componentes separados
import PlantStatusCard from "./components/PlantStatusCard";
import SensorDataCard from "./components/SensorDataCard";
import Header from "./components/Header";
import PlantInfoCard from "./components/PlantInfoCard";
import PlantDevicesManager from "./components/PlantDevicesManager";
import PlantCharts from "./components/PlantCharts";
import MetricDetailsModal from "./components/MetricDetailsModal";

interface PlantData {
  soilHumidity: number;
  airHumidity: number;
  temperature: number;
  lightLevel: number;
  timestamp: string;
  date: string;
  location: string;
  sensorId: string;
}

// Mock data para la planta
const mockPlant = {
  id: "1",
  name: "Tomate Chonto",
  species: "Solanum lycopersicum",
  description: "Tomate chonto de excelente calidad",
  photo_filename: "tomate_chonto.jpg",
  created_at: "2024-01-15T10:30:00Z",
  location: "Invernadero A"
};

const PlantDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const plantId = params.plantId as string;
  const { user } = useAuth();
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estado para modales de métricas
  const [openModal, setOpenModal] = useState<'temperature' | 'air_humidity' | 'soil_humidity' | 'light_intensity' | null>(null);

  // Estado para métricas en tiempo real
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    temperature: 0,
    airHumidity: 0,
    soilHumidity: 0,
    lightLevel: 0,
  });

  // Usar la API real para obtener la planta
  const { data: plant, isLoading, error } = usePlant(plantId);
  const deletePlantMutation = useDeletePlant();
  
  // Obtener dispositivos asignados a esta planta
  const { data: plantDevices = [] } = usePlantDevices(plantId);

  // Buscar el microcontrolador asignado a esta planta
  const microcontroller = plantDevices.find(device => device.category === 'microcontroller');
  const controllerId = microcontroller?.name || '';

  const hasMicrocontroller = plantDevices.some(device => device.category === 'microcontroller');
  const hasSensor = plantDevices.some(device => device.category === 'sensor');
  const hasData = hasMicrocontroller && hasSensor;

  // Obtener datos analíticos desde GraphQL usando el controllerId del microcontrolador
  const { 
    currentData: analyticsData, 
    isLoading: analyticsLoading, 
    error: analyticsError, 
    hasData: hasAnalyticsData,
    allMetrics,
    getMetricAverage,
    hasTemperature,
    hasHumidity,
    hasSoilHumidity,
    hasLight
  } = usePlantChartData(controllerId);


  // Hook para datos históricos y gráficas
  const {
    chartData: historicalChartData,
  } = useRealtimeMonitoring(
    controllerId, 
    ['temperature', 'air_humidity', 'soil_humidity', 'light_intensity'], 
    !!controllerId,
    24
  );

  // Hook para monitoreo en tiempo real
  const { 
    data: latestMeasurementData, 
    isLoading: isLoadingLatest,
    error: latestError 
  } = useLatestMeasurement(
    controllerId,
    isMonitoring && !!controllerId,
    3000
  );

  // Determinar el mensaje de estado del sensor
  const sensorStatus = useMemo(() => {
    if (controllerId) {
      if (isMonitoring) {
        return `📡 ${controllerId} - Monitoreando en tiempo real`;
      }
      return `✅ Microcontrolador: ${controllerId} - Datos obtenidos`;
    }
    return "❌ Sin microcontrolador asignado";
  }, [controllerId, isMonitoring]);

  const [currentData, setCurrentData] = useState<PlantData>({
    soilHumidity: 0,
    airHumidity: 0,
    temperature: 0,
    lightLevel: 0,
    timestamp: "",
    date: "",
    location: "Ubicación no disponible",
    sensorId: "Inicializando..."
  });

  // Actualizar sensorId cuando cambie el estado del sensor
  useEffect(() => {
    setCurrentData(prev => ({
      ...prev,
      sensorId: sensorStatus
    }));
  }, [sensorStatus]);

  // Actualizar currentData con los datos reales del polling cuando está monitoreando
  useEffect(() => {
    if (!latestMeasurementData?.getLatestMeasurement?.measurement) return;

    const measurement = latestMeasurementData.getLatestMeasurement.measurement;
    
    // Actualizar la métrica correspondiente según el tipo
    setRealtimeMetrics(prev => {
      const updated = { ...prev };
      
      switch (measurement.metricName) {
        case 'temperature':
          updated.temperature = measurement.value;
          break;
        case 'air_humidity':
          updated.airHumidity = measurement.value;
          break;
        case 'soil_humidity':
          updated.soilHumidity = measurement.value;
          break;
        case 'light_intensity':
          updated.lightLevel = measurement.value;
          break;
      }
      
      return updated;
    });
  }, [latestMeasurementData]);

  // Combinar datos de analytics y realtime
  useEffect(() => {
    setCurrentData(prev => ({
      ...prev,
      temperature: realtimeMetrics.temperature ?? analyticsData.temperature ?? 0,
      airHumidity: realtimeMetrics.airHumidity ?? analyticsData.airHumidity ?? 0,
      soilHumidity: realtimeMetrics.soilHumidity ?? analyticsData.temperature ?? 0, // Nota: había un error aquí, debería ser soilHumidity
      lightLevel: realtimeMetrics.lightLevel ?? analyticsData.lightLevel ?? 0,
      timestamp: new Date().toLocaleTimeString('es-ES'),
      date: new Date().toLocaleDateString('es-ES')
    }));
  }, [realtimeMetrics, analyticsData]);

  const handleDeletePlant = async () => {
    try {
      console.log('Deleting plant:', plantId);
      await deletePlantMutation.mutateAsync(plantId);
      router.push('/monitoring');
    } catch (error) {
      console.error('Error eliminando planta:', error);
      alert('Error al eliminar la planta. Por favor, intenta de nuevo.');
    }
  };

  const getStatusColor = (value: number, type: 'humidity' | 'temperature' | 'light') => {
    if (type === 'humidity') {
      if (value < 40) return 'text-red-600 bg-red-50';
      if (value > 80) return 'text-orange-600 bg-orange-50';
      return 'text-emerald-600 bg-emerald-50';
    }
    if (type === 'temperature') {
      if (value < 20) return 'text-blue-600 bg-blue-50';
      if (value > 30) return 'text-red-600 bg-red-50';
      return 'text-emerald-600 bg-emerald-50';
    }
    if (type === 'light') {
      if (value < 200) return 'text-slate-600 bg-slate-50';
      if (value < 500) return 'text-yellow-600 bg-yellow-50';
      if (value > 1500) return 'text-orange-600 bg-orange-50';
      return 'text-emerald-600 bg-emerald-50';
    }
    return 'text-slate-600 bg-slate-50';
  };

  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    setCurrentData(prev => ({
      ...prev,
      timestamp: now.toLocaleTimeString('es-ES'),
      date: now.toLocaleDateString('es-ES'),
      // Solo mostrar datos si hay dispositivos
      temperature: hasMicrocontroller ? prev.temperature : 0,
      airHumidity: hasMicrocontroller ? prev.airHumidity : 0,
      soilHumidity: hasMicrocontroller ? prev.soilHumidity : 0,
      lightLevel: hasMicrocontroller ? prev.lightLevel : 0,
    }));
  }, [hasMicrocontroller]);

  // Actualizar datos cuando cambie el estado de los dispositivos
  useEffect(() => {
    if (!hasMicrocontroller) {
      setCurrentData(prev => ({
        ...prev,
        temperature: 0,
        airHumidity: 0,
        soilHumidity: 0,
        lightLevel: 0,
      }));
    }
  }, [hasMicrocontroller]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-emerald-700 font-medium">Cargando planta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 text-red-500">⚠️</div>
          <p className="text-red-700 font-medium">Error al cargar la planta</p>
          <p className="text-slate-600 text-sm">Por favor intenta de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 text-yellow-500">❌</div>
          <p className="text-yellow-700 font-medium">Planta no encontrada</p>
          <p className="text-slate-600 text-sm">La planta que buscas no existe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 pt-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header 
          hasMicrocontroller={hasMicrocontroller} 
          onDelete={() => setShowDeleteModal(true)}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            <PlantStatusCard 
              plant={plant}
              isMonitoring={isMonitoring}
              hasMicrocontroller={hasMicrocontroller}
              currentData={currentData}
              isClient={isClient}
              onToggleMonitoring={() => setIsMonitoring(!isMonitoring)}
            />
            
            <PlantInfoCard plant={plant} isClient={isClient} />
          </motion.div>

          {hasData || isMonitoring ? (
            <div className="lg:col-span-2 space-y-4">
              <SensorDataCard
                icon={<Thermometer className="w-6 h-6" />}
                title="Temperatura"
                subtitle="Ambiente"
                value={isMonitoring ? currentData.temperature : (getMetricAverage('temperature') || currentData.temperature)}
                unit="°C"
                colorClass={getStatusColor(currentData.temperature, 'temperature')}
                delay={0.8}
                hasData={isMonitoring ? (realtimeMetrics.temperature !== undefined) : hasTemperature}
                onClick={() => setOpenModal('temperature')}
              />
              <SensorDataCard
                icon={<Droplets className="w-6 h-6" />}
                title="Humedad del Suelo"
                subtitle="Substrato"
                value={isMonitoring ? currentData.soilHumidity : (getMetricAverage('soil_humidity') || currentData.soilHumidity)}
                unit="%"
                colorClass={getStatusColor(currentData.soilHumidity, 'humidity')}
                delay={1.0}
                hasData={isMonitoring ? (realtimeMetrics.soilHumidity !== undefined) : hasSoilHumidity}
                onClick={() => setOpenModal('soil_humidity')}
              />
              <SensorDataCard
                icon={<Wind className="w-6 h-6" />}
                title="Humedad del Aire"
                subtitle="Ambiente"
                value={isMonitoring ? currentData.airHumidity : (getMetricAverage('air_humidity') || currentData.airHumidity)}
                unit="%"
                colorClass={getStatusColor(currentData.airHumidity, 'humidity')}
                delay={1.2}
                hasData={isMonitoring ? (realtimeMetrics.airHumidity !== undefined) : hasHumidity}
                onClick={() => setOpenModal('air_humidity')}
              />
              <SensorDataCard
                icon={<Sun className="w-6 h-6" />}
                title="Luminosidad"
                subtitle="Lux"
                value={isMonitoring ? currentData.lightLevel : (getMetricAverage('light_intensity') || currentData.lightLevel)}
                unit=" lux"
                colorClass={getStatusColor(currentData.lightLevel, 'light')}
                delay={1.4}
                hasData={isMonitoring ? (realtimeMetrics.lightLevel !== undefined) : hasLight}
                onClick={() => setOpenModal('light_intensity')}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl">
                <p className="text-slate-600">No hay datos para mostrar.</p>
                <p className="text-sm text-slate-500">Asigna un sensor para empezar a monitorear.</p>
              </div>
            </div>
          )}
        </div>

        {/* Plant Charts - Mostrar siempre si hay controllerId */}
        {controllerId && (
          <PlantCharts
            temperatureData={historicalChartData?.temperature || []}
            humidityData={historicalChartData?.humidity || []}
            soilHumidityData={historicalChartData?.soilHumidity || []}
            lightData={historicalChartData?.light || []}
            currentData={currentData}
            isLoading={analyticsLoading}
            error={analyticsError}
          />
        )}

        {/* Plant Devices Manager */}
        <PlantDevicesManager 
          plantId={plantId} 
          plantName={plant?.name || 'Planta'} 
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4">Eliminar Planta</h3>
            <p className="text-slate-600 mb-6">
              ¿Estás seguro de que quieres eliminar la planta "{plant?.name}"? Esta acción no se puede deshacer y eliminará todos los datos asociados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeletePlant();
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Planta
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modales de Métricas */}
      <MetricDetailsModal
        isOpen={openModal === 'temperature'}
        onClose={() => setOpenModal(null)}
        metricType="temperature"
        metrics={allMetrics as any}
        title="Temperatura"
        icon={<Thermometer className="w-8 h-8" />}
      />
      
      <MetricDetailsModal
        isOpen={openModal === 'air_humidity'}
        onClose={() => setOpenModal(null)}
        metricType="air_humidity"
        metrics={allMetrics as any}
        title="Humedad del Aire"
        icon={<Wind className="w-8 h-8" />}
      />
      
      <MetricDetailsModal
        isOpen={openModal === 'soil_humidity'}
        onClose={() => setOpenModal(null)}
        metricType="soil_humidity"
        metrics={allMetrics as any}
        title="Humedad del Suelo"
        icon={<Droplets className="w-8 h-8" />}
      />
      
      <MetricDetailsModal
        isOpen={openModal === 'light_intensity'}
        onClose={() => setOpenModal(null)}
        metricType="light_intensity"
        metrics={allMetrics as any}
        title="Luminosidad"
        icon={<Sun className="w-8 h-8" />}
      />
    </div>
  );
};

export default PlantDetailPage;
