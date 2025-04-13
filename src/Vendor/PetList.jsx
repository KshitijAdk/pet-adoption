import React from 'react';
import PetItem from './PetItem';

const PetList = ({ pets = [], onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
                <div className="px-4 py-6 text-center text-gray-500">
                    No pets found. Add a new pet to get started.
                </div>
            )}
        </div>
    );
};

export default PetList;
