import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowLeft, LogOut, Home, Users, Clock, ListChecks, PawPrint, Shield } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield },
    ];

    return (
        <div
            className={`${isSidebarOpen ? "w-64" : "w-16"} 
                bg-white text-gray-700 flex flex-col h-full border-r border-gray-200 
                shadow-sm transition-all duration-300 relative`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h1
                    className={`text-2xl font-semibold text-gray-800 ${isSidebarOpen ? "block" : "hidden"}`}
                >
                    Admin Panel
                </h1>
                <button
                    className="text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex flex-col space-y-1 mt-2 flex-grow">
                {adminMenuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 text-gray-600 
                        hover:text-blue-600 transition-colors rounded-lg mx-2"
                    >
                        <div className="text-gray-500">
                            <item.icon size={18} />
                        </div>
                        {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className={`mt-auto border-t border-gray-100 py-3 ${isSidebarOpen ? "px-4" : "px-2"}`}>
                <Link
                    to="/"
                    className="flex items-center space-x-3 px-2 py-2 mb-2 text-gray-600 hover:text-blue-600 
                    hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <ArrowLeft size={18} />
                    {isSidebarOpen && <span className="font-medium">Back to Website</span>}
                </Link>

                <Link
                    to="/logout"
                    className="flex items-center space-x-3 px-2 py-2 text-gray-600 hover:text-red-600 
                    hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    {isSidebarOpen && <span className="font-medium">Logout</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;