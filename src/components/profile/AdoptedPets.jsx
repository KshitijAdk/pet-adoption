import React, { useContext, useState, useEffect } from 'react';
import { Calendar, PawPrint } from 'lucide-react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';

const AdoptedPets = () => {
    const { userData } = useContext(AppContent);
    const [adoptedPets, setAdoptedPets] = useState([]);

    useEffect(() => {
        const fetchAdoptedPets = async () => {
            try {
                console.log("Fetching adopted pets for user:", userData.userId);

                // Make a GET request to fetch adopted pet IDs by userId
                const response = await axios.get(`http://localhost:3000/api/adoption/${userData.userId}`);
                console.log("Adopted Pet IDs:", response.data.adoptedPets);

                if (response.status === 200 && Array.isArray(response.data.adoptedPets)) {
                    const petDataPromises = response.data.adoptedPets.map(async (petId) => {
                        try {
                            const petResponse = await axios.get(`http://localhost:3000/api/pets/${petId}`);
                            console.log("Fetched pet data:", petResponse.data);
                            return petResponse.data;
                        } catch (error) {
                            console.error(`Error fetching pet data for ID ${petId}:`, error);
                            return null;
                        }
                    });

                    const petData = await Promise.all(petDataPromises);
                    const validPets = petData.filter((pet) => pet !== null);
                    console.log("Final Adopted Pets Data:", validPets);
                    setAdoptedPets(validPets);
                } else {
                    console.warn("Unexpected response status or data format:", response.status);
                }
            } catch (error) {
                console.error("Error fetching adopted pet IDs:", error);
            }
        };

        if (userData.userId) {
            fetchAdoptedPets();
        } else {
            console.warn("No userId found in userData");
        }
    }, [userData.userId]);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">My Adopted Pets</h3>
                <p className="mt-1 text-sm text-gray-500">
                    The furry friends who have found their forever home with you.
                </p>
            </div>

            <div className="px-6 py-5">
                {adoptedPets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {adoptedPets.map((pet) => (
                            <div key={pet._id || pet.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 w-full relative">
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <span className="mr-2">{pet.breed}</span>
                                        <span>•</span>
                                        <span className="mx-2">{pet.age}</span>
                                        <span>•</span>
                                        <span className="ml-2">{pet.species}</span>  {/* Updated to use species */}
                                    </div>
                                    <div className="mt-3 flex items-center text-sm">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">Adopted on {new Date(pet.createdAt).toLocaleDateString()}</span>  {/* Format date */}
                                    </div>
                                    <div className="mt-4 flex space-x-3">
                                        <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
                                            View Details
                                        </button>
                                        <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Care Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <PawPrint className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No adopted pets yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start your adoption journey today and find your perfect companion.
                        </p>
                        <div className="mt-6">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                                Browse Available Pets
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdoptedPets;
