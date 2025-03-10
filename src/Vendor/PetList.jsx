import React from 'react';
import PetItem from './PetItem';

const PetList = ({ pets = [], handleEditPet, handleDeletePet }) => {
    console.log("Pets array:", pets);
    if (pets?.length > 0) {
        console.log("First pet object:", pets[0]);
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {pets?.length > 0 ? (
                    pets.filter((pet) => pet && pet._id).map((pet) => (
                        <PetItem
                            key={pet._id}
                            pet={pet}
                            handleEditPet={handleEditPet}
                            handleDeletePet={handleDeletePet}
                        />
                    ))
                ) : (
                    <li className="px-4 py-5 text-center text-gray-500">
                        No pets found. Add a new pet to get started.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default PetList;