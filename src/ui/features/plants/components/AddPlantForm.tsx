"use client";

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  Leaf,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';

const AddPlantForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      species: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        console.log('Submitting plant data:', value);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Plant created successfully');
        router.push('/monitoring?created=true');
      } catch (error) {
        console.error('Error creating plant:', error);
        router.push('/monitoring?error=true');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
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
            href="/monitoring"
            className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 hover:bg-gray-50 rounded-2xl font-normal transition-all duration-300 text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Plantas
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Nueva Planta
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
              console.log('📝 Form onSubmit triggered');
              console.log('📝 Form values before submit:', form.state.values);
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
                      Nombre de la Planta *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                      placeholder="Ej: Tomate Cherry"
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

              {/* Species Field */}
              <form.Field
                name="species"
                validators={{
                  onChange: ({ value }) => {
                    return value && value.length < 1 ? 'La especie es requerida' : undefined;
                  },
                }}
                children={(field) => (
                  <div>
                    <label
                      htmlFor="species"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Especie *
                    </label>
                    <select
                      id="species"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-gray-900"
                    >
                      <option value="">Seleccionar especie</option>
                      <option value="Tomate">Tomate</option>
                      <option value="Lechuga">Lechuga</option>
                      <option value="Pimiento">Pimiento</option>
                      <option value="Zanahoria">Zanahoria</option>
                      <option value="Cebolla">Cebolla</option>
                      <option value="Ajo">Ajo</option>
                      <option value="Perejil">Perejil</option>
                      <option value="Albahaca">Albahaca</option>
                      <option value="Otra">Otra</option>
                    </select>
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
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Describe las características especiales de tu planta..."
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

              {/* Photo Upload Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de la Planta (Opcional)
                </label>
                <div className="space-y-4">
                  {/* File Input */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <Camera className="w-8 h-8 mb-2 text-gray-400" />
                        )}
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click para subir</span> o arrastra una imagen
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG o JPEG (máx. 5MB)</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview and File Info */}
                  {selectedFile && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                      <Upload className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-emerald-700 font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-emerald-600 text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setUploadError(null);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  )}

                  {/* Upload Error */}
                  {uploadError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/monitoring"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancelar
              </Link>
              <form.Subscribe
                selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
                children={({ canSubmit, isSubmitting: formIsSubmitting }) => {
                  const submitting = isSubmitting || formIsSubmitting;
                  return (
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Crear Planta
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

export default AddPlantForm;