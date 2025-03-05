import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import Tabs from "./Tabs";
import ConfirmationPopup from "../components/ui/ConfirmationPopup";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Fetch users from API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch("http://localhost:3000/api/user")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setUsers(data.users);
                } else {
                    setError("Failed to fetch users.");
                }
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching users.");
                setLoading(false);
                console.error("Error fetching users:", error);
            });
    };

    // Delete user function
    const handleDelete = (userId) => {
        fetch("http://localhost:3000/api/user/delete-user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers(users.filter(user => user._id !== userId));
                } else {
                    setError("Failed to delete user.");
                }
            })
            .catch((error) => {
                setError("Error deleting user.");
                console.error("Error deleting user:", error);
            });
    };

    const adminTabs = [
        { id: "dashboard", label: "Dashboard", link: "/admin/dashboard" },
        { id: "manage-users", label: "Manage Users", link: "/admin/manage-users" },
        { id: "pending", label: "Pending Applications", link: "/admin/pending-vendors" },
        { id: "all", label: "All Applications", link: "/admin/manage-vendors" }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                <Tabs tabs={adminTabs} initialActiveTab="manage-users" />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>

                {loading && <p className="text-center text-gray-500">Loading users...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && users.length === 0 && (
                    <p className="text-center text-gray-500">No users found.</p>
                )}

                {!loading && !error && users.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg text-left">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                                    <th className="p-3">Photo</th>
                                    <th className="p-3">User Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                                        <td className="p-4 flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {user.image ? (
                                                    <img src={user.image} alt="User" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-lg font-semibold text-gray-600">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm">{user.name}</td>
                                        <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                        <td className="p-4 text-gray-600 text-sm">{user.role}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setConfirmDelete(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center justify-center space-x-1 text-sm w-full">
                                                <Trash size={14} />
                                                <span>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {confirmDelete && (
                <ConfirmationPopup
                    type="delete"
                    isOpen={!!confirmDelete}
                    onConfirm={() => {
                        handleDelete(confirmDelete);
                        setConfirmDelete(null);
                    }}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

export default ManageUsers;