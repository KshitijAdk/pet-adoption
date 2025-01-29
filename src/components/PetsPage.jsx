import React, { useState } from "react";
import { MapPinnedIcon } from "lucide-react";
import dog from "../assests/dog.jpg";
import cat from "../assests/cat.jpg";
import Navbar from "./Navbar";
import Footer from "./Footer";

const pets = [
  {
    id: 1,
    name: "Biralo",
    image: cat,
    location: "Kathmandu",
    vendor: "Diparshan's Pet Store",
    vendorImage: dog,
  },
  {
    id: 2,
    name: "Khairi Biraali",
    image: dog,
    location: "Kathmandu",
    vendor: "Diparshan's Pet Store",
    vendorImage: cat,
  },
  {
    id: 3,
    name: "Cooper",
    image: cat,
    location: "Kathmandu",
    vendor: "Hamro Pet Store",
    vendorImage: dog,
  },
  {
    id: 4,
    name: "Jack",
    image: dog,
    location: "Kathmandu",
    vendor: "Hamro Pet Store",
    vendorImage: cat,
  },
];

export default function PetsPage() {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const handleSpeciesChange = (e) => {
    setSelectedSpecies(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-blue-100 min-h-screen">
        <div className="mx-auto max-w-screen-lg">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Pets to Adopt</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-8 bg-white rounded-lg p-6 shadow">
            <div className="w-1/2">
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                Species
              </label>
              <select
                id="species"
                name="species"
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedSpecies}
                onChange={handleSpeciesChange}
              >
                {!selectedSpecies && <option value="">Select species</option>}
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedGender}
                onChange={handleGenderChange}
              >
                {!selectedGender && <option value="">Select gender</option>}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Pet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="absolute top-2 left-2 bg-green-400 text-white text-xs px-2 py-1 rounded">
                    <MapPinnedIcon size={12} className="inline-block mr-1" />
                    {pet.location}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <img
                    src={pet.vendorImage}
                    alt={pet.vendor}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                    <p className="text-sm text-gray-500">By {pet.vendor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
