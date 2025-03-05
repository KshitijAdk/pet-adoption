import Tabs from "./Tabs";

const AdminDashboard = () => {
    const adminTabs = [
        { id: "dashboard", label: "Dashboard", link: "/admin/dashboard" },
        { id: "manage-users", label: "Manage Users", link: "/admin/manage-users" },
        { id: "pending", label: "Pending Applications", link: "/admin/pending-vendors" },
        { id: "all", label: "All Applications", link: "/admin/manage-vendors" }
    ];
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md mb-4 p-4 rounded-lg">
                <Tabs tabs={adminTabs} initialActiveTab="dashboard" />
            </div>
        </div>
    )
}

export default AdminDashboard;