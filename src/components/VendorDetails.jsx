import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Calendar, LucidePawPrint, Users, HeartHandshake, ExternalLink } from 'lucide-react';
import PetCard from './ui/petcard';

const VendorDetails = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('gallery');

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/vendors/${vendorId}`);
                const data = await res.json();
                if (data.success) {
                    setVendor(data.data);
                } else {
                    setError('Vendor not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Something went wrong while fetching the vendor.');
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);

    const handleMeetClick = (petId) => {
        navigate(`/pets/${petId}`);
    };

    const handleDonate = () => {
        // Implement donation logic here
        alert('Thank you for your interest in donating! This feature is coming soon.');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-amber-300 border-t-amber-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LucidePawPrint className="h-6 w-6 text-amber-500" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="bg-red-50 p-8 rounded-xl shadow-md text-red-600 max-w-md mx-auto">
                    <p className="text-lg font-medium text-center">{error}</p>
                    <button
                        onClick={() => navigate('/vendors')}
                        className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Back to Vendors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 min-h-screen">
            {/* Hero Section with Parallax Effect */}
            <div className="relative h-96 overflow-hidden bg-gradient-to-r from-amber-500 to-amber-400">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-amber-500/90"></div>
                <div className="relative h-full container mx-auto px-6 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-8 md:mb-0">
                            <h1 className="text-5xl font-bold mb-3 text-white tracking-tight">{vendor.organization}</h1>
                            <p className="text-amber-100 text-xl max-w-xl">
                                Making tails wag and hearts purr since {new Date(vendor.createdAt).getFullYear()}
                            </p>
                        </div>
                        <button
                            onClick={handleDonate}
                            className="px-8 py-4 bg-white text-amber-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-amber-50 hover:scale-105 transition-all duration-300 flex items-center"
                        >
                            <HeartHandshake className="w-6 h-6 mr-2" />
                            Donate Now
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent"></div>
            </div>

            {/* Organization Details Section */}
            <div className="container mx-auto px-6 -mt-24 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 backdrop-blur-sm bg-white/90">
                    <div className="md:flex gap-12">
                        <div className="md:w-1/3 mb-8 md:mb-0">
                            <div className="relative rounded-xl overflow-hidden shadow-lg group">
                                <img
                                    src={vendor.image}
                                    alt={vendor.organization}
                                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <h3 className="text-xl font-bold">{vendor.organization}</h3>
                                    <p className="text-amber-200">Rescue & Adoption Center</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-2/3">
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="bg-green-100 text-green-800 px-5 py-2 rounded-full flex items-center shadow-sm">
                                    <LucidePawPrint className="w-5 h-5 mr-2" />
                                    <span className="font-medium">{vendor.availablePetsCount} Pets Available</span>
                                </div>
                                <div className="bg-amber-100 text-amber-800 px-5 py-2 rounded-full flex items-center shadow-sm">
                                    <Users className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Managed by {vendor.fullName}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                                        <Mail className="w-5 h-5 mr-2 text-amber-500" />
                                        Contact Information
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center text-gray-700">
                                            <Mail className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                                            <span className="truncate">{vendor.email}</span>
                                        </li>
                                        <li className="flex items-center text-gray-700">
                                            <Phone className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                                            {vendor.contact}
                                        </li>
                                        <li className="flex items-start text-gray-700">
                                            <MapPin className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0 mt-1" />
                                            <span>{vendor.address}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                                        <Heart className="w-5 h-5 mr-2 text-amber-500" />
                                        About Us
                                    </h3>
                                    <p className="text-gray-700 mb-4 line-clamp-4">{vendor.description}</p>
                                    <div className="flex items-center text-gray-600 mt-auto pt-2 border-t border-gray-200">
                                        <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                                        <span>Member since {formatDate(vendor.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="container mx-auto px-6 mb-8">
                <div className="flex space-x-4 border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'gallery'
                            ? 'text-amber-600 border-b-2 border-amber-500'
                            : 'text-gray-600 hover:text-amber-500'}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        Photo Gallery
                    </button>
                    <button
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'pets'
                            ? 'text-amber-600 border-b-2 border-amber-500'
                            : 'text-gray-600 hover:text-amber-500'}`}
                        onClick={() => setActiveTab('pets')}
                    >
                        Available Pets
                    </button>
                </div>
            </div>

            {/* Enhanced Pet Gallery Section - Modern Overlapping Grid with Hover Effects */}
            {activeTab === 'gallery' && (
                <div className="container mx-auto px-6 py-8">
                    <div className="relative overflow-hidden">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {vendor.pets.map((pet, index) => (
                                <div
                                    key={pet._id}
                                    className={`group relative aspect-[3/4] transform transition-all duration-500 
                                        ${index % 3 === 0 ? 'translate-y-8' : ''} 
                                        ${index % 3 === 1 ? '-translate-y-8' : ''}
                                        ${index % 2 === 0 ? 'md:rotate-2' : 'md:-rotate-2'}
                                        hover:rotate-0 hover:scale-110 hover:z-10`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="w-full h-full object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <h3 className="text-xl font-bold">{pet.name}</h3>
                                        <p className="text-amber-200">{pet.breed}</p>
                                        <button
                                            onClick={() => handleMeetClick(pet._id)}
                                            className="mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors flex items-center"
                                        >
                                            <Heart className="w-4 h-4 mr-2" />
                                            Meet {pet.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Available Pets Section */}
            {activeTab === 'pets' && (
                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vendor.pets.map(pet => (
                            <PetCard
                                key={pet._id}
                                pet={{ ...pet, vendorId: { address: vendor.address } }}
                                onMeetClick={handleMeetClick}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Testimonials or CTA Section */}
            <div className="bg-amber-500 py-16 mt-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Companion?</h2>
                    <p className="text-amber-100 text-lg max-w-2xl mx-auto mb-8">
                        Every pet deserves a loving home. Visit us today to meet our amazing pets waiting for adoption.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => window.open(`https://maps.google.com/?q=${vendor.address}`, '_blank')}
                            className="px-8 py-3 bg-white text-amber-600 rounded-lg font-semibold flex items-center justify-center hover:bg-amber-50 transition-colors"
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            Visit Us
                        </button>
                        <button
                            onClick={handleDonate}
                            className="px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-amber-700 transition-colors"
                        >
                            <HeartHandshake className="w-5 h-5 mr-2" />
                            Support Our Mission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;