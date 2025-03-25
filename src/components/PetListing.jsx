// PetListing.js
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { SearchBar, FilterDropdown } from "./ui/SearchFilter";
import PetCard from "./ui/petcard";

const PetListing = () => {
  const { userData } = useContext(AppContent);
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "All",
    breed: "All",
    age: "All",
    gender: "All",
    size: "All",
  });
  const [sortBy, setSortBy] = useState("Recently Added");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/vendors/all-vendors");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const allPets = result.data.flatMap((vendor) =>
            vendor.pets.map((pet) => ({
              ...pet,
              location: vendor.address,
            }))
          );
          setPets(allPets);
        } else {
          console.error("Unexpected response format:", result);
          setPets([]);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        setPets([]);
      }
    };
    fetchPets();
  }, []);

  const handleMeetClick = (petId) => {
    navigate(`/pets/${petId}`);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const filteredPets = pets
    .filter((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pet) => (filters.type === "All" ? true : pet.species === filters.type))
    .filter((pet) => (filters.breed === "All" ? true : pet.breed === filters.breed))
    .filter((pet) => (filters.age === "All" ? true : pet.age === filters.age))
    .filter((pet) => (filters.gender === "All" ? true : pet.gender === filters.gender))
    .filter((pet) => (filters.size === "All" ? true : pet.size === filters.size));

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <h1 className="text-amber-500 text-4xl font-bold text-center mb-4">Find Your Perfect Pet</h1>

      <div className="max-w-6xl mx-auto">
        <SearchBar
          searchTerm={searchTerm}
          placeholder="Breed, Gender, Size"
          setSearchTerm={setSearchTerm}
          toggleFilters={toggleFilters}
          showFilters={showFilters}
        />
        <FilterDropdown
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
        />
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700">
            Showing {filteredPets.length} of {pets.length} pets
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              className="h-10 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard key={pet._id} pet={pet} onMeetClick={handleMeetClick} />
          ))}
        </div>

        {filteredPets.length === 0 && <p className="text-center text-gray-500 mt-6">No pets found.</p>}
      </div>
    </div>
  );
};

export default PetListing;
