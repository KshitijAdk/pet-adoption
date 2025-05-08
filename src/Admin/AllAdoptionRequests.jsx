import { useState, useEffect } from "react";
import Table from "../components/ui/Table";
import { Eye, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

const AllAdoptionRequests = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Fetch adoption requests
    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("http://localhost:3000/api/adoption/adoption-requests");
                if (!response.ok) {
                    throw new Error(`Failed to fetch adoption requests: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();

                if (!result || !Array.isArray(result.data)) {
                    throw new Error("Invalid data format received from API");
                }

                setData(result.data);
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptionRequests();
    }, []);

    // Safely transform data for the table
    const transformedData = data.map(item => ({
        ...item,
        petName: item?.pet?.name || "N/A",
        petSpecies: item?.pet?.species || "N/A",
        applicantName: item?.applicant?.name || "N/A",
        createdAt: item?.createdAt || new Date().toISOString() // Fallback for missing date
    }));

    // Helper function to safely access nested properties
    const getSafeValue = (obj, path, fallback = "N/A") => {
        try {
            const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
            return value !== undefined && value !== null ? value : fallback;
        } catch {
            return fallback;
        }
    };

    // Table columns
    const columns = [
        { key: "petName", label: "Pet Name" },
        { key: "petSpecies", label: "Species" },
        { key: "applicantName", label: "Applicant Name" },
        {
            key: "status",
            label: "Status",
            customRender: (row) => {
                const status = row.status?.toLowerCase();
                let statusClass = "";

                if (status === "approved") {
                    statusClass = "bg-green-100 text-green-800";
                } else if (status === "rejected") {
                    statusClass = "bg-red-100 text-red-800";
                } else {
                    statusClass = "bg-yellow-100 text-yellow-800";
                }

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {row.status || "Pending"}
                    </span>
                );
            }
        },
        {
            key: "createdAt",
            label: "Created At",
            customRender: (row) => {
                const date = row.createdAt ? new Date(row.createdAt) : new Date();
                return (
                    <div className="flex items-center justify-center space-x-1">
                        <Calendar size={12} />
                        <span>{date.toLocaleDateString()}</span>
                    </div>
                );
            }
        },
    ];

    // Table actions
    const actions = [
        {
            key: "view",
            label: "View Details",
            icon: Eye,
            className: "text-blue-500 hover:text-blue-700",
            onClick: (row) => {
                const request = data.find(item => item.adoptionId === row.adoptionId);
                if (request) {
                    setSelectedRequest(request);
                }
            },
        },
    ];

    const closeModal = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Adoption Requests</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={transformedData}
                loading={loading}
                error={error}
                actions={actions}
                emptyMessage="No adoption requests found."
                statusConfig={{
                    key: "status",
                    icons: {
                        approved: { icon: CheckCircle, colorClass: "bg-green-100 text-green-700 border-green-500" },
                        rejected: { icon: XCircle, colorClass: "bg-red-100 text-red-700 border-red-500" },
                        pending: { icon: Clock, colorClass: "bg-yellow-100 text-yellow-700 border-yellow-500" },
                    },
                }}
            />

            {/* Modal for detailed view */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold">Adoption Request Details</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Adoption Details */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Adoption Information</h3>
                                <div className="space-y-1">
                                    <p><strong>Adoption ID:</strong> {getSafeValue(selectedRequest, 'adoptionId')}</p>
                                    <p><strong>Status:</strong>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {getSafeValue(selectedRequest, 'status', 'Pending')}
                                        </span>
                                    </p>
                                    <p><strong>Created At:</strong> {new Date(getSafeValue(selectedRequest, 'createdAt')).toLocaleString()}</p>
                                    <p><strong>Reason:</strong> {getSafeValue(selectedRequest, 'adoptionReason')}</p>
                                </div>
                            </div>

                            {/* Pet Details */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Pet Information</h3>
                                <div className="flex gap-4">
                                    {selectedRequest.pet?.imageUrl && (
                                        <img
                                            src={selectedRequest.pet.imageUrl}
                                            alt={selectedRequest.pet.name || 'Pet image'}
                                            className="w-32 h-32 object-cover rounded"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <p><strong>Name:</strong> {getSafeValue(selectedRequest, 'pet.name')}</p>
                                        <p><strong>Species:</strong> {getSafeValue(selectedRequest, 'pet.species')}</p>
                                        <p><strong>Breed:</strong> {getSafeValue(selectedRequest, 'pet.breed')}</p>
                                        <p><strong>Age:</strong> {getSafeValue(selectedRequest, 'pet.age')}</p>
                                        <p><strong>Gender:</strong> {getSafeValue(selectedRequest, 'pet.gender')}</p>
                                        <p><strong>Status:</strong> {getSafeValue(selectedRequest, 'pet.status')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Applicant Details */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Applicant Information</h3>
                                <div className="flex gap-4">
                                    {selectedRequest.applicant?.image && (
                                        <img
                                            src={selectedRequest.applicant.image}
                                            alt={selectedRequest.applicant.name || 'Applicant image'}
                                            className="w-16 h-16 rounded-full"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <p><strong>Name:</strong> {getSafeValue(selectedRequest, 'applicant.name')}</p>
                                        <p><strong>Email:</strong> {getSafeValue(selectedRequest, 'applicant.email')}</p>
                                        <p><strong>Contact:</strong> {getSafeValue(selectedRequest, 'applicant.contact')}</p>
                                        <p><strong>Address:</strong> {getSafeValue(selectedRequest, 'applicant.address')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Details */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Vendor Information</h3>
                                <div className="space-y-1">
                                    <p><strong>Organization:</strong> {getSafeValue(selectedRequest, 'vendor.organization')}</p>
                                    <p><strong>Email:</strong> {getSafeValue(selectedRequest, 'vendor.email')}</p>
                                    <p><strong>Contact:</strong> {getSafeValue(selectedRequest, 'vendor.contact')}</p>
                                    <p><strong>Address:</strong> {getSafeValue(selectedRequest, 'vendor.address')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAdoptionRequests;