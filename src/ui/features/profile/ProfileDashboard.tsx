"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit, Camera, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateUser, useUploadUserPhoto, useDeleteUserPhoto } from '@/lib/api/users-api';
import { useUserPlants } from '@/lib/api/plants-api';
import { AuthenticatedImage } from '@/ui/components/AuthenticatedImage';

const ProfileDashboard: React.FC = () => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
  });

  const { user, isLoading: userLoading } = useAuth();
  const updateUser = useUpdateUser();
  const uploadPhoto = useUploadUserPhoto();
  const deletePhoto = useDeleteUserPhoto();
  const { data: plants = [] } = useUserPlants(user?.id || '');
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load form data when user data is available
  useEffect(() => {
    if (user) {
      setEditFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (selectedFile && user) {
      try {
        await uploadPhoto.mutateAsync({
          userId: user.id,
          file: selectedFile,
        });
        
        // Update user in localStorage with new photo
        const updatedUser = {
          ...user,
          profile_photo_url: `/api/users/${user.id}/photo?t=${Date.now()}`,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setNotification({
          type: 'success',
          message: 'Foto de perfil actualizada exitosamente',
        });
        
        setShowPhotoModal(false);
        setSelectedFile(null);
        setPhotoPreview(null);
        
        // Force page reload to update the photo
        window.location.reload();
      } catch (error) {
        console.error('Error uploading photo:', error);
        setNotification({
          type: 'error',
          message: 'Error al subir la foto de perfil',
        });
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (!user) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
      return;
    }
    
    try {
      await deletePhoto.mutateAsync(user.id);
      
      // Update user in localStorage without photo
      const updatedUser = {
        ...user,
        profile_photo_url: undefined,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setNotification({
        type: 'success',
        message: 'Foto de perfil eliminada exitosamente',
      });
      
      setShowPhotoModal(false);
      
      // Force page reload to update the photo
      window.location.reload();
    } catch (error: any) {
      const is404 = error?.status === 404 || (error instanceof Error && error.message.includes('404'));
      
      if (is404) {
        setNotification({
          type: 'success',
          message: 'La foto de perfil ya fue eliminada',
        });
        setShowPhotoModal(false);
      } else {
        console.error('Error deleting photo:', error);
        setNotification({
          type: 'error',
          message: 'Error al eliminar la foto de perfil',
        });
      }
    }
  };

  const handleEditProfile = () => {
    if (user) {
      setEditFormData({
        first_name: user.first_name,
        last_name: user.last_name,
      });
      setShowEditModal(true);
    }
  };

  const handleEditFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      await updateUser.mutateAsync({
        userId: user.id,
        userData: editFormData,
      });
      
      // Update user in localStorage
      const updatedUser = {
        ...user,
        ...editFormData,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setNotification({
        type: 'success',
        message: 'Perfil actualizado exitosamente',
      });
      
      setShowEditModal(false);
      
      // Force page reload to update the profile
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        type: 'error',
        message: 'Error al actualizar el perfil',
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-emerald-700 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
          <p className="text-yellow-700 font-medium">Usuario no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto pt-24 pb-8 px-4">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="bg-white/90 backdrop-blur-md border-0 shadow-lg rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="h-32 w-32 border-4 border-emerald-200 rounded-full shadow-lg overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center relative">
                {/* Default user icon - always present as background */}
                <User className="h-16 w-16 text-white absolute z-0" />
                
                {/* Photo overlay - will appear on top if photo exists */}
                {user.profile_photo_url && (
                  <div className="absolute inset-0 z-10">
                    <AuthenticatedImage
                      src={`/api/users/${user.id}/photo`}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover rounded-full"
                      fallbackSrc=""
                      onError={() => {
                        // Silently handle no photo - will show default icon underneath
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute -bottom-3 -right-3 bg-emerald-500 hover:bg-emerald-600 rounded-full p-3 shadow-lg transition-colors"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-emerald-700">Perfil de Usuario</h1>
              <p className="text-slate-600">Gestiona tu información y plantas</p>
            </div>

            {/* User Info Grid */}
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-500">Nombre</div>
                    <div className="font-semibold text-slate-800">{user.first_name || user.name || 'Sin nombre'} {user.last_name || ''}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="font-semibold text-slate-800">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-500">Estado</div>
                    <div className="font-semibold text-slate-800">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-500">Roles</div>
                    <div className="font-semibold text-slate-800">
                      {user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Sin roles asignados'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{plants.length}</div>
                <div className="text-sm text-slate-500">Plantas</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {user.created_at ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </div>
                <div className="text-sm text-slate-500">Días activo</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'N/A'}
                </div>
                <div className="text-sm text-slate-500">Miembro desde</div>
              </div>
            </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                      <motion.button
                        onClick={handleEditProfile}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Editar perfil
                      </motion.button>
                      
                    </div>
          </div>
        </motion.div>

        {/* Photo Upload Modal */}
        {showPhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Cambiar foto de perfil</h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {photoPreview ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-200">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUploadPhoto}
                        disabled={uploadPhoto.isPending}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadPhoto.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Subir foto
                          </>
                        )}
                      </motion.button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPhotoPreview(null);
                        }}
                        disabled={uploadPhoto.isPending}
                        className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-emerald-200 flex items-center justify-center bg-emerald-50">
                      <Camera className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 mb-2">Selecciona una nueva foto de perfil</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Seleccionar archivo
                      </label>
                    </div>
                    {user.profile_photo_url && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={deletePhoto.isPending}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletePhoto.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Eliminar foto actual
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Editar perfil</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={handleEditFormChange('first_name')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={handleEditFormChange('last_name')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={updateUser.isPending}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateUser.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Guardar cambios
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={updateUser.isPending}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
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
};

export default ProfileDashboard;