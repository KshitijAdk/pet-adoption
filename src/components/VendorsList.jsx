import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export default function VendorsList() {
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedVendor, setExpandedVendor] = useState(null);
    const navigate = useNavigate();

    // Fetch vendor data from API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/vendors/all-vendors');
                const data = await res.json();
                if (data.success) {
                    setVendors(data.data);
                }
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor =>
        vendor.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-800 mb-2">Our Partner Organizations</h1>
                    <p className="text-gray-600">These dedicated organizations help find loving homes for pets in need</p>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search organizations or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search className="absolute top-4 left-4 text-gray-400" size={20} />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredVendors.map((vendor, index) => (
                        <div
                            key={vendor._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="flex flex-col sm:flex-row">
                                <div className="w-full sm:w-1/3">
                                    <img
                                        src={vendor.image}
                                        alt={vendor.organization}
                                        className="h-48 w-full object-cover"
                                    />
                                </div>
                                <div className="p-4 w-full sm:w-2/3">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-semibold text-amber-800">{vendor.organization}</h2>
                                        <ChevronRight size={20} className="text-amber-800" />
                                    </div>

                                    <div className="mt-2 flex items-center text-gray-600">
                                        <MapPin size={16} className="mr-1" />
                                        <span>{vendor.address}</span>
                                    </div>

                                    <div className="mt-4 space-y-2 pt-3 border-t border-gray-100 text-gray-700">
                                        <div className="flex items-center">
                                            <Mail size={16} className="mr-2 text-amber-600" />
                                            <a href={`mailto:${vendor.email}`} className="hover:text-amber-700">{vendor.email}</a>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone size={16} className="mr-2 text-amber-600" />
                                            <a href={`tel:${vendor.contact}`} className="hover:text-amber-700">{vendor.contact}</a>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate(`/vendor/${vendor._id}`)}
                                            className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredVendors.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow mt-6">
                        <p className="text-gray-500 text-lg">No organizations found matching your search.</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
