"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import TeamCard from "@/ui/components/client/TeamCard";

const TeamSection: React.FC = () => {
  const teamMembers: Array<{ username: string; name: string }> = [
    { username: "ACorduz", name: "Andres Camilo Orduz Lunar" },
    { username: "cstovar", name: "Cristian Tovar" },
    { username: "Dacosta99", name: "Danny" },
    { username: "Erodriguezmu", name: "Esteban Rodriguez" },
    { username: "GabrielaGuzmanR", name: "Gabriela Guzmán Rivera" },
    { username: "ggallegosr", name: "Gabriela Gallegos Rubio" },
    { username: "CarlosSandoval-03", name: "Carlos Sandoval" },
    { username: "Srestrero", name: "Santiago RR" },
  ];

  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} className="py-16 px-6 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg mb-6">
            <Users className="w-5 h-5 mr-2" />
            <span>Equipo Rootly</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Conoce a nuestro <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">equipo</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Un grupo de desarrolladores apasionados por la tecnología y la agricultura, trabajando juntos para revolucionar el campo colombiano.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.username} username={member.username} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TeamSection;


