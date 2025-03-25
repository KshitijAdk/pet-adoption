import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";

const SearchBar = ({ placeholder = "Search...", searchTerm, setSearchTerm, toggleFilters, showFilters }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-6xl mx-auto flex items-center gap-2">
            <div className="flex-1">
                {/* <label className="text-xs font-medium text-gray-600 mb-1 block">Search</label> */}
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden px-2 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="flex-grow outline-none px-2 text-sm text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <button
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 flex items-center gap-1 text-sm hover:bg-gray-100 self-end sm:self-auto"
                onClick={toggleFilters}
            >
                <SlidersHorizontal size={16} className="mr-1" /> {showFilters ? "Hide" : "Filters"}
            </button>
        </div>
    );
};

const FilterDropdown = ({ filters, setFilters, showFilters, toggleFilters }) => {
    if (!showFilters) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 bg-white rounded-lg p-4 shadow-md max-w-6xl mx-auto"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Filters</h3>
                <button
                    className="text-blue-500 text-xs flex items-center"
                    onClick={() => {
                        setFilters({ type: "All", breed: "All", age: "All", gender: "All", size: "All" });
                        toggleFilters(); // Close the dropdown
                    }}
                >
                    <X size={14} className="mr-1" /> Clear All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: "Pet Type", key: "type", options: ["All", "Dog", "Cat"] },
                    { label: "Breed", key: "breed", options: ["All", "Golden", "Siamese", "German Shepherd"] },
                    { label: "Age", key: "age", options: ["All", "Puppy", "Young", "Adult"] },
                    { label: "Gender", key: "gender", options: ["All", "Male", "Female"] },
                    { label: "Size", key: "size", options: ["All", "Small", "Medium", "Large"] },
                ].map(({ label, key, options }) => (
                    <div key={key} className="relative">
                        <label className="block text-gray-700 text-xs font-medium mb-1">{label}</label>
                        <div className="relative">
                            <select
                                className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none"
                                value={filters[key]}
                                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                            >
                                {options.map((option) => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-3 text-gray-400 text-sm" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export { SearchBar, FilterDropdown };
