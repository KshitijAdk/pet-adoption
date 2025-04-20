import { useState, useEffect } from 'react';
import { Search, Home } from 'lucide-react';

export default function NotFoundPage() {
    const [randomPet, setRandomPet] = useState(0);

    // Rotate between different pets for the illustration
    useEffect(() => {
        const interval = setInterval(() => {
            setRandomPet(prev => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl text-center">
                <div className="mb-8">
                    {randomPet === 0 && <DogSVG />}
                    {randomPet === 1 && <CatSVG />}
                    {randomPet === 2 && <BunnySVG />}
                </div>

                <h1 className="text-6xl font-bold text-rose-500 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Oh no! Page not found</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                    It seems this furry friend has wandered off. The page you're looking for may have been moved or doesn't exist.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <a href="/" className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
                        <Home size={18} />
                        Go Home
                    </a>
                    <a href="/pets" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
                        <Search size={18} />
                        Find Pets
                    </a>
                </div>

                <div className="text-gray-500 text-sm">
                    <p>Need help finding something? Contact us at <a href="mailto:help@petadoption.com" className="text-rose-500 hover:underline">help@petadoption.com</a></p>
                </div>
            </div>
        </div>
    );
}

// SVG Illustrations
const DogSVG = () => (
    <svg viewBox="0 0 240 180" className="w-64 h-64 mx-auto">
        <circle cx="120" cy="100" r="70" fill="#FFE0B2" />
        <circle cx="85" cy="80" r="25" fill="#8D6E63" />
        <circle cx="155" cy="80" r="25" fill="#8D6E63" />
        <circle cx="85" cy="80" r="15" fill="#5D4037" />
        <circle cx="155" cy="80" r="15" fill="#5D4037" />
        <circle cx="120" cy="110" r="10" fill="#5D4037" />
        <ellipse cx="120" cy="125" rx="25" ry="15" fill="#8D6E63" />
        <path d="M105 140 Q120 155 135 140" stroke="#5D4037" strokeWidth="4" fill="none" />
        <path d="M65 45 Q75 15 95 30" stroke="#8D6E63" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M175 45 Q165 15 145 30" stroke="#8D6E63" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
);

const CatSVG = () => (
    <svg viewBox="0 0 240 180" className="w-64 h-64 mx-auto">
        <circle cx="120" cy="100" r="65" fill="#ECEFF1" />
        <path d="M85 70 L65 40 L80 65" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" />
        <path d="M155 70 L175 40 L160 65" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" />
        <circle cx="95" cy="85" r="10" fill="#37474F" />
        <circle cx="145" cy="85" r="10" fill="#37474F" />
        <ellipse cx="95" cy="85" rx="6" ry="10" fill="#263238" />
        <ellipse cx="145" cy="85" rx="6" ry="10" fill="#263238" />
        <circle cx="120" cy="105" r="5" fill="#FB8C00" />
        <path d="M105 115 Q120 125 135 115" stroke="#CFD8DC" strokeWidth="2" fill="none" />
        <path d="M110 125 Q120 135 130 125" stroke="#CFD8DC" strokeWidth="2" fill="none" />
    </svg>
);

const BunnySVG = () => (
    <svg viewBox="0 0 240 180" className="w-64 h-64 mx-auto">
        <circle cx="120" cy="110" r="60" fill="#F5F5F5" />
        <path d="M85 65 Q95 15 115 55" stroke="#EEEEEE" strokeWidth="20" fill="#F5F5F5" strokeLinecap="round" />
        <path d="M155 65 Q145 15 125 55" stroke="#EEEEEE" strokeWidth="20" fill="#F5F5F5" strokeLinecap="round" />
        <circle cx="100" cy="95" r="8" fill="#424242" />
        <circle cx="140" cy="95" r="8" fill="#424242" />
        <ellipse cx="120" cy="110" rx="10" ry="7" fill="#FFCDD2" />
        <path d="M110 120 Q120 130 130 120" stroke="#E0E0E0" strokeWidth="2" fill="none" />
        <ellipse cx="105" cy="140" rx="5" ry="3" fill="#F5F5F5" />
        <ellipse cx="135" cy="140" rx="5" ry="3" fill="#F5F5F5" />
    </svg>
);