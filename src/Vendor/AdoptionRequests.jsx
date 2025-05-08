import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, Search, Home, PawPrint, ListChecks, Calendar } from 'lucide-react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Sidebar from '../components/ui/Sidebar';
import Table from '../components/ui/Table';
import PetDetailModal from '../components/profile/PetDetailModal';

const AdoptionRequests = () => {
    const { userData } = useContext(AppContent);
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const vendorMenuItems = [
        { path: "/vendor-dashboard", label: "Dashboard", icon: Home },
        { path: "/pets-listing", label: "Manage Pets", icon: PawPrint },
        { path: "/vendor/adoption-requests", label: "Adoption Requests", icon: ListChecks }
    ];

    const sidebarTitle = `Hey, ${userData?.name}👋`;

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/adoption/vendor/${userData?.vendorDetails?.vendorId}`);
                const requestsData = response.data.requests || [];
                setRequests(requestsData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching adoption requests:", err);
                setError("Failed to load adoption requests");
                setLoading(false);
            }
        };

        if (userData?.vendorDetails?.vendorId) {
            fetchAdoptionRequests();
        }
    }, [userData]);

    const filteredRequests = requests.filter(request =>
        request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async (row) => {
        try {
            const response = await axios.post('http://localhost:3000/api/adoption/approve', {
                adoptionId: row._id,
                petId: row.petId._id,
                applicantId: row.applicantId._id
            });

            if (response.status === 200) {
                setRequests(reqs =>
                    reqs.map(req =>
                        req._id === row._id ? { ...req, status: 'approved' } : req
                    )
                );
                alert('Adoption request approved successfully!');
            }
        } catch (error) {
            console.error("Error approving request:", error);
            alert('Failed to approve adoption request.');
        }
    };

    const handleReject = async (row) => {
        try {
            const response = await axios.post('http://localhost:3000/api/adoption/reject', {
                adoptionId: row._id,
                petId: row.petId._id
            });

            if (response.status === 200) {
                setRequests(reqs =>
                    reqs.map(req =>
                        req._id === row._id ? { ...req, status: 'rejected' } : req
                    )
                );
                alert('Adoption request rejected successfully!');
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert('Failed to reject adoption request.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const viewDetails = (request) => {
        const pet = request.petId;
        const applicant = request.applicantId;
        const isPending = request.status === 'pending';

        setSelectedRequest({
            isOpen: true,
            title: `${pet?.name} - Adoption Request`,
            imageUrl: pet?.imageUrl,
            content: (
                <div className="space-y-4">
                    {/* Pet Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-900">Pet Information</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                <li><span className="font-medium">Name:</span> {pet?.name}</li>
                                <li><span className="font-medium">Species:</span> {pet?.species}</li>
                                <li><span className="font-medium">Breed:</span> {pet?.breed}</li>
                                <li><span className="font-medium">Age:</span> {pet?.age} years</li>
                                <li><span className="font-medium">Gender:</span> {pet?.gender}</li>
                                <li><span className="font-medium">Size:</span> {pet?.size}</li>
                                <li><span className="font-medium">Weight:</span> {pet?.weight} lbs</li>
                                <li><span className="font-medium">Health:</span> {pet?.health}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Traits & Compatibility</h3>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Personality Traits:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {pet?.traits?.map((trait, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Good With:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {pet?.goodWith?.map((item, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pet Description */}
                    <div>
                        <h3 className="font-medium text-gray-900">Description</h3>
                        <p className="mt-1 text-sm text-gray-700">{pet?.description}</p>
                    </div>

                    {/* Applicant Information Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-medium text-gray-900">Applicant Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={request.applicantImage || "/placeholder-user.jpg"}
                                        alt={request.applicantName}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{request.applicantName}</p>
                                        <p className="text-xs text-gray-500">{request.applicantEmail}</p>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 text-sm text-gray-700">
                                    <p><span className="font-medium">Contact:</span> {request.applicantContact}</p>
                                    <p><span className="font-medium">Address:</span> {request.applicantAddress}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Adoption Reason</h4>
                                <p className="mt-1 text-sm text-gray-700">{request.adoptionReason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Application Details Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-medium text-gray-900">Application Details</h3>
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li><span className="font-medium">Application ID:</span> {request._id}</li>
                            <li><span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}</li>
                            <li>
                                <span className="font-medium">Status:</span>
                                <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {request.status}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            ),
            footer: (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Submitted on:</span> {formatDate(request.createdAt)}
                    </div>
                    {isPending && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    closeModal();
                                    handleReject(request);
                                }}
                                className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    closeModal();
                                    handleApprove(request);
                                }}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            )
        });
    };

    const closeModal = () => setSelectedRequest(null);

    const columns = [
        { key: 'applicantName', label: 'Applicant' },
        { key: 'petName', label: 'Pet' },
        {
            key: 'contact',
            label: 'Contact',
            customRender: (row) => (
                <div>
                    <div>{row.applicantEmail}</div>
                    <div>{row.applicantContact}</div>
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Date',
            customRender: (row) => formatDate(row.createdAt)
        },
        { key: 'status', label: 'Status' }
    ];

    const actions = [
        {
            key: 'view',
            label: 'View Details',
            icon: Eye,
            onClick: viewDetails,
            className: 'text-amber-600 hover:text-amber-700'
        }
    ];

    const dropdownActions = [
        { key: 'approve', label: 'Approve', icon: CheckCircle, onClick: handleApprove },
        { key: 'reject', label: 'Reject', icon: XCircle, onClick: handleReject }
    ];

    return (
        <div className="flex h-screen">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={vendorMenuItems}
                title={sidebarTitle}
            />

            <div className="flex-1 ml-8 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Adoption Requests</h1>

                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by applicant or pet name..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        data={filteredRequests}
                        loading={loading}
                        error={error}
                        emptyMessage="No adoption requests found."
                        onRowClick={viewDetails}
                        actions={actions}
                        dropdownActions={filteredRequests.some(req => req.status === 'pending') ? dropdownActions : []}
                        statusConfig={{
                            key: 'status',
                            icons: {
                                approved: { icon: CheckCircle, colorClass: 'bg-green-100 text-green-800 border-green-500' },
                                rejected: { icon: XCircle, colorClass: 'bg-red-100 text-red-800 border-red-500' },
                                pending: { icon: AlertCircle, colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-500' }
                            }
                        }}
                        dateConfig={{
                            key: 'createdAt',
                            icon: Calendar
                        }}
                    />
                </div>

                {/* Pet Detail Modal */}
                {selectedRequest && (
                    <PetDetailModal
                        isOpen={selectedRequest.isOpen}
                        closeModal={closeModal}
                        title={selectedRequest.title}
                        imageUrl={selectedRequest.imageUrl}
                        content={selectedRequest.content}
                        footer={selectedRequest.footer}
                    />
                )}
            </div>
        </div>
    );
};

export default AdoptionRequests;