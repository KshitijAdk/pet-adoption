import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Sidebar";

const ManageVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/vendors/all-vendors"); // Correct API URL
                if (!response.ok) {
                    throw new Error("Failed to fetch vendors");
                }
                const data = await response.json();
                setVendors(data.vendors); // Make sure backend sends an object with "vendors" array
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    return (
        <div className="flex h-screen bg-purple-50">
            {/* Sidebar on the left */}
            <div className="w-1/5">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
                <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Vendors</h1>

                {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && vendors.length === 0 && (
                    <p className="text-center text-gray-500">No vendors found.</p>
                )}

                {!loading && !error && vendors.length > 0 && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-purple-100">
                                <th className="p-3">Photo</th>
                                <th className="p-3">Vendor Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Contact Number</th>
                                <th className="p-3">Organization</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor._id} className="border-b hover:bg-purple-50">
                                    <td className="p-3">
                                        <img
                                            src={vendor.image || "https://via.placeholder.com/50"}
                                            alt={vendor.fullName}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    </td>
                                    <td className="p-3">{vendor.fullName}</td>
                                    <td className="p-3">{vendor.email}</td>
                                    <td className="p-3">{vendor.contact}</td>
                                    <td className="p-3">{vendor.organization}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-white ${vendor.status === "Approved"
                                                ? "bg-green-500"
                                                : vendor.status === "Denied"
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                                }`}
                                        >
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex items-center space-x-2">
                                        <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center">
                                            <CheckCircle size={16} />
                                        </button>
                                        <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center">
                                            <XCircle size={16} />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageVendors;
