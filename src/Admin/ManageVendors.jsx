import React from "react";
import { CheckCircle, XCircle, MessageCircle } from "lucide-react";
import Sidebar from "./Sidebar";

const vendors = [
    {
        photo: "https://via.placeholder.com/50",
        name: "Vendor 1",
        email: "vendor1@example.com",
        contact: "+61 400 000 001",
        organization: "Org A",
        status: "Approved",
    },
    {
        photo: "https://via.placeholder.com/50",
        name: "Vendor 2",
        email: "vendor2@example.com",
        contact: "+61 400 000 002",
        organization: "Org B",
        status: "Pending",
    },
    {
        photo: "https://via.placeholder.com/50",
        name: "Vendor 3",
        email: "vendor3@example.com",
        contact: "+61 400 000 003",
        organization: "Org C",
        status: "Denied",
    },
];

const ManageVendors = () => {
    return (
        <div className="flex h-screen bg-purple-50">
            {/* Sidebar on the left */}
            <div className="w-1/5">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
                <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Vendors</h1>
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
                        {vendors.map((vendor, index) => (
                            <tr key={index} className="border-b hover:bg-purple-50">
                                <td className="p-3">
                                    <img src={vendor.photo} alt={vendor.name} className="w-12 h-12 rounded-full" />
                                </td>
                                <td className="p-3">{vendor.name}</td>
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
                                <td className="p-3 space-x-2">
                                    <button className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
                                        <CheckCircle size={16} />
                                    </button>
                                    <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
                                        <XCircle size={16} />
                                    </button>
                                    <button className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600">
                                        <MessageCircle size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <button className="px-4 py-2 mx-1 bg-purple-500 text-white rounded-full hover:bg-purple-600">
                        1
                    </button>
                    <button className="px-4 py-2 mx-1 bg-gray-200 rounded-full hover:bg-gray-300">
                        2
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageVendors;
