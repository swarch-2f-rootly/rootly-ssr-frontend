"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Search } from "lucide-react";

const RotatingText: React.FC<{ words: string[]; className?: string }> = ({ words, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, [words.length]);
  const maxWidth = Math.max(...words.map((w) => w.length)) * 0.6;
  return (
    <div className="relative inline-block overflow-hidden" style={{ verticalAlign: "middle", height: "1.2em", minWidth: `${maxWidth}em`, textAlign: "left" }}>
      <motion.span key={currentIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: "easeInOut" }} className={`${className} block flex items-center justify-start`}>
        {words[currentIndex]}
      </motion.span>
    </div>
  );
};

const ScrollStack: React.FC<{ children: React.ReactNode; direction?: "up" | "down"; speed?: number }> = ({ children, direction = "up", speed = 0.5 }) => {
  return (
    <motion.div animate={{ y: direction === "up" ? [-10, 10, -10] : [10, -10, 10] }} transition={{ duration: 4 / speed, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
};

const CollaborationSection: React.FC = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const sensors = ["sensor-temperatura-01", "sensor-humedad-02", "sensor-suelo-03"];
  const filteredSensors = sensors.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section ref={sectionRef} id="collaboration-section" className="py-20 px-6 bg-gradient-to-r" style={{ backgroundColor: '#1A202C' }}>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Zap size={16} className="mr-2" />
                <span>Colaboración</span>
              </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }} className="text-4xl font-bold text-white">
                Haz que la agricultura sea <RotatingText words={["fluida", "eficiente", "inteligente", "sostenible"]} className="text-emerald-600" />
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.6 }} className="text-xl text-white">
                Herramientas para tu equipo y partes interesadas para compartir información e iterar más rápido.
              </motion.p>
            </div>

            <div className="space-y-6">
              {[
                "Recopilación y procesamiento de datos de sensores en tiempo real",
                "Análisis avanzado con modelado predictivo",
                "Alertas y recomendaciones automatizadas",
                "Panel colaborativo para información del equipo",
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <ScrollStack direction="up" speed={0.5}>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6, duration: 0.8 }} className="p-6 bg-white/95 rounded-xl border border-slate-200 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <input type="text" placeholder="Buscar sensores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-sm flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
                    <Search size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {filteredSensors.map((sensor, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-mono text-slate-700">{sensor}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Activo</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </ScrollStack>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;


