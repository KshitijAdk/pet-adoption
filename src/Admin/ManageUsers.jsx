import React, { useState, useEffect } from "react";
import { XCircle, RefreshCw } from "lucide-react";
import Sidebar from "./Sidebar";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    // Fetch users from API
    useEffect(() => {
        fetch("http://localhost:3000/api/user")
            .then((response) => response.json())
            .then((data) => setUsers(data.users))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-6">
                    <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Users</h1>

                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-purple-100 text-black">
                                <th className="p-3">Photo</th>
                                <th className="p-3">User Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Update</th>
                                <th className="p-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <img src={user.image}
                                            alt={user.name[0]}
                                            className="w-10 h-10 rounded-full" />
                                    </td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        <button className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                                            Update <RefreshCw size={16} />
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <button className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                            Delete <XCircle size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
