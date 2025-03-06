import React from 'react';
import { Dog } from 'lucide-react';

const Loading = ({ text = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center space-y-4 bg-white p-6 rounded-lg shadow-lg">
                <Dog className="animate-spin h-10 w-10 text-amber-600" />
                <p className="text-lg text-gray-900">{text}</p>
            </div>
        </div>
    );
};

export default Loading;