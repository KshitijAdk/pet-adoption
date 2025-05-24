import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect, useContext } from "react";
import { Eye, PawPrint, Plus, Home, Users, ListChecks, Clock, Shield, FileText, Search, RefreshCw } from "lucide-react";
import { AppContent } from '../context/AppContext';
import { UserDetailModal } from "./DetailsModal";
import { message, Modal, Input, Button, Form } from 'antd';

const AllAdmins = () => {
    const { userData, backendUrl } = useContext(AppContent);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered admins
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update filtered users whenever users or search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredUsers(
                users.filter(
                    (user) =>
                        (user.name?.toLowerCase().includes(lowerCaseQuery) || false) ||
                        (user.email?.toLowerCase().includes(lowerCaseQuery) || false)
                )
            );
        }
    }, [searchQuery, users]);

    const fetchUsers = () => {
        setLoading(true);
        setError(null);

        fetch(`${backendUrl}/api/user/admins`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setUsers(data.users);
                    setFilteredUsers(data.users); // Initialize filtered users
                    messageApi.success('Admins fetched successfully!');
                } else {
                    setError("Failed to fetch admins.");
                    messageApi.error('Failed to fetch admins');
                }
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching admins.");
                setLoading(false);
                console.error("Error fetching admins:", error);
                messageApi.error('Error fetching admins');
            });
    };

    const handleViewUser = (userId) => {
        const user = users.find(u => u._id === userId);
        setSelectedUser(user);
    };

    const handleAddAdmin = () => {
        setIsAddAdminModalOpen(true);
    };

    const handleAddAdminSubmit = async (values) => {
        try {
            const response = await fetch(`${backendUrl}/api/user/create-admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {
                messageApi.success("Admin created successfully!");
                fetchUsers(); // Refresh the list
                setIsAddAdminModalOpen(false);
                form.resetFields();
            } else {
                messageApi.error(data.message || "Failed to create admin");
            }
        } catch (error) {
            console.error("Error creating admin:", error);
            messageApi.error("Error creating admin");
        }
    };

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield },
        { path: "/admin/manage-blogs", label: "Manage Blog", icon: FileText }
    ];

    return (
        <div className="flex h-screen">
            {contextHolder}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">All Admins</h1>
                        <div className="flex items-center gap-3">
                            <div className="relative w-80">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg border border-gray-300 flex items-center gap-2"
                                title="Refresh Admins"
                            >
                                <RefreshCw size={18} />
                                <span className="text-sm">Refresh</span>
                            </button>
                            <button
                                onClick={handleAddAdmin}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Plus size={18} />
                                Add Admin
                            </button>
                        </div>
                    </div>
                    {loading && <p className="text-center text-gray-500">Loading admins...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && filteredUsers.length === 0 && (
                        <p className="text-center text-gray-500">No admins found.</p>
                    )}
                    {!loading && !error && filteredUsers.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg text-left">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                                        <th className="p-3">Photo</th>
                                        <th className="p-3">User Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
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
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleViewUser(user._id)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                                        title="View User"
                                                    >
                                                        <Eye size={18} />
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
            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
            {/* Add Admin Modal */}
            <Modal
                title="Add New Admin"
                open={isAddAdminModalOpen}
                onCancel={() => {
                    setIsAddAdminModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddAdminSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter the password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Create Admin
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AllAdmins;