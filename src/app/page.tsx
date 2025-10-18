"use client";

import Navbar from "@/ui/components/client/Navbar";
import FloatingElements from "@/ui/components/client/FloatingElements";
import Hero from "@/ui/components/client/Hero";
import CollaborationSection from "@/ui/components/client/CollaborationSection";
import AboutUs from "@/ui/components/client/AboutUs";
import TeamSection from "@/ui/components/client/TeamSection";
import Footer from "@/ui/components/client/Footer";

// La raíz siempre muestra la landing. El dashboard autenticado vive en /monitoring
export default function Home() {
  return (
    <>
      <FloatingElements />
      <Navbar />
      <main className="relative">
        <Hero />
        <CollaborationSection />
        <AboutUs />
        <Footer />
      </main>
    </>
  );
}
