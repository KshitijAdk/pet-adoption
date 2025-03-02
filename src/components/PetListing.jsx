import { useState } from "react";
import { Search, Heart, ChevronDown } from "lucide-react";
import dog from '../assests/dog.jpg'
import cat from '../assests/cat.jpg'
import pets from '../assests/pets.png'
import Button from "./ui/button";

const allPets = [
  {
    name: "Buddy",
    breed: "Golden Retriever",
    location: "Seattle, WA",
    age: "Adult",
    gender: "Male",
    size: "Large",
    type: "Dog",
    image: dog,
  },
  {
    name: "Luna",
    breed: "Siamese",
    location: "Portland, OR",
    age: "Young",
    gender: "Female",
    size: "Medium",
    type: "Cat",
    image: cat,
  },
  {
    name: "Max",
    breed: "German Shepherd",
    location: "San Francisco, CA",
    age: "Puppy",
    gender: "Male",
    size: "Large",
    type: "Dog",
    image: pets,
  },
];

const PetListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    breed: "All",
    age: "All",
    gender: "All",
    size: "All",
  });
  const [sortBy, setSortBy] = useState("Recently Added");

  // Filter & Search Logic
  const filteredPets = allPets
    .filter((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pet) => (filters.type === "All" ? true : pet.type === filters.type))
    .filter((pet) => (filters.breed === "All" ? true : pet.breed === filters.breed))
    .filter((pet) => (filters.age === "All" ? true : pet.age === filters.age))
    .filter((pet) => (filters.gender === "All" ? true : pet.gender === filters.gender))
    .filter((pet) => (filters.size === "All" ? true : pet.size === filters.size));

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-amber-500 text-2xl font-bold text-center mb-4">
          Find Your Perfect Pet
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, breed, or description..."
            className="flex-grow outline-none px-2 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-6 flex gap-6">
        {/* Sidebar Filters */}
        <div className="w-1/4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              className="text-blue-500 text-sm"
              onClick={() =>
                setFilters({ type: "All", breed: "All", age: "All", gender: "All", size: "All" })
              }
            >
              Clear All
            </button>
          </div>

          {[
            { label: "Pet Type", key: "type", options: ["All", "Dog", "Cat"] },
            { label: "Breed", key: "breed", options: ["All", "Golden Retriever", "Siamese", "German Shepherd"] },
            { label: "Age", key: "age", options: ["All", "Puppy", "Young", "Adult"] },
            { label: "Gender", key: "gender", options: ["All", "Male", "Female"] },
            { label: "Size", key: "size", options: ["All", "Small", "Medium", "Large"] },
          ].map(({ label, key, options }) => (
            <div key={key} className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">{label}</label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Pet Listings */}
        <div className="w-3/4">
          {/* Sort By */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">
              Showing {filteredPets.length} of {allPets.length} pets
            </span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Recently Added</option>
                <option>Oldest</option>
                <option>Name A-Z</option>
                <option>Name Z-A</option>
              </select>
            </div>
          </div>

          {/* Pet Cards */}
          <div className="grid grid-cols-3 gap-6">
            {filteredPets.map((pet, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                  <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Heart className="text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{pet.name}</h3>
                  <p className="text-gray-500">{pet.breed}</p>
                  <p className="text-sm text-gray-600 flex items-center">📍 {pet.location}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.age}</span>
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.gender}</span>
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">{pet.size}</span>
                  </div>
                  <Button> Meet {pet.name}</Button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPets.length === 0 && <p className="text-center text-gray-500 mt-6">No pets found.</p>}
        </div>
      </div>
    </div>
  );
};

export default PetListing;
