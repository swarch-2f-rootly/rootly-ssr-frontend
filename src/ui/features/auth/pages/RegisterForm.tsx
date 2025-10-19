"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const RegisterSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    validators: {
      onChange: ({ value }) => {
        const result = RegisterSchema.safeParse(value);
        if (result.success) return undefined;
        return result.error.formErrors.fieldErrors;
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        // Usar el hook de autenticación real
        await register({
          email: value.email,
          password: value.password,
          first_name: value.firstName,
          last_name: value.lastName,
        });
        router.push("/monitoring");
      } catch (err: any) {
        setError(err?.message || "Error al registrar usuario");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">Únete a ROOTLY</h1>
            <p className="text-gray-600">Crea tu cuenta y comienza a monitorear</p>
          </div>
          
          {error && <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{error}</div>}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field name="firstName">
              {(field) => (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors" 
                      type="text" 
                      placeholder="Tu nombre"
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      onBlur={field.handleBlur} 
                    />
                  </div>
                  {field.state.meta.errors[0] && <p className="text-xs text-red-600 mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
            
            <form.Field name="lastName">
              {(field) => (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Apellido</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors" 
                      type="text" 
                      placeholder="Tu apellido"
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      onBlur={field.handleBlur} 
                    />
                  </div>
                  {field.state.meta.errors[0] && <p className="text-xs text-red-600 mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
            
            <form.Field name="email">
              {(field) => (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors" 
                      type="email" 
                      placeholder="tu@email.com"
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      onBlur={field.handleBlur} 
                    />
                  </div>
                  {field.state.meta.errors[0] && <p className="text-xs text-red-600 mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
            
            <form.Field name="password">
              {(field) => (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="........"
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      onBlur={field.handleBlur} 
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {field.state.meta.errors[0] && <p className="text-xs text-red-600 mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Crear cuenta
            </button>
            
            <p className="text-center text-gray-600">
              ¿Ya tienes una cuenta? {" "}
              <a href="/login" className="text-teal-600 hover:text-teal-700 font-medium underline">Inicia sesión aquí</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}