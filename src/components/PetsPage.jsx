import React from "react";
import { MapPinnedIcon } from "lucide-react";
import dog from "../assests/dog.jpg";
import cat from "../assests/cat.jpg";
import Navbar from "./Navbar";
import Footer from "./Footer";

const pets = [
  {
    id: 1,
    name: "Biralo",
    image: cat, // Replace with actual image URL
    location: "Kathmandu",
    vendor: "Diparshan's Pet Store",
    vendorImage: dog, // Replace with actual vendor image URL
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
  return (
    <>
      <Navbar />
      <div className="p-6 bg-blue-100 min-h-screen">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Pets to Adopt</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="w-1/2">
            <label htmlFor="species" className="block text-sm font-medium text-gray-700">
              Species
            </label>
            <select
              id="species"
              name="species"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option>Select species</option>
              <option>Cat</option>
              <option>Dog</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
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
      <Footer />
    </>
  );
}
