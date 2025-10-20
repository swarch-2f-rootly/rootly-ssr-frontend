"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LoginSchema = z.object({ 
  email: z.string().email("Correo inválido"), 
  password: z.string().min(6, "Mínimo 6 caracteres") 
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check for registration success message
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      // Clean URL
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onChange: ({ value }) => {
        const result = LoginSchema.safeParse(value);
        if (result.success) return undefined;
        return result.error.formErrors.fieldErrors;
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        // Usar el hook de autenticación real
        await login({
          email: value.email,
          password: value.password,
        });
        router.push("/monitoring");
      } catch (err: any) {
        setError(err?.message || "Error al iniciar sesión");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Inicia sesión en tu cuenta ROOTLY</p>
          </div>
          
          {successMessage && (
            <div className="text-green-600 text-sm mb-4 text-center bg-green-50 p-3 rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}
          
          {error && <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">{error}</div>}
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field name="email">
              {(field) => (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
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
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Iniciar sesión
            </button>
            
            <p className="text-center text-gray-600">
              ¿Aún no estás registrado? {" "}
              <a href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}