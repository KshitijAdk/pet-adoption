import React from 'react';
import PetItem from './PetItem';

const PetList = ({ pets = [], onEdit, onDelete }) => {
    return (
        <div className="w-full">
            <div className="bg-white shadow overflow-hidden rounded-lg sm:rounded-md lg:rounded-lg">
                {pets.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {pets
                            .filter((pet) => pet && pet._id)
                            .map((pet) => (
                                <PetItem
                                    key={pet._id}
                                    pet={pet}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                    </ul>
                ) : (
                    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="mx-auto h-12 w-12 sm:h-16 sm:w-16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                                No pets found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                Add a new pet to get started managing your pet adoption listings.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetList;