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

            {/* Main Heading */}
            <h1 className="text-9xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect{' '}
              <span className="relative">
                <span className="relative z-10 text-amber-300">Furry</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 12.5C20 12.5 20 7.5 40 7.5C60 7.5 60 12.5 80 12.5C100 12.5 100 7.5 120 7.5"
                    stroke="#FCD34D"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>{' '}
              Companion
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
