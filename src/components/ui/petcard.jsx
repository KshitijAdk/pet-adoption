import React from "react";
import Button from "./button";
import FavoriteButton from "./FavouriteButton";

const PetCard = ({ pet, onMeetClick }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full max-w-xs">
      {/* Image Container with Overlay Gradient */}
      <div className="relative">
        <div className="w-full">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-48 object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        </div>
        {/* Favorite Button - Positioned at the top right */}
        <div className="absolute top-2 right-2">
          <FavoriteButton petId={pet._id} />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* Pet Name on Overlay */}
        <h3 className="absolute bottom-2 left-3 text-lg font-bold text-white drop-shadow-md">{pet.name}</h3>
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Breed and Location */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-700 font-medium text-sm">{pet.breed}</p>
          <div className="flex items-center text-gray-600">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <p className="text-xs truncate max-w-[120px]">{pet.vendorId.address}</p>
          </div>
        </div>

        {/* Pet Attributes */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {pet.age} {pet.age === 1 ? 'year old' : 'years old'}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            {pet.gender}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {pet.size}
          </span>
        </div>

        {/* Meet Button - Pushed to bottom */}
        <div className="mt-auto">
          <Button
            onClick={() => onMeetClick(pet._id)}
            className="w-full py-2 text-sm font-medium rounded-md transition-colors duration-300"
          >
            Meet {pet.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;