import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, menuItems, title }) => {
    return (
        <div
            className={`${isSidebarOpen ? "w-64" : "w-16"
                } bg-gray-800 text-white flex flex-col transition-all duration-300`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4">
                <h1
                    className={`text-2xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}
                >
                    {title}
                </h1>
                <button
                    className="text-white"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {/* Sidebar Menu */}
            <nav className="flex flex-col space-y-2 mt-4">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-500 active:bg-gray-600"
                    >
                        <item.icon size={20} />
                        {isSidebarOpen && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
