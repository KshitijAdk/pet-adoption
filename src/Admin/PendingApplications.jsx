import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    ThumbsUp,
    ThumbsDown,
    Home,
    Users,
    ListChecks,
    Eye,
    ChevronDown
} from "lucide-react";
import BigModal from "../components/ui/BigModal";  // Import the BigModal component
import { Link } from "react-router-dom";

const PendingApplications = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/vendors/pending-vendors");
                if (!response.ok) throw new Error("Failed to fetch vendors");
                const data = await response.json();
                setVendors(data.vendors || []); // Ensure vendors is always set to an array
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const approveVendor = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/vendors/approve-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to approve vendor");

            setVendors((prev) =>
                prev.map((v) => (v._id === vendorId ? { ...v, status: "Approved" } : v))
            );
        } catch (err) {
            alert("Error approving vendor");
        }
    };

    const rejectVendor = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/vendors/reject-vendor/${vendorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to reject vendor");

            setVendors((prev) =>
                prev.map((v) => (v._id === vendorId ? { ...v, status: "Rejected" } : v))
            );
        } catch (err) {
            alert("Error rejecting vendor");
        }
    };

    const openModal = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedVendor(null);
        setShowModal(false);
    };

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Applications</h1>

                    {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {/* Empty state with icon and message */}
                    {!loading && !error && vendors.length === 0 && (
                        <div className="text-center py-12">
                            <Clock className="mx-auto h-12 w-12 text-yellow-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending vendor applications found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Check back later for new applications or take action on pending ones.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/admin/pending-vendors" // Link to another page if needed
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                                >
                                    Refresh Applications
                                </Link>
                            </div>
                        </div>
                    )}

                    {!loading && !error && vendors.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg text-left">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                                        <th className="p-4">Applicant</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Organization</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.map((vendor) => (
                                        <tr key={vendor._id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                                            <td className="p-4 text-gray-600">{vendor.fullName}</td>
                                            <td className="p-4 text-gray-600">{vendor.contact}</td>
                                            <td className="p-4 text-gray-600">{vendor.organization}</td>
                                            <td className="p-4 text-gray-600">{vendor.description}</td>
                                            <td className="p-4 text-center">{vendor.status}</td>
                                            <td className="p-4 text-center text-gray-600">
                                                {new Date(vendor.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="relative inline-block text-left">
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                                            id="options-menu"
                                                            aria-haspopup="true"
                                                            aria-expanded="true"
                                                        >
                                                            Actions
                                                            <ChevronDown className="ml-2 -mr-1 h-5 w-5" />
                                                        </button>
                                                    </div>

                                                    <div
                                                        className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        aria-labelledby="options-menu"
                                                    >
                                                        <div className="py-1" role="none">
                                                            <button
                                                                onClick={() => approveVendor(vendor._id)}
                                                                className="text-gray-700 block px-4 py-2 text-sm"
                                                                role="menuitem"
                                                            >
                                                                <ThumbsUp className="mr-2 inline" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => rejectVendor(vendor._id)}
                                                                className="text-gray-700 block px-4 py-2 text-sm"
                                                                role="menuitem"
                                                            >
                                                                <ThumbsDown className="mr-2 inline" />
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => openModal(vendor)}
                                                                className="text-gray-700 block px-4 py-2 text-sm"
                                                                role="menuitem"
                                                            >
                                                                <Eye className="mr-2 inline" />
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* BigModal - Vendor Details */}
                <BigModal isOpen={showModal} onClose={closeModal} title="Vendor Application Details">
                    {selectedVendor && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Full Name:</strong> {selectedVendor.fullName}</p>
                            <p><strong>Organization:</strong> {selectedVendor.organization}</p>
                            <p><strong>Email:</strong> {selectedVendor.email}</p>
                            <p><strong>Contact:</strong> {selectedVendor.contact}</p>
                            <p><strong>Address:</strong> {selectedVendor.address}</p>
                            <p><strong>Description:</strong> {selectedVendor.description}</p>

                            <div>
                                <strong>Profile Image:</strong>
                                <img src={selectedVendor.image} alt="Vendor" className="mt-2 w-32 rounded" />
                            </div>

                            {selectedVendor.idDocuments?.length > 0 && (
                                <div className="mt-4">
                                    <strong>ID Documents:</strong>
                                    <div className="flex space-x-2 overflow-x-auto py-2">
                                        {selectedVendor.idDocuments.map((doc, index) => (
                                            <img key={index} src={doc} alt={`ID ${index}`} className="rounded shadow w-32 h-32 object-cover" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </BigModal>
            </div>
        </div>
    );
};

export default PendingApplications;
