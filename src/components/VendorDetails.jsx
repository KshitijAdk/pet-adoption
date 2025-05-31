import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Heart, Mail, Phone, MapPin, Calendar, Users, HeartHandshake,
    X, Camera, PawPrint, Clock, Award, ExternalLink, Info
} from 'lucide-react';
import PetCard from './ui/petcard';
import { AppContent } from '../context/AppContext';

const VendorDetails = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('gallery');
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { backendUrl } = useContext(AppContent);

    // Fetch vendor data
    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/vendors/${vendorId}`);
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

    // Auto-open donate modal when the component mounts
    useEffect(() => {
        setShowDonateModal(true); // Open the donate modal automatically
    }, []); // Empty dependency array ensures this runs only once on mount

    // Handle scroll behavior for modals
    useEffect(() => {
        if (showDonateModal || selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showDonateModal, selectedImage]);

    const handleMeetClick = (petId) => {
        navigate(`/pets/${petId}`);
    };

    const handleDonate = () => {
        setShowDonateModal(true);
    };

    const closeDonateModal = () => {
        setShowDonateModal(false);
    };

    const openImagePreview = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImagePreview = () => {
        setSelectedImage(null);
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 text-amber-600">
                <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin mb-4"></div>
                <p className="text-lg font-medium animate-pulse">Loading shelter details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="bg-amber-50 p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-5">
                        <Info className="w-8 h-8 text-amber-600" />
                    </div>
                    <p className="text-xl font-medium text-amber-600 mb-4">{error}</p>
                    <p className="text-gray-600 mb-6">The shelter you're looking for might have been moved or no longer exists.</p>
                    <button
                        onClick={() => navigate('/vendors')}
                        className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md"
                    >
                        Browse All Shelters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen text-gray-800">
            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 overflow-auto"
                    onClick={closeImagePreview}
                >
                    <div
                        className="relative max-w-3xl w-full max-h-screen p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeImagePreview}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors shadow-lg"
                            aria-label="Close image preview"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Donate Modal */}
            {showDonateModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-auto">
                    <div
                        className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-xl max-h-screen overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-3 right-3">
                            <button
                                onClick={closeDonateModal}
                                className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
                                aria-label="Close donation modal"
                            >
                                <X className="w-5 h-5 text-amber-700" />
                            </button>
                        </div>

                        <div className="text-center mb-6 pt-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                                <HeartHandshake className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-amber-600">Support {vendor.organization}</h3>
                            <p className="text-gray-600 mt-2">
                                Your donation helps animals in need find their forever homes
                            </p>
                        </div>

                        <div className="flex justify-center mb-6">
                            <img
                                src={vendor.fonepayQr}
                                alt="Fonepay QR Code"
                                className="w-64 h-64 object-contain shadow-sm rounded-lg bg-white p-2 border border-amber-200 cursor-pointer"
                                onClick={() => openImagePreview(vendor.fonepayQr)}
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4">
                                Scan the QR code above with your Fonepay app to donate directly
                            </p>
                            <button
                                onClick={closeDonateModal}
                                className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium shadow-md hover:bg-amber-600 transition-all duration-300"
                            >
                                Thank you for your support!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-500 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-154819 Carbohydrates3')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
                <div className="relative h-full container mx-auto px-6 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left mb-8 md:mb-0 max-w-xl">
                            <h1 className="text-3xl font-bold mb-3 text-white">{vendor.organization}</h1>
                            <p className="text-lg text-amber-100 mb-4">
                                Making tails wag and hearts purr since {new Date(vendor.createdAt).getFullYear()}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-sm">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{vendor.address.split(',')[0]}</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center text-sm">
                                    <PawPrint className="w-4 h-4 mr-1" />
                                    <span>{vendor.availablePetsCount} Pets</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleDonate}
                                className="px-6 py-3 bg-white text-amber-600 rounded-full font-medium shadow-md hover:bg-amber-50 transition-all duration-300 flex items-center"
                            >
                                <HeartHandshake className="w-5 h-5 mr-2" />
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
                        <path fill="#fffbeb" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
                    </svg>
                </div>
            </div>

            {/* Organization Details Section */}
            <div className="container mx-auto px-6 -mt-6 relative z-10">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={vendor.image}
                                    alt={vendor.organization}
                                    className="w-full h-64 object-contain"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center text-sm">
                                    <PawPrint className="w-4 h-4 mr-1" />
                                    <span>{vendor.availablePetsCount} Pets Available</span>
                                </div>
                                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center text-sm">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Since {new Date(vendor.createdAt).getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center mb-4">
                                <Award className="w-5 h-5 text-amber-600 mr-2" />
                                <h2 className="text-xl font-bold text-gray-800">About {vendor.organization}</h2>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">{vendor.description}</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="text-gray-800 font-medium mb-3 flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-amber-600" />
                                        Contact Information
                                    </h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center border-b border-amber-100 pb-2">
                                            <Mail className="w-4 h-4 text-amber-600 mr-2" />
                                            <span>{vendor.email}</span>
                                        </li>
                                        <li className="flex items-center border-b border-amber-100 pb-2">
                                            <Phone className="w-4 h-4 text-amber-600 mr-2" />
                                            <span>{vendor.contact}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <MapPin className="w-4 h-4 text-amber-600 mr-2 mt-1" />
                                            <span>{vendor.address}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="text-gray-800 font-medium mb-3 flex items-center">
                                        <Info className="w-4 h-4 mr-2 text-amber-600" />
                                        Additional Information
                                    </h3>
                                    <div className="space-y-3 text-gray-600">
                                        <div className="flex items-center border-b border-amber-100 pb-2">
                                            <Calendar className="w-4 h-4 text-amber-600 mr-2" />
                                            <span>Member since {formatDate(vendor.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-amber-600 mr-2" />
                                            <span>Managed by {vendor.fullName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="container mx-auto px-6">
                <div className="flex space-x-1 border-b border-amber-200 mb-6">
                    <button
                        className={`px-4 py-3 font-medium transition-colors flex items-center ${activeTab === 'gallery'
                            ? 'text-amber-700 border-b-2 border-amber-500'
                            : 'text-gray-600 hover:text-amber-600'
                            }`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Photo Gallery
                    </button>
                    <button
                        className={`px-4 py-3 font-medium transition-colors flex items-center ${activeTab === 'pets'
                            ? 'text-amber-700 border-b-2 border-amber-500'
                            : 'text-gray-600 hover:text-amber-600'
                            }`}
                        onClick={() => setActiveTab('pets')}
                    >
                        <PawPrint className="w-4 h-4 mr-2" />
                        Available Pets
                    </button>
                </div>

                {/* Pet Gallery Section */}
                {activeTab === 'gallery' && (
                    <div className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {vendor.pets.map((pet) => (
                                <div
                                    key={pet._id}
                                    className="relative aspect-square group overflow-hidden rounded-lg shadow-sm"
                                >
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onClick={() => openImagePreview(pet.imageUrl)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <h3 className="text-lg font-medium">{pet.name}</h3>
                                        <p className="text-sm text-amber-200">{pet.breed}</p>
                                        <button
                                            onClick={() => handleMeetClick(pet._id)}
                                            className="mt-2 px-3 py-1 bg-amber-500/80 rounded-full text-sm hover:bg-amber-500 transition-colors flex items-center text-white"
                                        >
                                            <Heart className="w-3 h-3 mr-1" />
                                            Meet {pet.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Pets Section */}
                {activeTab === 'pets' && (
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>

            {/* CTA Section */}
            <div className="bg-amber-100 py-12 relative border-t border-amber-200">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-amber-800 mb-4">Ready to Find Your Perfect Companion?</h2>
                        <p className="text-amber-700 mb-6">
                            Every pet deserves a loving home. Visit us today to meet our amazing pets waiting for adoption.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => window.open(`https://maps.google.com/?q=${vendor.address}`, '_blank')}
                                className="px-6 py-2 bg-white text-amber-700 rounded-full font-medium flex items-center justify-center hover:bg-amber-50 transition-colors shadow-sm border border-amber-200"
                            >
                                <MapPin className="w-4 h-4 mr-2" />
                                Visit Us
                            </button>
                            <button
                                onClick={handleDonate}
                                className="px-6 py-2 bg-amber-500 text-white rounded-full font-medium flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm"
                            >
                                <HeartHandshake className="w-4 h-4 mr-2" />
                                Support Our Mission
                            </button>
                        </div>
                        <div className="mt-6 text-amber-700 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>Share this shelter on</span>
                            <div className="flex space-x-3 ml-2">
                                <button className="p-1 hover:text-amber-900 transition-colors">Facebook</button>
                                <button className="p-1 hover:text-amber-900 transition-colors">Twitter</button>
                                <button className="p-1 hover:text-amber-900 transition-colors">Instagram</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;