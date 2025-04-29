import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ text = "Loading..." }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/20 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-white/50 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-70 animate-pulse"></div>
          
          {/* Inner spinning light */}
          <div className="absolute w-10 h-10 bg-blue-400 rounded-full blur-md opacity-60 animate-ping"></div>
          
          {/* Main loader icon */}
          <Loader2 className="animate-spin h-10 w-10 text-blue-600 relative z-10" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-800 font-semibold text-lg tracking-wide">{text}{dots}</p>
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;