import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import ConfirmationPopup from '../components/ui/ConfirmationPopup';

const PetItem = ({ pet, onEdit, onDelete }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        onDelete(pet._id);
        setShowDeleteConfirmation(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <>
            <li className="border-b border-gray-200">
                <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                                <img
                                    className="h-16 w-16 rounded-full object-cover"
                                    src={pet.imageUrl || '/default-pet.jpg'}
                                    alt={pet.name}
                                    onError={(e) => (e.target.src = '/default-pet.jpg')}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-indigo-600">{pet.name}</div>
                                <div className="text-sm text-gray-500">
                                    {pet.species} • {pet.breed} • {pet.age} years old • {pet.gender}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pet.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : pet.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                            >
                                {pet.status}
                            </span>
                            <button
                                onClick={() => onEdit(pet)}
                                className="text-gray-400 hover:text-gray-500"
                                aria-label="Edit pet"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="text-gray-400 hover:text-red-500"
                                aria-label="Delete pet"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    {pet.description && (
                        <div className="mt-2 text-sm text-gray-500">{pet.description}</div>
                    )}
                </div>
            </li>

            <ConfirmationPopup
                isOpen={showDeleteConfirmation}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                type="delete"
                title={`Delete ${pet.name}`}
                message={`Are you sure you want to permanently delete ${pet.name}? This action cannot be undone.`}
                confirmText="Delete Pet"
                confirmColor="bg-red-600"
            />
        </>
    );
};

export default PetItem;
