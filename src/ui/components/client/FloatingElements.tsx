"use client";

import React from "react";
import { motion } from "framer-motion";

const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-sm animate-float-natural organic-shape"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          x: [0, -8, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-16 w-12 h-12 bg-gradient-to-br from-cyan-200/40 to-emerald-200/40 rounded-full blur-sm animate-float-natural"
      />
      <motion.div
        animate={{ 
          y: [0, -25, 0],
          x: [0, 12, 0],
          rotate: [0, 8, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-60 left-1/4 w-20 h-20 bg-gradient-to-br from-teal-200/25 to-cyan-200/25 rounded-full blur-sm animate-float-natural organic-shape"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-80 right-1/3 w-14 h-14 bg-gradient-to-br from-emerald-200/35 to-teal-200/35 rounded-full blur-sm animate-float-natural"
      />
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, 8, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-96 left-2/3 w-18 h-18 bg-gradient-to-br from-cyan-200/30 to-emerald-200/30 rounded-full blur-sm animate-float-natural organic-shape"
      />
    </div>
  );
};

export default FloatingElements;
