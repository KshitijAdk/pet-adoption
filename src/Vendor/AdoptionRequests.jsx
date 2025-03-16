import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, Search } from 'lucide-react';
import { AppContent } from '../context/AppContext';

const AdoptionRequests = () => {
    const { userData } = useContext(AppContent);
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const adoptionRequests = userData?.vendorDetails?.pets?.flatMap((pet) =>
            pet.adoptionRequests.map((req) => ({
                id: req._id,
                petName: req.petName,
                petId: req.petId,
                applicant: req.applicantName,
                email: req.applicantEmail,
                phone: req.applicantContact,
                status: req.status.toLowerCase(),
                date: req.createdAt.split('T')[0],
                details: {
                    address: req.applicantAddress,
                    reason: req.adoptionReason
                }
            }))
        ) || [];

        setRequests(adoptionRequests);
    }, [userData]);

    const filteredRequests = requests.filter(request =>
        request.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (requestId, newStatus) => {
        setRequests(reqs =>
            reqs.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="bg-green-100 text-green-800 flex items-center px-3 py-1 rounded-full text-sm"><CheckCircle className="h-4 w-4 mr-1" />Approved</span>;
            case 'rejected':
                return <span className="bg-red-100 text-red-800 flex items-center px-3 py-1 rounded-full text-sm"><XCircle className="h-4 w-4 mr-1" />Rejected</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 flex items-center px-3 py-1 rounded-full text-sm"><AlertCircle className="h-4 w-4 mr-1" />Pending</span>;
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Adoption Requests</h1>

            {/* Search Bar */}
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

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredRequests.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Applicant</th>
                                <th className="px-6 py-3">Pet</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="border-t">
                                    <td className="px-6 py-4">{request.applicant}</td>
                                    <td className="px-6 py-4">{request.petName}</td>
                                    <td className="px-6 py-4">{request.email}<br />{request.phone}</td>
                                    <td className="px-6 py-4">{request.date}</td>
                                    <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => { setSelectedRequest(request); setShowModal(true); }}>
                                            <Eye className="h-5 w-5 text-amber-600" />
                                        </button>
                                        {request.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusChange(request.id, 'approved')}>
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </button>
                                                <button onClick={() => handleStatusChange(request.id, 'rejected')}>
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No adoption requests found.
                    </div>
                )}
            </div>


            {/* Modal for Request Details */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Application Details</h2>
                        <p><strong>Applicant:</strong> {selectedRequest.applicant}</p>
                        <p><strong>Pet:</strong> {selectedRequest.petName}</p>
                        <p><strong>Email:</strong> {selectedRequest.email}</p>
                        <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                        <p><strong>Address:</strong> {selectedRequest.details.address}</p>
                        <p><strong>Reason:</strong> {selectedRequest.details.reason}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdoptionRequests;
