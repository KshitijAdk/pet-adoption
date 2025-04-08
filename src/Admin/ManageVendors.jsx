import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Calendar, Clock, ThumbsUp, ThumbsDown, Home, Users, ListChecks, Eye, MoreHorizontal } from "lucide-react";
import BigModal from "../components/ui/BigModal";  // Import BigModal component

const ManageVendors = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);  // State to store selected vendor
    const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage which dropdown is open
    const dropdownRefs = useRef({}); // Ref for the dropdown menu

    const buttonRefs = useRef({});

    const toggleDropdown = (vendorId, e) => {
        e.stopPropagation();
        setDropdownOpen(dropdownOpen === vendorId ? null : vendorId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if we clicked outside any dropdown and not on any button
            const clickedOutsideDropdown = Object.values(dropdownRefs.current).every(ref => {
                return ref && !ref.contains(event.target);
            });

            const clickedOutsideButton = Object.values(buttonRefs.current).every(ref => {
                return ref && !ref.contains(event.target);
            });

            if (clickedOutsideDropdown && clickedOutsideButton) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/vendors/all-vendor-applications");
                if (!response.ok) {
                    throw new Error("Failed to fetch vendors");
                }
                const data = await response.json();
                setVendors(data.data || []);
            } catch (err) {
                setError(err.message);
                setVendors([]);
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
            setVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor._id === vendorId ? { ...vendor, status: "Approved" } : vendor
                )
            );
        } catch (error) {
            console.error(error);
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
            setVendors((prevVendors) =>
                prevVendors.map((vendor) =>
                    vendor._id === vendorId ? { ...vendor, status: "Rejected" } : vendor
                )
            );
        } catch (error) {
            console.error(error);
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
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks }
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
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Vendors</h1>

                    {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && vendors.length === 0 && (
                        <p className="text-center text-gray-500">No vendors found.</p>
                    )}

                    {!loading && !error && vendors.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg text-left">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                                        <th className="p-4">Applicant</th>
                                        <th className="p-4">Business Details</th>
                                        <th className="p-4">Organization</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.map((vendor) => (
                                        <tr key={vendor._id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                                            <td className="p-4 flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {vendor.image ? (
                                                        <img src={vendor.image} alt="Vendor" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-semibold text-gray-600">N/A</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{vendor.fullName}</p>
                                                    <p className="text-xs text-gray-500">{vendor.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.contact || "N/A"}</td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.organization || "N/A"}</td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.description || "N/A"}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center w-fit mx-auto ${vendor.status.toLowerCase() === "approved" ? "bg-green-100 text-green-700 border border-green-500" : vendor.status.toLowerCase() === "rejected" ? "bg-red-100 text-red-700 border border-red-500" : "bg-yellow-100 text-yellow-700 border border-yellow-500"}`}>
                                                    {vendor.status.toLowerCase() === "approved" ? <><CheckCircle size={14} className="mr-1 text-green-500" /> Approved</> : vendor.status.toLowerCase() === "rejected" ? <><XCircle size={14} className="mr-1 text-red-500" /> Rejected</> : <><Clock size={14} className="mr-1 text-yellow-500" /> Pending</>}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs text-gray-500 hidden md:table-cell">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                {/* 3-dot button for dropdown */}
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={(e) => toggleDropdown(vendor._id, e)}>
                                                    <MoreHorizontal size={20} />
                                                </button>


                                                {/* Dropdown Menu */}
                                                {dropdownOpen === vendor._id && (
                                                    <div
                                                        ref={el => dropdownRefs.current[vendor._id] = el}
                                                        className="absolute right-5 z-10 bg-white shadow-lg rounded-lg mt-2 w-46 py-3 border border-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                                                    >
                                                        <button
                                                            onClick={() => approveVendor(vendor._id)}
                                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-200 transition-all duration-200"
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                            <span>Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => rejectVendor(vendor._id)}
                                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-red-200 transition-all duration-200"
                                                        >
                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                            <span>Reject</span>
                                                        </button>
                                                        <button
                                                            onClick={() => openModal(vendor)}
                                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-200 transition-all duration-200"
                                                        >
                                                            <Eye className="w-5 h-5 text-blue-600" />
                                                            <span>View Details</span>
                                                        </button>
                                                    </div>
                                                )}


                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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
    );
};

export default ManageVendors;
