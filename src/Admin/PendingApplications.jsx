import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Calendar, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import Tabs from "./Tabs";

const PendingApplications = () => {
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

            // Update the UI after approval
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

            // Update the UI after approval
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


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                <Tabs />
            </div>

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
                                        <td className="p-4 text-gray-600 text-sm">
                                            <p>{vendor.contact || "N/A"}</p><br></br>
                                            <p className="text-xs text-gray-500">{vendor.address || "N/A"}</p>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{vendor.organization || "N/A"}</td>
                                        <td className="p-4 text-gray-600 text-sm">{vendor.description || "N/A"}</td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center w-fit mx-auto 
        ${vendor.status.toLowerCase() === "approved" ? "bg-green-100 text-green-700 border border-green-500" :
                                                        vendor.status.toLowerCase() === "rejected" ? "bg-red-100 text-red-700 border border-red-500" :
                                                            "bg-yellow-100 text-yellow-700 border border-yellow-500"}`}
                                            >
                                                {vendor.status.toLowerCase() === "approved" ? (
                                                    <><CheckCircle size={14} className="mr-1 text-green-500" /> Approved</>
                                                ) : vendor.status.toLowerCase() === "rejected" ? (
                                                    <><XCircle size={14} className="mr-1 text-red-500" /> Rejected</>
                                                ) : (
                                                    <><Clock size={14} className="mr-1 text-yellow-500" /> Pending</>
                                                )}
                                            </span>

                                        </td>
                                        <td className="p-4 text-gray-600 text-sm text-center flex items-center justify-center">
                                            <Calendar size={14} className="mr-1 text-gray-500" />
                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                                                    onClick={() => approveVendor(vendor._id)}>
                                                    <ThumbsUp size={14} />
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                                                    onClick={() => rejectVendor(vendor._id)}>
                                                    <ThumbsDown size={14} />
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingApplications;
