"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogOut, User, Cpu, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleMobileLogout = async () => {
    await handleLogout();
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (isAuthenticated) router.push('/monitoring');
    else router.push('/');
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#1A202C' }}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
        <Image src="/iconRootly.png" alt="Rootly" width={48} height={48} style={{ width: "auto", height: "auto" }} />
        <span className="font-extrabold text-2xl md:text-3xl text-white">Rootly</span>
      </div>
      {isAuthenticated ? (
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/monitoring" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 text-sm"><Leaf className="w-4 h-4" /> Plantas</Link>
          <Link href="/devices" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 text-sm"><Cpu className="w-4 h-4" /> Dispositivos</Link>
          <Link href="/profile" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 text-sm"><User className="w-4 h-4" /> Perfil</Link>
          <button onClick={handleLogout} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 text-sm"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      ) : (
        <div className="hidden md:flex items-center space-x-6">
          <a href="#collaboration-section" className="text-white hover:text-emerald-300 transition-colors font-normal text-sm">Plataforma</a>
          <a href="#about-us" className="text-white hover:text-emerald-300 transition-colors font-normal text-sm">Sobre nosotros</a>
          <Link href="/login" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 text-sm">Iniciar sesión</Link>
          <Link href="/register" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 text-sm">Registrarse</Link>
        </div>
      )}
      <motion.button
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>
      {/* Menú móvil */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute top-16 left-0 w-full shadow-lg flex flex-col items-center space-y-4 py-4 md:hidden z-50"
          style={{ backgroundColor: '#1A202C' }}
        >
          {isAuthenticated ? (
            <>
              <Link href="/monitoring" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}><Leaf className="w-4 h-4" /> Plantas</Link>
              <Link href="/devices" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}><Cpu className="w-4 h-4" /> Dispositivos</Link>
              <Link href="/profile" className="text-white hover:text-emerald-300 transition-colors font-normal flex items-center gap-1 w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}><User className="w-4 h-4" /> Perfil</Link>
              <button onClick={handleMobileLogout} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 w-4/5 text-center text-sm"><LogOut className="w-4 h-4" /> Logout</button>
            </>
          ) : (
            <>
              <a href="#collaboration-section" className="text-white hover:text-emerald-300 transition-colors font-normal w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}>Plataforma</a>
              <a href="#about-us" className="text-white hover:text-emerald-300 transition-colors font-normal w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}>Sobre nosotros</a>
              <Link href="/login" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link>
              <Link href="/register" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 px-3 py-1.5 rounded-lg font-normal flex items-center gap-2 w-4/5 text-center text-sm" onClick={() => setIsMenuOpen(false)}>Registrarse</Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;