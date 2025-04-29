import React from "react";
import { Ban, X, Mail, Phone, HomeIcon, Info, Eye, Shield, CheckCircle, Calendar, Clock as ClockIcon } from "lucide-react";

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