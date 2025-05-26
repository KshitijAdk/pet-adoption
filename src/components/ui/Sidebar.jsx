import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, menuItems = [], title }) => {
    return (
        <div
            className={`${isSidebarOpen ? "w-56" : "w-18"} 
    bg-white text-gray-600 flex flex-col h-screen border-r border-gray-100 
    transition-all duration-200 ease-in-out relative`}
        >


            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
                {isSidebarOpen && (
                    <h1 className="text-lg font-medium text-gray-800 truncate">
                        {title}
                    </h1>
                )}
                <button
                    aria-label="Toggle sidebar"
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? (
                        <ChevronLeft size={18} className="shrink-0" />
                    ) : (
                        <ChevronRight size={18} className="shrink-0" />
                    )}
                </button>
            </div>

            {/* Sidebar Body (menu and footer separated with flex-grow) */}
            <div className="flex flex-col justify-between flex-grow overflow-hidden">
                {/* Menu */}
                <nav className="flex flex-col gap-1 mt-1 p-1 overflow-y-auto">
                    {menuItems.length > 0 ? (
                        menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center ${isSidebarOpen ? "px-3 py-2" : "justify-center p-2"} 
        ${isSidebarOpen ? "hover:bg-gray-50 hover:text-blue-500" : ""} 
        text-gray-500 transition-colors rounded-md group relative`}
                            >


                                <item.icon size={18} className="shrink-0" />
                                {isSidebarOpen && (
                                    <span className="ml-3 text-sm font-medium truncate">
                                        {item.label}
                                    </span>
                                )}
                                {/* {!isSidebarOpen && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-white text-xs font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                        {item.label}
                                    </div>

                                )} */}
                            </Link>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-400">
                            No menu items
                        </div>
                    )}
                </nav>

                {/* Footer 
                <div className="p-2 border-t border-gray-100">
                    <button
                        className={`flex items-center w-full p-2 rounded-md 
        ${isSidebarOpen ? "hover:bg-gray-50 hover:text-red-500" : ""} 
        text-gray-500 transition-colors`}
                    >
                        <LogOut size={16} />
                        {isSidebarOpen && <span className="ml-3 text-sm">Logout</span>}
                    </button>

                </div>*/}
            </div>
        </div>
    );
};


export default Sidebar;