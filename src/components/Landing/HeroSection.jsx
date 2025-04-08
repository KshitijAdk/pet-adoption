import React, { useEffect, useState } from 'react';
import { ChevronRight, Heart, Search, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const generatePawPositions = () => {
  return [...Array(5)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    rotate: `${Math.random() * 360}deg`,
    size: 30 + Math.random() * 20,
    opacity: 0,
  }));
};

const HeroSection = () => {
  const [pawPositions, setPawPositions] = useState(generatePawPositions());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPawPositions(generatePawPositions());
        setVisible(true);
      }, 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-hidden">

      {/* Floating paw prints */}
      {pawPositions.map((pos, i) => (
        <PawPrint
          key={i}
          className={`absolute text-amber-400 transition-opacity duration-500 ease-in-out ${visible ? 'opacity-50' : 'opacity-0'}`}
          style={{
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate})`,
            width: pos.size,
            height: pos.size,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left content area (text) */}
          <div className="w-full md:w-1/2 md:pr-12 z-10">
            <div className="inline-block bg-amber-200 text-amber-600 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
              🐾 Find your new best friend
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Find Your Perfect
              <span className="block mt-2">
                <span className="text-amber-500 relative">
                  Furry
                  <svg className="absolute -bottom-2 w-full h-3 text-amber-500 opacity-60 animate-wiggle" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 15 Q 25 0, 50 15 Q 75 30, 100 15" stroke="currentColor" strokeWidth="5" fill="none" />
                  </svg>
                </span> Companion
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
              Connecting loving homes with pets in need. Our mission is to create lasting bonds between people and animals through compassionate adoption services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/pets">
                <button className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Heart className="mr-2 h-5 w-5" /> Adopt Now <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </Link>


              <Link to="/pets">
                <button className="bg-white text-gray-800 border border-gray-200 hover:border-amber-500 hover:text-amber-500 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center">
                  <Search className="mr-2 h-5 w-5" /> Browse Pets
                </button>
              </Link>

            </div>
          </div>

          {/* Right content area (image) */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform md:rotate-0 hover:rotate-2 transition-transform duration-500 animate-fade-in">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="Happy dog"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;