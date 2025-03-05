import React from "react";
import { X, Image, User, Dog, Hash, Calendar, Info, PawPrint } from "lucide-react";

const PetForm = ({ formData, handleInputChange, handleSubmit, handleCancel, isOpen, editingPetId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md relative border border-gray-200">
        {/* Close Button */}
        <button onClick={handleCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PawPrint size={24} /> {editingPetId ? "Edit Pet" : "Add New Furry Friend"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <User size={20} className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter pet name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Dog size={20} className="text-gray-400" />
                <input
                  type="text"
                  name="species"
                  placeholder="e.g., Dog, Cat, Bird"
                  required
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none"
                />
              </div>
            </div>
            
            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Hash size={20} className="text-gray-400" />
                <input
                  type="text"
                  name="breed"
                  placeholder="Enter breed"
                  required
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="number"
                  name="age"
                  min="0"
                  placeholder="Enter age in years"
                  required
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none"
                />
              </div>
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Image size={20} className="text-gray-400" />
              <input
                type="url"
                name="imageUrl"
                placeholder="Enter image URL"
                required
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none"
              />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="flex items-start border rounded-lg px-3 py-2">
              <Info size={20} className="text-gray-400 mt-1" />
              <textarea
                name="description"
                rows="3"
                placeholder="Tell us about this pet..."
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none"
              />
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              {editingPetId ? "Update Pet" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;