import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { AppContent } from '../context/AppContext';

export default function VendorsList() {
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/vendors/all-vendors`);
                const data = await res.json();
                if (data.success) {
                    setVendors(data.data);
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(
        (vendor) =>
            vendor.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Partner Organizations</h1>
                    <p className="mt-3 text-lg text-gray-500 max-w-4xl mx-auto">
                        Connecting pets with loving homes through our trusted partner organizations.
                        You can donate to these organizations to support their efforts in rescuing and rehabilitating animals.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 max-w-lg mx-auto">
                    <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent overflow-hidden">
                        <Search className="ml-4 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 px-3 border-0 focus:outline-none text-gray-700"
                        />
                    </div>
                </div>

                {/* Vendor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVendors.map((vendor) => (
                        <div
                            key={vendor._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                            onClick={() => navigate(`/vendor/${vendor._id}`)}
                        >
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={vendor.image}
                                    alt={vendor.organization}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xl font-medium text-gray-800">{vendor.organization}</h2>
                                    <ChevronRight size={18} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="space-y-2 text-gray-600 mb-5">
                                    <div className="flex items-center">
                                        <MapPin size={14} className="mr-2 text-amber-500" />
                                        <span className="text-sm">{vendor.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail size={14} className="mr-2 text-amber-500" />
                                        <a
                                            href={`mailto:${vendor.email}`}
                                            className="text-sm hover:text-amber-600 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {vendor.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-2 text-amber-500" />
                                        <a
                                            href={`tel:${vendor.contact}`}
                                            className="text-sm hover:text-amber-600 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {vendor.contact}
                                        </a>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/vendor/${vendor._id}`);
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredVendors.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
                        <p className="text-lg text-gray-600">No organizations found</p>
                        <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}