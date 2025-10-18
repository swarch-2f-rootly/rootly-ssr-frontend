"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-20 -right-20 w-80 h-80 border border-white/10 rounded-full" />
        <motion.div animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-20 -left-20 w-96 h-96 border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
          <h2 className="text-4xl font-bold text-white">¿Listo para transformar tu agricultura?</h2>
          <p className="text-xl text-white/90">Únete a los agricultores que ya están optimizando sus cultivos con la plataforma de monitoreo avanzada de ROOTLY.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              router.push("/login");
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-normal flex items-center gap-2 justify-center text-sm"
          >
            Iniciar monitoreo
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Footer;


