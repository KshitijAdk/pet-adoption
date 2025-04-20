import React from 'react';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`bg-gray-200 animate-pulse rounded-md ${className || ''}`}
            {...props}
        />
    );
};

// Variants for different skeleton types
export const SkeletonCard = () => (
    <div className="space-y-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
    </div>
);

export const SkeletonTable = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
        ))}
    </div>
);

export const SkeletonImage = ({ className }) => (
    <Skeleton className={`aspect-square ${className || ''}`} />
);