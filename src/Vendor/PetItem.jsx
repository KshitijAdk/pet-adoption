import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const PetItem = ({ pet, handleEditPet, handleDeletePet }) => {
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={pet.imageUrl}
                alt={pet.name}
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
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                pet.status === 'Available'
                  ? 'bg-green-100 text-green-800'
                  : pet.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {pet.status}
            </span>
            <button
              onClick={() => handleEditPet(pet)}
              className="text-gray-400 hover:text-gray-500"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDeletePet(pet.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">{pet.description}</div>
      </div>
    </li>
  );
};

export default PetItem;