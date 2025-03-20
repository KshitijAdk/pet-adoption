import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect } from "react";
import { Calendar, Clock, ThumbsUp, ThumbsDown, Home, Users, ListChecks } from "lucide-react";

const PendingApplications = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/vendors/pending-vendors");
                if (!response.ok) {
                    throw new Error("Failed to fetch vendors");
                }
                const data = await response.json();
                setVendors(data.vendors);
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
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to approve vendor");
            }

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
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to reject vendor");
            }

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
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Applications</h1>

                    {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && vendors.length === 0 && (
                        <p className="text-center text-gray-500">No pending vendors found.</p>
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
                                            <td className="p-4 text-gray-600 text-sm">{vendor.fullName}</td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.contact || "N/A"}</td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.organization || "N/A"}</td>
                                            <td className="p-4 text-gray-600 text-sm">{vendor.description || "N/A"}</td>
                                            <td className="p-4 text-center">{vendor.status}</td>
                                            <td className="p-4 text-gray-600 text-sm text-center">
                                                <Calendar size={14} className="mr-1 text-gray-500" />
                                                {new Date(vendor.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1" onClick={() => approveVendor(vendor._id)}><ThumbsUp size={14} /><span>Approve</span></button>
                                                <button className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 mt-2" onClick={() => rejectVendor(vendor._id)}><ThumbsDown size={14} /><span>Reject</span></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingApplications;