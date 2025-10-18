"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Play,
  Pause,
  Database,
  Wifi,
  TrendingUp,
  Menu,
  X,
  Thermometer,
  Droplets,
  Activity,
} from "lucide-react";

const ClickSpark: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  count?: number;
  duration?: number;
}> = ({ children, color = "#10B981", size = 20, count = 8, duration = 600 }) => {
  const [sparks, setSparks] = React.useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newSparks = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      angle: (360 / count) * i,
    }));

    setSparks(newSparks);

    setTimeout(() => {
      setSparks([]);
    }, duration);
  };

  return (
    <div onClick={handleClick} style={{ position: "relative", display: "inline-block" }}>
      {children}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          style={{
            position: "absolute",
            left: spark.x,
            top: spark.y,
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            pointerEvents: "none",
            zIndex: 1000,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((spark.angle * Math.PI) / 180) * 100,
            y: Math.sin((spark.angle * Math.PI) / 180) * 100,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: duration / 1000, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const SplitText: React.FC<{
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
}> = ({ text, className, stagger = 0.1, delay = 0, duration = 0.5 }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * stagger, duration }}
          className="title-word"
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
};

const TrueFocus: React.FC<{ children: React.ReactNode; color?: string; size?: number; opacity?: number; blur?: number }> = ({
  children,
  color = "#10B981",
  size = 200,
  opacity = 0.1,
  blur = 40,
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovered) setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ position: "relative" }}>
      {isHovered && (
        <motion.div
          style={{
            position: "fixed",
            top: position.y - size / 2,
            left: position.x - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}${Math.round(opacity * 255)
              .toString(16)
              .padStart(2, "0")} 0%, transparent 70%)`,
            filter: `blur(${blur}px)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
          animate={{ x: 0, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      )}
      {children}
    </div>
  );
};

const Hero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <TrueFocus color="#10B981" size={200} opacity={0.1} blur={40}>
      <section className="min-h-screen bg-white relative overflow-hidden mt-12">
        <nav className="absolute top-3 left-0 right-0 z-50 p-6">
          <motion.button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} whileTap={{ scale: 0.95 }}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white shadow-lg border-b border-slate-200">
              <div className="p-7 space-y-4">
                <a href="#platform" className="block text-slate-700 hover:text-emerald-600">
                  Plataforma
                </a>
                <a href="#analytics" className="block text-slate-700 hover:text-emerald-600">
                  Sobre nosotros
                </a>
                <Link href="/login" className="w-full">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 px-4 py-2 rounded-2xl font-normal text-sm">
                    Comenzar
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </nav>

        <div className="absolute inset-0 opacity-30">
          <div className="grid-pattern"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-8 h-8 bg-emerald-200 rounded-full opacity-60"
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 w-6 h-6 bg-teal-200 rounded-full opacity-50"
          />
          <motion.div
            animate={{ y: [0, -25, 0], x: [0, 12, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-1/4 w-10 h-10 bg-cyan-200 rounded-full opacity-40"
          />
        </div>

        <div className="relative z-10 mx-auto px-4 py-20" style={{ maxWidth: "84rem" }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Zap size={16} className="mr-2" />
                AgriTech de Próxima Generación
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="space-y-4">
                <SplitText text="La solución completa" className="text-4xl md:text-6xl font-bold leading-tight text-slate-800/85 block" stagger={0.1} delay={0.6} duration={0.5} />
                <SplitText text="para monitorear cultivos." className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent block" stagger={0.1} delay={0.8} duration={0.5} />
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }} className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                El conjunto de herramientas de tu granja para dejar de adivinar y empezar a optimizar. Recopila, analiza y escala datos agrícolas de forma segura con ROOTLY.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4">
                <ClickSpark color="#10B981" size={20} count={8} duration={600}>
                  <Link href="/login">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-normal flex items-center gap-2 text-sm">
                      Iniciar Monitoreo
                      <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                </ClickSpark>
                <ClickSpark color="#06B6D4" size={15} count={6} duration={500}>
                  <a href="#collaboration-section">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-2xl font-normal transition-all duration-300 text-sm">
                      Explorar la Plataforma
                    </motion.button>
                  </a>
                </ClickSpark>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="relative">
              <div className="p-8 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 shadow-2xl rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Monitoreo en Tiempo Real</h3>
                  <div className="flex items-center space-x-2">
                    <motion.button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:bg-slate-100 rounded" whileTap={{ scale: 0.95 }}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                    <motion.div className="w-3 h-3 bg-emerald-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-sm font-medium text-emerald-600">En Vivo</span>
                  </div>
                </div>

                <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 flex items-end justify-center space-x-2 mb-6">
                  {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-t from-emerald-500 to-teal-400 rounded-xl w-6 transition-all duration-1000 ease-out hover:from-emerald-600 hover:to-teal-500"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">Conectado</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }} className="flex items-center space-x-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <Wifi className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-teal-700">En Línea</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.6 }} className="flex items-center space-x-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <TrendingUp className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700">Optimizado</span>
                  </motion.div>
                </div>
              </div>

              <div className="absolute -inset-4 -z-10">
                <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
              </div>
            </motion.div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "4", suffix: "", label: "Tipos de Medición", change: "Disponibles", icon: Thermometer, color: "emerald" },
                { value: "Auto", suffix: "", label: "Monitoreo Automático", change: "Programable", icon: Droplets, color: "teal" },
                { value: "IoT", suffix: "", label: "Tecnología", change: "Conectividad", icon: Activity, color: "cyan" },
                { value: "Web", suffix: "", label: "Acceso Remoto", change: "Desde Cualquier Lugar", icon: Zap, color: "emerald" },
              ].map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 + index * 0.1, duration: 0.6 }} className="text-center p-6 bg-white/90 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-3xl font-bold text-slate-800">{stat.value}{stat.suffix}</div>
                  <p className="text-sm text-slate-600 mt-2 font-medium">{stat.label}</p>
                  <p className={`text-xs text-${stat.color}-600 font-medium mt-1`}>{stat.change}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </TrueFocus>
  );
};

export default Hero;


