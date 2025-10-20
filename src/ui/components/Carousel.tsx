"use client";

import React, { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Campo de cultivo verde con montañas al fondo'
  },
  {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Plantas de tomate en invernadero'
  },
  {
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Campo de trigo dorado al atardecer'
  },
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Hortalizas frescas en el campo'
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Campo de maíz verde con cielo azul'
  }
];

const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {images.map((img, idx) => (
        <img
          key={img.url}
          src={img.url}
          alt={img.alt}
          className={`object-cover w-full h-full transition-opacity duration-1000 absolute top-0 left-0 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {/* Controles opcionales */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-emerald-500' : 'bg-white/60'
            } border border-emerald-500 transition-colors`}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

