import React from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-start">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
          Find Your Perfect <span className="text-amber-400">Furry</span> Companion
        </h1>
        <p className="text-xl text-white mb-8 max-w-xl">
          Connecting loving homes with pets in need. Start your journey to pet parenthood today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 flex items-center">
            Adopt Now <ChevronRight className="ml-2 h-5 w-5" />
          </button>
          <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-semibold py-3 px-8 rounded-full transition duration-300">
            Browse Pets
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
