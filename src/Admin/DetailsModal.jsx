import React from "react";
import { Ban, X, Mail, Phone, HomeIcon, Info, Eye, Shield, CreditCard, CheckCircle, Calendar, Clock as ClockIcon } from "lucide-react";

// New UserDetailModal component
export const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                            {user.image ? (
                                <img src={user.image} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User size={24} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-gray-600 flex items-center">
                                <Mail className="mr-2" size={16} />
                                {user.email}
                            </p>
                            <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs mt-2 ${user.banInfo?.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                <Shield className="mr-1" size={14} />
                                {user.role} • {user.banInfo?.isBanned ? 'Banned' : 'Active'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <Info className="text-blue-600" size={18} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Basic Information</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="mr-2" size={14} />
                                        {user.contact || 'Not provided'}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <HomeIcon className="mr-2" size={14} />
                                        {user.address || 'Not provided'}
                                    </div>
                                </div>
                                {user.description && (
                                    <p className="mt-2 text-sm text-gray-600">{user.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-purple-100 p-2 rounded-full mr-3">
                                <Calendar className="text-purple-600" size={18} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Activity</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <span className="font-medium mr-1">Joined:</span>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="font-medium mr-1">Adopted:</span>
                                        {user.adoptedPets?.length || 0} pets
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user.banInfo?.isBanned && (
                            <div className="flex items-start">
                                <div className="bg-red-100 p-2 rounded-full mr-3">
                                    <Ban className="text-red-600" size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700">Ban Information</h4>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><span className="font-medium">Reason:</span> {user.banInfo.reason || 'Not specified'}</p>
                                        <p className="flex items-center mt-1">
                                            <ClockIcon className="mr-1" size={14} />
                                            Banned on: {new Date(user.banInfo.at).toLocaleString()}
                                        </p>
                                        {user.banInfo.bannedBy && (
                                            <p className="mt-1">
                                                <span className="font-medium">By:</span> {user.banInfo.bannedBy.name} ({user.banInfo.bannedBy.email})
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const VendorDetailsModal = ({ vendor, onClose }) => {
    if (!vendor) return null;

    return (
        <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                        {vendor.image ? (
                            <img src={vendor.image} alt="Vendor" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-lg font-semibold">{vendor.fullName?.charAt(0) || 'N/A'}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{vendor.fullName}</h3>
                    <p className="text-gray-600 flex items-center">
                        <Mail className="mr-2" size={16} />
                        {vendor.email}
                    </p>
                    <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs mt-2 ${vendor.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : vendor.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        <Shield className="mr-1" size={14} />
                        {vendor.status || 'Pending'}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Info className="text-blue-600" size={18} />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Business Information</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center text-gray-600">
                                <Phone className="mr-2" size={14} />
                                {vendor.contact || 'Not provided'}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <HomeIcon className="mr-2" size={14} />
                                {vendor.address || 'Not provided'}
                            </div>
                        </div>
                        {vendor.organization && (
                            <p className="mt-2">
                                <span className="font-medium">Organization:</span> {vendor.organization}
                            </p>
                        )}
                        {vendor.description && (
                            <p className="mt-2">
                                <span className="font-medium">Description:</span> {vendor.description}
                            </p>
                        )}
                    </div>
                </div>

                {vendor.fonepayQr && (
                    <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <CreditCard className="text-green-600" size={18} />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700">Payment QR Code</h4>
                            <div className="mt-2">
                                <div className="w-48 h-48 border border-gray-200 rounded-md overflow-hidden">
                                    <img
                                        src={vendor.fonepayQr}
                                        alt="Fonepay QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Fonepay QR Code</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <Calendar className="text-purple-600" size={18} />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Application Details</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-1">Applied:</span>
                                {new Date(vendor.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-1">Status:</span>
                                {vendor.status || 'Pending'}
                            </div>
                        </div>
                    </div>
                </div>

                {vendor.idDocuments?.length > 0 && (
                    <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <CheckCircle className="text-amber-600" size={18} />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700">Verification Documents</h4>
                            <div className="flex space-x-2 overflow-x-auto py-2 mt-2">
                                {vendor.idDocuments.map((doc, index) => (
                                    <a
                                        key={index}
                                        href={doc}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group rounded shadow w-32 h-32 overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={doc}
                                            alt={`ID ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Eye className="text-white" size={24} />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdoptionRequestModal = ({ request, onClose }) => {
    // Helper function to safely access nested properties
    const getSafeValue = (obj, path, fallback = "N/A") => {
        try {
            const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
            return value !== undefined && value !== null ? value : fallback;
        } catch {
            return fallback;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Adoption Request Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Adoption Details */}
                    <div className="border-b pb-4">
                        <h3 className="font-medium text-gray-900">Adoption Information</h3>
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Adoption ID:</strong> {getSafeValue(request, 'adoptionId')}</p>
                            <p><strong>Status:</strong>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {getSafeValue(request, 'status', 'Pending')}
                                </span>
                            </p>
                            <p><strong>Created At:</strong> {new Date(getSafeValue(request, 'createdAt')).toLocaleString()}</p>
                            <p><strong>Reason:</strong> {getSafeValue(request, 'adoptionReason')}</p>
                        </div>
                    </div>

                    {/* Pet Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-medium text-gray-900">Pet Information</h3>
                        <div className="flex gap-4">
                            {request.pet?.imageUrl && (
                                <img
                                    src={request.pet.imageUrl}
                                    alt={request.pet.name || 'Pet image'}
                                    className="w-32 h-32 object-cover rounded"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <div className="space-y-1 text-sm text-gray-700">
                                <p><strong>Name:</strong> {getSafeValue(request, 'pet.name')}</p>
                                <p><strong>Species:</strong> {getSafeValue(request, 'pet.species')}</p>
                                <p><strong>Breed:</strong> {getSafeValue(request, 'pet.breed')}</p>
                                <p><strong>Age:</strong> {getSafeValue(request, 'pet.age')}</p>
                                <p><strong>Gender:</strong> {getSafeValue(request, 'pet.gender')}</p>
                                <p><strong>Status:</strong> {getSafeValue(request, 'pet.status')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-medium text-gray-900">Applicant Information</h3>
                        <div className="flex gap-4">
                            {request.applicant?.image && (
                                <img
                                    src={request.applicant.image}
                                    alt={request.applicant.name || 'Applicant image'}
                                    className="w-16 h-16 rounded-full"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <div className="space-y-1 text-sm text-gray-700">
                                <p><strong>Name:</strong> {getSafeValue(request, 'applicant.name')}</p>
                                <p><strong>Email:</strong> {getSafeValue(request, 'applicant.email')}</p>
                                <p><strong>Contact:</strong> {getSafeValue(request, 'applicant.contact')}</p>
                                <p><strong>Address:</strong> {getSafeValue(request, 'applicant.address')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Information */}
                    <div>
                        <h3 className="font-medium text-gray-900">Vendor Information</h3>
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Organization:</strong> {getSafeValue(request, 'vendor.organization')}</p>
                            <p><strong>Email:</strong> {getSafeValue(request, 'vendor.email')}</p>
                            <p><strong>Contact:</strong> {getSafeValue(request, 'vendor.contact')}</p>
                            <p><strong>Address:</strong> {getSafeValue(request, 'vendor.address')}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Submitted on:</span> {new Date(getSafeValue(request, 'createdAt')).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};
