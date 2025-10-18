"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import TeamSection from "@/ui/components/client/TeamSection";
import Image from "next/image";

const AboutUs: React.FC = () => (
  <motion.section
    id="about-us"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 px-6 py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
  >
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 text-center md:text-left space-y-6 flex flex-col items-center md:items-start">
        <div className="flex justify-center md:justify-start mb-4">
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg inline-flex items-center">
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Acerca de Nosotros
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-500 max-w-3xl">
          Somos un equipo comprometido con el futuro del agro colombiano. Nuestra misión es tender un puente entre la tecnología y las comunidades, llevando innovación al corazón del campo. Creemos firmemente que la transformación nace de la unión entre conocimiento, tradición y herramientas digitales; por ello trabajamos cada día para apoyar a quienes hacen posible que la tierra florezca.
        </p>
      </div>
      <div className="flex-1 flex justify-center">
        <Image src="/campesinos.jpg" alt="Campesinos" width={640} height={384} className="rounded-2xl shadow-lg max-h-96 object-cover border-4 border-emerald-200" />
      </div>
    </div>
    <TeamSection />
  </motion.section>
);

export default AboutUs;


