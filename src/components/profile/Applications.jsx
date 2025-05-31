import React, { useContext, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppContent } from '../../context/AppContext';
import PetDetailModal from './PetDetailModal';

const Applications = () => {
    const { userData, backendUrl } = useContext(AppContent);
    const [applications, setApplications] = useState([]);
    const [vendorApplication, setVendorApplication] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userId = userData?.userId;
                if (!userId) return;

                const response = await fetch(`${backendUrl}/api/adoption/user/${userId}`);
                const data = await response.json();

                if (data.applications) {
                    setApplications(data.applications);
                }
                if (data.vendorApplication) {
                    setVendorApplication(data.vendorApplication);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (userData?.userId) {
            fetchApplications();
        }
    }, [userData]);

    const openModal = (application) => {
        setSelectedPet(application.petId);
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">My Applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Track the status of your adoption applications.
                </p>
            </div>

            <div className="px-6 py-5">
                {applications.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {applications.map(application => {
                            const pet = application.petId;
                            const createdDate = formatDate(application.createdAt);

                            return (
                                <li key={application._id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            <img
                                                src={pet?.imageUrl || "/placeholder.jpg"}
                                                alt={pet?.name || "Pet"}
                                                className="h-16 w-16 rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {pet?.name || "Loading..."}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Submitted on {createdDate || "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.status === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : application.status === 'Rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {application.status}
                                            </span>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => openModal(application)}
                                                type="button"
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start the adoption process by applying for a pet.
                        </p>
                        <div className="mt-6">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                                Browse Available Pets
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {vendorApplication && (
                <div className="px-6 py-5 border-t border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Vendor Application</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Details of your vendor application.
                    </p>
                    <div className="mt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Organization Information</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li><span className="font-medium">Name:</span> {vendorApplication.fullName}</li>
                                    <li><span className="font-medium">Organization:</span> {vendorApplication.organization}</li>
                                    <li><span className="font-medium">Email:</span> {vendorApplication.email}</li>
                                    <li><span className="font-medium">Contact:</span> {vendorApplication.contact}</li>
                                    <li><span className="font-medium">Address:</span> {vendorApplication.address}</li>
                                    <li><span className="font-medium">Description:</span> {vendorApplication.description}</li>
                                    <li><span className="font-medium">Status:</span>
                                        <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${vendorApplication.status === 'Approved'
                                            ? 'bg-green-100 text-green-800'
                                            : vendorApplication.status === 'Rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {vendorApplication.status}
                                        </span>
                                    </li>
                                    <li><span className="font-medium">Submitted:</span> {formatDate(vendorApplication.createdAt)}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Documents</h4>
                                <div className="mt-2">
                                    <div className="mb-2">
                                        <p className="text-sm font-medium text-gray-700">Profile Image:</p>
                                        <img
                                            src={vendorApplication.image}
                                            alt="Vendor Profile"
                                            className="h-24 w-24 rounded-md object-cover mt-1"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm font-medium text-gray-700">Fonepay QR:</p>
                                        <img
                                            src={vendorApplication.fonepayQr}
                                            alt="Fonepay QR"
                                            className="h-24 w-24 rounded-md object-cover mt-1"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">ID Documents:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {vendorApplication.idDocuments.map((doc, index) => (
                                                <img
                                                    key={index}
                                                    src={doc}
                                                    alt={`ID Document ${index + 1}`}
                                                    className="h-16 w-16 rounded-md object-cover"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pet Detail Modal */}
            <PetDetailModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                title={`${selectedPet?.name || 'Pet'} Details`}
                imageUrl={selectedPet?.imageUrl}
                content={
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-900">Pet Information</h3>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li><span className="font-medium">Species:</span> {selectedPet?.species}</li>
                                    <li><span className="font-medium">Breed:</span> {selectedPet?.breed}</li>
                                    <li><span className="font-medium">Age:</span> {selectedPet?.age} years</li>
                                    <li><span className="font-medium">Gender:</span> {selectedPet?.gender}</li>
                                    <li><span className="font-medium">Size:</span> {selectedPet?.size}</li>
                                    <li><span className="font-medium">Weight:</span> {selectedPet?.weight} lbs</li>
                                    <li><span className="font-medium">Health:</span> {selectedPet?.health}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Traits & Compatibility</h3>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Personality Traits:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedPet?.traits?.map((trait, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Good With:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedPet?.goodWith?.map((item, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Description</h3>
                            <p className="mt-1 text-sm text-gray-700">{selectedPet?.description}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium text-gray-900">Shelter Information</h3>
                            <p className="mt-1 text-sm text-gray-700">
                                {selectedPet?.vendorId?.organization || 'Unknown shelter'}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium text-gray-900">Application Details</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                <li><span className="font-medium">Application ID:</span> {selectedApplication?._id}</li>
                                <li><span className="font-medium">Submitted:</span> {selectedApplication && formatDate(selectedApplication.createdAt)}</li>
                                <li><span className="font-medium">Status:</span>
                                    <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${selectedApplication?.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        selectedApplication?.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {selectedApplication?.status}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default Applications;