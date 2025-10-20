"use client";

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Cpu,
  Activity,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useCreateDevice } from '@/lib/api/devices-api';
import { useAuth } from '@/hooks/useAuth';

type DeviceCategory = 'microcontroller' | 'sensor';

const AddDeviceForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Usar el hook de mutación real
  const createDevice = useCreateDevice();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      version: '',
      category: 'sensor' as DeviceCategory,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        console.log('📝 Device form onSubmit triggered');
        console.log('📝 Device form values before submit:', value);
        
        // Agregar user_id del usuario autenticado
        const deviceData = {
          ...value,
          user_id: user?.id || '',
        };
        
        console.log('Submitting device data with user_id:', deviceData);
        
        // Enviar a la API real
        await createDevice.mutateAsync(deviceData);
        
        console.log('Device created successfully');
        router.push('/devices?created=true');
      } catch (error) {
        console.error('Error creating device:', error);
        router.push('/devices?error=true');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return <Cpu className="w-5 h-5" />;
      case 'sensor':
        return <Activity className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'microcontroller':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sensor':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 pb-16 pt-32">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <Link
            href="/devices"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-700 hover:bg-gray-50 rounded-2xl font-normal transition-all duration-300 text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Dispositivos
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nuevo Dispositivo
            </h1>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Name Field */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    return value && value.length < 1 ? 'El nombre es requerido' : undefined;
                  },
                }}
                children={(field) => (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre del Dispositivo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                      placeholder="Ej: Sensor DHT11, Arduino Uno"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Category Field */}
              <form.Field
                name="category"
                children={(field) => (
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Categoría *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'microcontroller', label: 'Microcontrolador', desc: 'Arduino, ESP32, Raspberry Pi' },
                        { value: 'sensor', label: 'Sensor', desc: 'DHT11, Soil Moisture, Light' }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                            field.state.value === option.value
                              ? getCategoryColor(option.value)
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={option.value}
                            checked={field.state.value === option.value}
                            onChange={() => field.handleChange(option.value as DeviceCategory)}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              field.state.value === option.value
                                ? 'bg-white/20'
                                : 'bg-white'
                            }`}>
                              {getCategoryIcon(option.value)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              <div className="text-xs text-gray-600">{option.desc}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Description Field */}
              <form.Field
                name="description"
                children={(field) => (
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Descripción (Opcional)
                    </label>
                    <textarea
                      id="description"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Describe las características del dispositivo..."
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Version Field */}
              <form.Field
                name="version"
                children={(field) => (
                  <div>
                    <label
                      htmlFor="version"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Versión (Opcional)
                    </label>
                    <input
                      id="version"
                      type="text"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                      placeholder="Ej: v1.0, Rev A"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/devices"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancelar
              </Link>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, formIsSubmitting]) => {
                  const submitting = isSubmitting || formIsSubmitting;
                  return (
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Crear Dispositivo
                        </>
                      )}
                    </button>
                  );
                }}
              />
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddDeviceForm;
