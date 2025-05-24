import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { usePets } from "../context/PetContext";
import { SearchBar, FilterDropdown } from "./ui/SearchFilter";
import PetCard from "./ui/petcard";

const PetListing = () => {
  const { userData } = useContext(AppContent);
  const { pets, loading, error } = usePets();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "All",
    age: "All",
    gender: "All",
    size: "All",
  });
  const [sortBy, setSortBy] = useState("Recently Added");
  const navigate = useNavigate();

  const handleMeetClick = (petId) => {
    navigate(`/pets/${petId}`);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // Helper function to check if pet age falls within the selected range
  const isAgeInRange = (petAge, range) => {
    if (range === "All") return true;
    const [min, max] = range.includes("+")
      ? [parseInt(range), Infinity]
      : range.split("-").map((val) => parseInt(val));
    return petAge >= min && (max === Infinity || petAge <= max);
  };

  // Filter and sort logic
  const filteredPets = pets
    .filter((pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.size.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((pet) => (filters.type === "All" ? true : pet.species === filters.type))
    .filter((pet) => isAgeInRange(pet.age, filters.age))
    .filter((pet) => (filters.gender === "All" ? true : pet.gender === filters.gender))
    .filter((pet) => (filters.size === "All" ? true : pet.size === filters.size))
    .sort((a, b) => {
      if (sortBy === "Recently Added") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Name Z-A") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <h1 className="text-amber-500 text-4xl font-bold text-center mb-4">Find Your Perfect Pet</h1>

      <div className="max-w-6xl mx-auto">
        <SearchBar
          searchTerm={searchTerm}
          placeholder="Search by name, type, gender, or size"
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
        {loading ? (
          <p className="text-center text-gray-600">Loading pets...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
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

            {filteredPets.length === 0 && (
              <p className="text-center text-gray-500 mt-6">No pets found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PetListing;