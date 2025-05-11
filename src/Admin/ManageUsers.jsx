import Sidebar from "../components/ui/Sidebar";
import { useState, useEffect, useContext } from "react";
import { Trash, Ban, Check, Eye, Clock, PawPrint, Shield , Home, ListChecks, Users} from "lucide-react";
import ConfirmationPopup from "../components/ui/ConfirmationPopup";
import FeedbackModal from "../components/ui/FeedbackModal";
import { AppContent } from '../context/AppContext';
import { UserDetailModal } from "./DetailsModal";
import { message } from 'antd';


const ManageUsers = () => {
    const { userData, backendUrl } = useContext(AppContent);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        userId: null,
        action: null
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(`${backendUrl}/api/user`)
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

    const handleDelete = (userId) => {
        fetch(`${backendUrl}/api/user/delete-user`, {
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
                    messageApi.success('User deleted successfully!');
                } else {
                    setError("Failed to delete user.");
                    messageApi.error(data.message || 'Failed to delete user');
                }
            })
            .catch((error) => {
                setError("Error deleting user.");
                console.error("Error deleting user:", error);
                messageApi.error('Error deleting user');
            });
    };

    const handleBanUnban = (userId, isBanned, remarks = "") => {
        const action = isBanned ? 'unban' : 'ban';
        const adminId = userData?.userId;

        // Optimistically update the UI
        const previousUsers = [...users];
        setUsers(users.map(user =>
            user._id === userId ? {
                ...user,
                banInfo: {
                    ...user.banInfo,
                    isBanned: !isBanned,
                    remarks: action === 'ban' ? remarks : user.banInfo?.remarks
                }
            } : user
        ));

        fetch(`${backendUrl}/api/user/${action}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                remarks,
                adminId
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers(users.map(user =>
                        user._id === userId ? {
                            ...user,
                            banInfo: data.user.banInfo
                        } : user
                    ));

                    messageApi.success(`User ${action === 'ban' ? 'banned' : 'unbanned'} successfully!`);
                } else {
                    // Revert optimistic update on failure
                    setUsers(previousUsers);
                    setError(`Failed to ${action} user: ${data.message}`);
                    messageApi.error(data.message || `Failed to ${action} user`);
                }
            })
            .catch((error) => {
                // Revert optimistic update on error
                setUsers(previousUsers);
                setError(`Error ${action}ning user.`);
                console.error(`Error ${action}ning user:`, error);
                messageApi.error(`Error ${action}ning user`);
            });
    };

    const handleConfirmAction = () => {
        if (!confirmAction) return;

        const { action, userId, isBanned } = confirmAction;

        if (action === 'delete') {
            handleDelete(userId);
        } else if (action === 'ban') {
            setFeedbackModal({
                isOpen: true,
                userId: userId,
                action: 'ban'
            });
        } else if (action === 'unban') {
            handleBanUnban(userId, isBanned);
        }

        setConfirmAction(null);
    };

    const handleFeedbackSubmit = (feedback) => {
        const { userId, action } = feedbackModal;

        if (action === 'ban') {
            const user = users.find(u => u._id === userId);
            if (user) {
                handleBanUnban(userId, user.banInfo?.isBanned, feedback);
            }
        }

        setFeedbackModal({
            isOpen: false,
            userId: null,
            action: null
        });
    };

    const handleViewUser = (userId) => {
        const user = users.find(u => u._id === userId);
        setSelectedUser(user);
    };

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield }
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
                                        <th className="p-3">Status</th>
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
                                            <td className="p-4 text-gray-600 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.banInfo?.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {user.banInfo?.isBanned ? 'Banned' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleViewUser(user._id)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                                        title="View User"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (user.banInfo?.isBanned) {
                                                                setConfirmAction({
                                                                    action: 'unban',
                                                                    userId: user._id,
                                                                    isBanned: true
                                                                });
                                                            } else {
                                                                setFeedbackModal({
                                                                    isOpen: true,
                                                                    userId: user._id,
                                                                    action: 'ban'
                                                                });
                                                            }
                                                        }}
                                                        className={`p-2 rounded-full hover:bg-opacity-20 ${user.banInfo?.isBanned
                                                            ? 'text-green-500 hover:bg-green-100'
                                                            : 'text-yellow-500 hover:bg-yellow-100'
                                                            }`}
                                                        title={user.banInfo?.isBanned ? 'Unban User' : 'Ban User'}
                                                    >
                                                        {user.banInfo?.isBanned ? (
                                                            <Check size={18} />
                                                        ) : (
                                                            <Ban size={18} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmAction({ action: 'delete', userId: user._id })}
                                                        className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                                                        title="Delete User"
                                                    >
                                                        <Trash size={18} />
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
            {confirmAction && (
                <ConfirmationPopup
                    type={confirmAction.action}
                    isOpen={!!confirmAction}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setConfirmAction(null)}
                    title={
                        confirmAction.action === 'delete'
                            ? 'Delete User'
                            : confirmAction.action === 'unban'
                                ? 'Unban User'
                                : undefined
                    }
                    message={
                        confirmAction.action === 'delete'
                            ? 'Are you sure you want to delete this user? This action cannot be undone.'
                            : confirmAction.action === 'unban'
                                ? 'Are you sure you want to unban this user?'
                                : undefined
                    }
                />
            )}

            <FeedbackModal
                isOpen={feedbackModal.isOpen}
                onClose={() => setFeedbackModal({ isOpen: false, userId: null, action: null })}
                onSubmit={handleFeedbackSubmit}
                title="Ban User"
                description="Please provide a reason for banning this user. This information will be stored and may be displayed to the user."
                placeholder="Enter ban reason..."
            />
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default ManageUsers;