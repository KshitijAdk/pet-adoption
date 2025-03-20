import Sidebar from "../components/ui/Sidebar";
import { useState } from "react";
import { Home, Users, Clock, ListChecks } from "lucide-react";

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                    <p>Welcome to the admin dashboard. Select a section from the sidebar.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
