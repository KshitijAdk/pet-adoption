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
                <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={pet.imageUrl || '/default-pet.jpg'}
                                    alt={pet.name}
                                    onError={(e) => (e.target.src = '/default-pet.jpg')}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium text-indigo-600 truncate">
                                        {pet.name}
                                    </div>
                                    <div className="flex items-center space-x-1 ml-2">
                                        <button
                                            onClick={() => onEdit(pet)}
                                            className="p-1 text-gray-400 hover:text-gray-500"
                                            aria-label="Edit pet"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={handleDeleteClick}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                            aria-label="Delete pet"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    <div>{pet.species} • {pet.breed}</div>
                                    <div>{pet.age} years old • {pet.gender}</div>
                                </div>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs leading-4 font-semibold rounded-full ${pet.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : pet.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {pet.status}
                                </span>
                            </div>
                        </div>
                        {pet.description && (
                            <div className="mt-3 text-sm text-gray-500 pl-15">
                                {pet.description}
                            </div>
                        )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full object-cover"
                                        src={pet.imageUrl || '/default-pet.jpg'}
                                        alt={pet.name}
                                        onError={(e) => (e.target.src = '/default-pet.jpg')}
                                    />
                                </div>
                                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                                    <div className="text-sm font-medium text-indigo-600 truncate">
                                        {pet.name}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                        <span className="hidden lg:inline">
                                            {pet.species} • {pet.breed} • {pet.age} years old • {pet.gender}
                                        </span>
                                        <span className="lg:hidden">
                                            <div>{pet.species} • {pet.breed}</div>
                                            <div className="mt-0.5">{pet.age} years old • {pet.gender}</div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3 ml-4">
                                <span
                                    className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full whitespace-nowrap ${pet.status === 'Available'
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
                                    className="p-1 text-gray-400 hover:text-gray-500"
                                    aria-label="Edit pet"
                                >
                                    <Edit size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                    aria-label="Delete pet"
                                >
                                    <Trash2 size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                </button>
                            </div>
                        </div>
                        {pet.description && (
                            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 ml-15 sm:ml-16 lg:ml-20">
                                {pet.description}
                            </div>
                        )}
                    </div>
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