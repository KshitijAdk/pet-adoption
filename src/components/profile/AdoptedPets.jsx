import React, { useContext, useState, useEffect } from 'react';
import { Calendar, PawPrint } from 'lucide-react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdoptedPets = () => {
    const { userData, backendUrl } = useContext(AppContent);
    const [adoptedPets, setAdoptedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdoptedPets = async () => {
            try {
                if (!userData?.userId) {
                    console.warn("No userId found in userData");
                    setLoading(false);
                    return;
                }

                setLoading(true);
                setError(null);

                const response = await axios.get(`${backendUrl}/api/adoption/adopted/${userData.userId}`);

                if (response.data?.adoptedPets) {
                    setAdoptedPets(response.data.adoptedPets);
                } else {
                    setAdoptedPets([]);
                }
            } catch (error) {
                console.error("Error fetching adopted pets:", error);
                setError("Failed to fetch adopted pets. Please try again later.");
                setAdoptedPets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptedPets();
    }, [userData?.userId]);



    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">My Adopted Pets</h3>
                </div>
                <div className="px-6 py-12 text-center">
                    <div className="animate-pulse flex justify-center">
                        <PawPrint className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading your adopted pets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">My Adopted Pets</h3>
                </div>
                <div className="px-6 py-12 text-center">
                    <PawPrint className="mx-auto h-12 w-12 text-red-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading pets</h3>
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            <div key={pet._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 w-full relative">
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Pet+Image';
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <span className="mr-2">{pet.breed}</span>
                                        <span>•</span>
                                        <span className="mx-2">{pet.age} years</span>
                                        <span>•</span>
                                        <span className="ml-2">{pet.gender}</span>
                                    </div>
                                    <div className="mt-3 flex items-center text-sm">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">
                                            Adopted on {new Date(pet.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex space-x-3">
                                        <Link
                                            to={`/pets/${pet._id}`}
                                            className="flex-1"
                                        >
                                            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
                                                View Info
                                            </button>

                                        </Link>
                                        <Link
                                            to={`/pets/${pet._id}/care`}
                                            className="flex-1"
                                        >
                                            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                Care Info
                                            </button>
                                        </Link>
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
                            <Link to="/pets">
                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                                    Browse Available Pets
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdoptedPets;