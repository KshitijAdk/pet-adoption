import React from 'react';

export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div
            className={`border-b border-gray-200 px-4 py-3 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3
            className={`text-lg font-semibold text-gray-900 ${className || ''}`}
            {...props}
        >
            {children}
        </h3>
    );
};

export const CardContent = ({ className, children, ...props }) => {
    return (
        <div
            className={`p-4 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};