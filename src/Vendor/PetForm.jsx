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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-11/12 max-w-xl max-h-[90vh] overflow-auto relative border border-gray-200">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <PawPrint size={20} /> {editingPetId ? "Edit Pet" : "Add New Furry Friend"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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
          <div className="grid grid-cols-2 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
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
                className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] focus:ring focus:ring-[#c8aefb] focus:outline-none bg-transparent transition ease-in-out"
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
              className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] focus:ring focus:ring-[#c8aefb] focus:outline-none bg-transparent transition ease-in-out"
              required
            >
              <option value="">Select Health Status</option>
              <option value="Vaccinated">Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </select>
          </div>

          {/* Good with */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Good With</label>
            <div className="flex flex-wrap gap-3">
              {["Children", "Other Dogs", "Cats"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
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
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Traits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Traits</label>
            <div className="flex flex-wrap gap-3">
              {["Playful", "Intelligent", "Friendly", "Calm"].map((trait) => (
                <label key={trait} className="flex items-center space-x-2">
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
                  <span className="text-sm">{trait}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="flex items-center border border-[#bfb3f2] rounded-lg px-2 py-1">
              <Upload size={18} className="text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="ml-2 outline-none text-sm"
              />
            </div>
            {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
            {formData.imageUrl && <p className="text-xs text-green-500">Image uploaded successfully!</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="flex items-start border border-[#bfb3f2] rounded-lg px-2 py-1">
              <Info size={18} className="text-gray-400 mt-1" />
              <textarea
                name="description"
                rows="3"
                placeholder="Tell us about this pet..."
                value={formData.description}
                onChange={(e) => handleInputChange({ target: { name: "description", value: e.target.value } })}
                required
                className="w-full ml-2 outline-none text-sm resize-none bg-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-3">
            <button onClick={handleCancel} type="button" className="px-3 py-1 text-xs text-gray-700 bg-white border rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              {editingPetId ? "Update Pet" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;