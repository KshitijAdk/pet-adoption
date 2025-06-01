import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, Search, Home, PawPrint, ListChecks, Calendar, Menu } from 'lucide-react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Sidebar from '../components/ui/Sidebar';
import Table from '../components/ui/Table';
import PetDetailModal from '../components/profile/PetDetailModal';
import { message } from 'antd';

const AdoptionRequests = () => {
    const { userData, backendUrl } = useContext(AppContent);
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

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/adoption/vendor/${userData?.vendorDetails?.vendorId}`);
                const requestsData = response.data.requests || [];
                setRequests(requestsData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching adoption requests:", err);
                setError("Failed to load requests");
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
            const response = await axios.post(`${backendUrl}/api/adoption/approve`, {
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
                message('Request approved!');
            }
        } catch (error) {
            console.error("Error approving request:", error);
            message('Failed to approve request.');
        }
    };

    const handleReject = async (row) => {
        try {
            const response = await axios.post(`${backendUrl}/api/adoption/reject`, {
                adoptionId: row._id,
                petId: row.petId._id
            });

            if (response.status === 200) {
                setRequests(reqs =>
                    reqs.map(req =>
                        req._id === row._id ? { ...req, status: 'rejected' } : req
                    )
                );
                message('Request rejected!');
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            message('Failed to reject request.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const viewDetails = (request) => {
        const pet = request.petId;
        const applicant = request.applicantId;
        const isPending = request.status.toLowerCase() === 'pending';

        setSelectedRequest({
            isOpen: true,
            title: `${pet?.name} - Request`,
            imageUrl: pet?.imageUrl,
            content: (
                <div className="space-y-4 sm:space-y-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <h3 className="font-medium text-gray-900 text-base sm:text-sm mb-2">Pet Info</h3>
                            <ul className="space-y-2 sm:space-y-1 text-sm sm:text-xs text-gray-700">
                                <li><span className="font-medium">Name:</span> {pet?.name}</li>
                                <li><span className="font-medium">Type:</span> {pet?.species} ({pet?.breed})</li>
                                <li><span className="font-medium">Age:</span> {pet?.age} • {pet?.gender} • {pet?.size}</li>
                                <li><span className="font-medium">Health:</span> {pet?.health}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 text-base sm:text-sm mb-2">Traits</h3>
                            <div className="space-y-2 sm:space-y-1">
                                <div className="flex flex-wrap gap-2 sm:gap-1">
                                    {pet?.traits?.map((trait, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-1 sm:px-1.5 sm:py-0.5 rounded text-sm sm:text-xs font-medium bg-blue-100 text-blue-800">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 sm:gap-1">
                                    {pet?.goodWith?.map((item, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-1 sm:px-1.5 sm:py-0.5 rounded text-sm sm:text-xs font-medium bg-green-100 text-green-800">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm sm:text-xs text-gray-700">
                        <h3 className="font-medium text-gray-900 text-base sm:text-sm mb-2">Description</h3>
                        <p>{pet?.description}</p>
                    </div>

                    <div className="border-t pt-4 sm:pt-2">
                        <h3 className="font-medium text-gray-900 text-base sm:text-sm mb-2">Applicant</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-2">
                            <div className="flex items-start space-x-3 sm:space-x-2">
                                <img
                                    src={request.applicantImage || "/placeholder-user.jpg"}
                                    alt={request.applicantName}
                                    className="h-10 w-10 sm:h-8 sm:w-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm sm:text-xs font-medium text-gray-900 truncate">{request.applicantName}</p>
                                    <p className="text-sm sm:text-xs text-gray-500 truncate">{request.applicantEmail}</p>
                                    <p className="text-sm sm:text-xs text-gray-700 mt-1">{request.applicantContact}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm sm:text-xs font-medium text-gray-900 mb-1">Reason</h4>
                                <p className="text-sm sm:text-xs text-gray-700">{request.adoptionReason}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 sm:pt-2">
                        <h3 className="font-medium text-gray-900 text-base sm:text-sm mb-2">Details</h3>
                        <ul className="space-y-2 sm:space-y-1 text-sm sm:text-xs text-gray-700">
                            <li><span className="font-medium">ID:</span> {request._id.substring(0, 8)}...</li>
                            <li><span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}</li>
                            <li className="flex items-center flex-wrap gap-2">
                                <span className="font-medium">Status:</span>
                                <span className={`inline-flex items-center px-2 py-1 sm:px-1.5 sm:py-0.5 rounded text-sm sm:text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="text-sm sm:text-xs text-gray-600">
                        <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
                    </div>
                    {isPending && (
                        <div className="flex space-x-3 sm:space-x-2 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    closeModal();
                                    handleReject(request);
                                }}
                                className="flex-1 sm:flex-none px-4 py-2 sm:px-3 sm:py-1 border border-red-300 rounded text-sm sm:text-xs font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    closeModal();
                                    handleApprove(request);
                                }}
                                className="flex-1 sm:flex-none px-4 py-2 sm:px-3 sm:py-1 border border-transparent rounded text-sm sm:text-xs font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
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
                <div className="text-xs">
                    <div className="truncate">{row.applicantEmail}</div>
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
            label: 'View',
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
        <div className="flex h-screen bg-gray-50">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
                <Menu size={20} />
            </button>

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={vendorMenuItems}
                title="Vendor Panel"
            />

            <div className="flex-1 lg:ml-8 p-4 sm:p-6 pt-16 lg:pt-4">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Adoption Requests</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">
                        Manage and review adoption requests for your pets
                    </p>
                </div>

                {/* Search */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by applicant or pet name..."
                            className="w-full pl-10 pr-4 py-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <Table
                            columns={columns}
                            data={filteredRequests}
                            loading={loading}
                            error={error}
                            emptyMessage="No adoption requests found"
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
                </div>

                {/* Stats Cards - Mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 sm:hidden">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-lg font-semibold text-gray-900">{requests.length}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500">Pending</div>
                        <div className="text-lg font-semibold text-yellow-600">
                            {requests.filter(req => req.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500">Approved</div>
                        <div className="text-lg font-semibold text-green-600">
                            {requests.filter(req => req.status === 'approved').length}
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500">Rejected</div>
                        <div className="text-lg font-semibold text-red-600">
                            {requests.filter(req => req.status === 'rejected').length}
                        </div>
                    </div>
                </div>
            </div>

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
    );
};

export default AdoptionRequests;