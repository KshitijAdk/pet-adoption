import React, { useState } from "react";
import { X, User, Dog, Hash, Calendar, Info, PawPrint, Upload, Ruler } from "lucide-react";

const PetForm = ({ formData, handleInputChange, handleSubmit, handleCancel, isOpen, editingPetId, setFormData }) => {
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
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });

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
      <div className="bg-white rounded-2xl shadow-xl p-4 w-11/12 max-w-sm max-h-[90vh] overflow-auto relative border border-gray-200">
        <button onClick={handleCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <PawPrint size={20} /> {editingPetId ? "Edit Pet" : "Add New Furry Friend"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
            <div className="flex items-center border rounded-lg px-2 py-1">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter pet name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <div className="flex items-center border rounded-lg px-2 py-1">
                <Dog size={18} className="text-gray-400" />
                <input
                  type="text"
                  name="species"
                  placeholder="Dog, Cat, Bird"
                  required
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <div className="flex items-center border rounded-lg px-2 py-1">
                <Hash size={18} className="text-gray-400" />
                <input
                  type="text"
                  name="breed"
                  placeholder="Enter breed"
                  required
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <div className="flex items-center border rounded-lg px-2 py-1">
              <Ruler size={18} className="text-gray-400" />
              <input
                type="text"
                name="size"
                placeholder="Small, Medium, Large"
                required
                value={formData.size}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="flex items-center border rounded-lg px-2 py-1">
                <Calendar size={18} className="text-gray-400" />
                <input
                  type="number"
                  name="age"
                  min="0"
                  required
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full ml-2 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-2 py-1 outline-none bg-transparent text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <div className="flex items-center border rounded-lg px-2 py-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="flex items-start border rounded-lg px-2 py-1">
              <Info size={18} className="text-gray-400 mt-1" />
              <textarea
                name="description"
                rows="2"
                placeholder="Tell us about this pet..."
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full ml-2 outline-none text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-3">
            <button onClick={handleCancel} className="px-3 py-1 text-xs text-gray-700 bg-white border rounded-md hover:bg-gray-100">
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
