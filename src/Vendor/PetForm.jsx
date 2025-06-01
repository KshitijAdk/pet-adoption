import React, { useState } from "react";
import { X, Upload, Info, PawPrint } from "lucide-react";
import InputField from "../components/ui/InputField";

const PetForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  isOpen,
  editingPetId,
  setFormData,
}) => {
  const [uploading, setUploading] = useState(false);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();
      if (setFormData) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl w-full max-w-sm sm:max-w-xl max-h-[95vh] sm:max-h-[90vh] overflow-auto relative border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-2xl">
          <button
            onClick={handleCancel}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 pr-8">
            <PawPrint size={18} className="sm:w-5 sm:h-5" />
            <span className="truncate">
              {editingPetId ? "Edit Pet" : "Add New Furry Friend"}
            </span>
          </h2>
        </div>

        {/* Form Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-4">
            {/* Pet Name */}
            <InputField
              id="name"
              label="Pet Name"
              placeholder="Enter pet name"
              value={formData.name}
              onChange={(e) => handleInputChange({ target: { name: "name", value: e.target.value } })}
              required
            />

            {/* Species and Breed */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <InputField
                id="species"
                label="Species"
                placeholder="Dog, Cat, Bird"
                value={formData.species}
                onChange={(e) => handleInputChange({ target: { name: "species", value: e.target.value } })}
                required
              />
              <InputField
                id="breed"
                label="Breed"
                placeholder="Enter breed"
                value={formData.breed}
                onChange={(e) => handleInputChange({ target: { name: "breed", value: e.target.value } })}
                required
              />
            </div>

            {/* Size */}
            <InputField
              id="size"
              label="Size"
              placeholder="Small, Medium, Large"
              value={formData.size}
              onChange={(e) => handleInputChange({ target: { name: "size", value: e.target.value } })}
              required
            />

            {/* Age and Gender */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <InputField
                id="age"
                label="Age"
                type="number"
                placeholder="Age in years"
                value={formData.age.toString()}
                onChange={(e) => handleInputChange({ target: { name: "age", value: e.target.value } })}
                min="0"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange({ target: { name: "gender", value: e.target.value } })}
                  className="w-full h-11 sm:h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] focus:ring focus:ring-[#c8aefb] focus:outline-none bg-transparent transition ease-in-out"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Weight */}
            <InputField
              id="weight"
              label="Weight (lbs)"
              type="number"
              placeholder="Enter weight in lbs"
              value={formData.weight.toString()}
              onChange={(e) => handleInputChange({ target: { name: "weight", value: e.target.value } })}
              min="0"
              required
            />

            {/* Health */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health</label>
              <select
                name="health"
                value={formData.health}
                onChange={(e) => handleInputChange({ target: { name: "health", value: e.target.value } })}
                className="w-full h-11 sm:h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] focus:ring focus:ring-[#c8aefb] focus:outline-none bg-transparent transition ease-in-out"
                required
              >
                <option value="">Select Health Status</option>
                <option value="Vaccinated">Vaccinated</option>
                <option value="Not Vaccinated">Not Vaccinated</option>
              </select>
            </div>

            {/* Good with */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Good With</label>
              <div className="space-y-3 sm:space-y-2">
                {["Children", "Other Dogs", "Cats"].map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="goodWith"
                      value={option}
                      checked={formData.goodWith?.includes(option)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedGoodWith = isChecked
                          ? [...formData.goodWith, option]
                          : formData.goodWith.filter((item) => item !== option);
                        handleInputChange({ target: { name: "goodWith", value: updatedGoodWith } });
                      }}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Traits</label>
              <div className="space-y-3 sm:space-y-2">
                {["Playful", "Intelligent", "Friendly", "Calm"].map((trait) => (
                  <label key={trait} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="traits"
                      value={trait}
                      checked={formData.traits?.includes(trait)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedTraits = isChecked
                          ? [...formData.traits, trait]
                          : formData.traits.filter((item) => item !== trait);
                        handleInputChange({ target: { name: "traits", value: updatedTraits } });
                      }}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium">{trait}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div className="flex items-center border border-[#bfb3f2] rounded-lg px-3 py-3 sm:px-2 sm:py-2">
                <Upload size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="ml-3 sm:ml-2 outline-none text-sm flex-1 min-w-0"
                />
              </div>
              {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
              {formData.imageUrl && <p className="text-xs text-green-500 mt-2">Image uploaded successfully!</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="flex items-start border border-[#bfb3f2] rounded-lg px-3 py-3 sm:px-2 sm:py-2">
                <Info size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Tell us about this pet..."
                  value={formData.description}
                  onChange={(e) => handleInputChange({ target: { name: "description", value: e.target.value } })}
                  required
                  className="w-full ml-3 sm:ml-2 outline-none text-sm resize-none bg-transparent min-h-[80px]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mt-6">
              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="w-full sm:w-auto px-4 py-2.5 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 sm:px-3 sm:py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {editingPetId ? "Update Pet" : "Add Pet"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetForm;