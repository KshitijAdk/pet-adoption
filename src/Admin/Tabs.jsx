import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
    const tabRefs = useRef({});
    const navigate = useNavigate(); // Initialize the navigate function

    const tabs = [
        { id: "dashboard", label: "Dashboard", link: "/admin/dashboard" }, // Fixed link for dashboard
        { id: "manage-users", label: "Manage Users", link: "/admin/manage-users" },
        { id: "pending", label: "Pending Applications", link: "/admin/pending-vendors" }, // Fixed link for pending
        { id: "all", label: "All Applications", link: "/admin/manage-vendors" } // Fixed link for all applications
    ];

    useEffect(() => {
        if (tabRefs.current[activeTab]) {
            const { offsetWidth, offsetLeft } = tabRefs.current[activeTab];
            setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
        }
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab.id); // Update the activeTab state
        navigate(tab.link); // Perform the navigation using react-router
    };

    return (
        <div className="relative border-b flex space-x-10 text-gray-600 text-sm font-medium">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    ref={(el) => (tabRefs.current[tab.id] = el)}
                    className={`pb-3 relative transition-all ${
                        activeTab === tab.id ? "text-blue-600 font-semibold" : "hover:text-gray-800"
                    }`}
                    onClick={() => handleTabClick(tab)} // Use custom click handler
                >
                    {tab.label}
                </button>
            ))}

            {/* Underline Indicator */}
            <div
                className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300"
                style={{ width: underlineStyle.width, left: underlineStyle.left }}
            />
        </div>
    );
};

export default Tabs;
