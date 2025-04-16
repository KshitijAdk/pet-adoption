import React, { useContext, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FavouriteButton from '../ui/FavouriteButton';

const FavoritePets = () => {
    const { userData } = useContext(AppContent);
    const [favoritePets, setFavoritePets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoritePets = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/pets/favourite/${userData.userId}`);
                setFavoritePets(response.data.favouritePets);

            } catch (error) {
                console.error("Error fetching favorite pets", error);
                setError('Error fetching favorite pets');
            } finally {
                setLoading(false);
            }
        };

        if (userData?.userId) {
            fetchFavoritePets();
        }
    }, [userData]);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Favorite Pets</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Pets you've saved to consider for adoption.
                </p>
            </div>

            <div className="px-6 py-5">
                {loading && <div className="text-center py-12">Loading...</div>}

                {error && !loading && (
                    <div className="text-center py-12 text-red-500">{error}</div>
                )}

                {!loading && favoritePets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {favoritePets.map((pet) => (
                            <div key={pet._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 w-full relative">
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {/* FavoriteButton used here */}
                                    <div className="absolute top-3 right-3">
                                        <FavouriteButton petId={pet._id} isInitiallyFavorited={true} />                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {pet.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <span className="mr-2">{pet.breed}</span>
                                        <span>•</span>
                                        <span className="mx-2">{pet.age} yrs</span>
                                        <span>•</span>
                                        <span className="ml-2">{pet.species}</span>
                                    </div>
                                    <div className="mt-4 flex space-x-3">
                                        <Link to={`/pets/${pet._id}`}>
                                            <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
                                                View Details
                                            </button>
                                        </Link>
                                        <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                            Adopt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="text-center py-12">
                        <Heart className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No favorite pets yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Save pets you're interested in to your favorites list.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/pets"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                            >
                                Browse Available Pets
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritePets;
