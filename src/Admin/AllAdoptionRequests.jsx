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
                const response = await fetch("http://localhost:3000/api/adoption/adoption-requests");
                if (!response.ok) {
                    throw new Error("Failed to fetch adoption requests");
                }
                const result = await response.json();
                setData(result.data || []); // Ensure we have an array even if data is missing
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                setData([]); // Set empty array on error
            }
        };

        fetchAdoptionRequests();
    }, []);

    // Transform data to flatten nested objects for the table
    const transformedData = data.map(item => ({
        ...item,
        petName: item.pet?.name || "N/A",
        petSpecies: item.pet?.species || "N/A",
        applicantName: item.applicant?.name || "N/A",
    }));

    // Table columns
    const columns = [
        { key: "petName", label: "Pet Name" },
        { key: "petSpecies", label: "Species" },
        { key: "applicantName", label: "Applicant Name" },
        { key: "status", label: "Status" },
        {
            key: "createdAt",
            label: "Created At",
            customRender: (row) => (
                <div className="flex items-center justify-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                </div>
            )
        },
    ];

    // Table actions
    const actions = [
        {
            key: "view",
            label: "View Details",
            icon: Eye,
            className: "text-blue-500 hover:text-blue-700",
            onClick: (row) => setSelectedRequest(data.find(item => item.adoptionId === row.adoptionId)),
        },
    ];

    // Close modal
    const closeModal = () => {
        setSelectedRequest(null);
    };

    // Helper function to render optional fields
    const renderField = (value, fallback = "N/A") => {
        return value ? value : fallback;
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
                        <h2 className="text-xl font-semibold mb-4">Adoption Request Details</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Adoption Details */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Adoption Information</h3>
                                <div className="space-y-1">
                                    <p><strong>Adoption ID:</strong> {selectedRequest.adoptionId}</p>
                                    <p><strong>Status:</strong>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'} ml-2`}>
                                            {selectedRequest.status}
                                        </span>
                                    </p>
                                    <p><strong>Created At:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                                    <p><strong>Reason:</strong> {renderField(selectedRequest.adoptionReason)}</p>
                                </div>
                            </div>

                            {/* Pet Details */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Pet Information</h3>
                                <div className="flex gap-4">
                                    {selectedRequest.pet?.imageUrl && (
                                        <img
                                            src={selectedRequest.pet.imageUrl}
                                            alt={selectedRequest.pet.name}
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <p><strong>Name:</strong> {selectedRequest.pet?.name}</p>
                                        <p><strong>Species:</strong> {selectedRequest.pet?.species}</p>
                                        <p><strong>Breed:</strong> {renderField(selectedRequest.pet?.breed)}</p>
                                        <p><strong>Age:</strong> {selectedRequest.pet?.age}</p>
                                        <p><strong>Gender:</strong> {selectedRequest.pet?.gender}</p>
                                        <p><strong>Status:</strong> {selectedRequest.pet?.status}</p>
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
                                            alt={selectedRequest.applicant.name}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <p><strong>Name:</strong> {selectedRequest.applicant?.name}</p>
                                        <p><strong>Email:</strong> {selectedRequest.applicant?.email}</p>
                                        <p><strong>Contact:</strong> {renderField(selectedRequest.applicant?.contact)}</p>
                                        <p><strong>Address:</strong> {renderField(selectedRequest.applicant?.address)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Details */}
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Vendor Information</h3>
                                <div className="space-y-1">
                                    <p><strong>Organization:</strong> {selectedRequest.vendor?.organization}</p>
                                    <p><strong>Email:</strong> {selectedRequest.vendor?.email}</p>
                                    <p><strong>Contact:</strong> {selectedRequest.vendor?.contact}</p>
                                    <p><strong>Address:</strong> {selectedRequest.vendor?.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex justify-end">
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