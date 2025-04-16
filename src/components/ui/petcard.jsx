// PetCard.js
import React from "react";
import Button from "./button";
import FavoriteButton from "./FavouriteButton";

const PetCard = ({ pet, onMeetClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-60 object-cover object-center"  // Adjusted to make it more flexible
        />
        <FavoriteButton petId={pet._id} />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-bold">{pet.name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">{pet.breed}</p>
          <p className="text-sm text-gray-600">📍 {pet.vendorId.address}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.age} years old</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.gender}</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.size}</span>
        </div>
        <Button onClick={() => onMeetClick(pet._id)} className="mt-3 w-full">
          Meet {pet.name}
        </Button>
      </div>

    </div>
  );
};

export default PetCard;
