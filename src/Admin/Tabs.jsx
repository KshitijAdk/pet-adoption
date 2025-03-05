import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tabs = ({ tabs = [], initialActiveTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || (tabs.length > 0 ? tabs[0].id : null));
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab && tabRefs.current[activeTab]) {
      const { offsetWidth, offsetLeft } = tabRefs.current[activeTab];
      setUnderlineStyle({ width: offsetWidth, left: offsetLeft });
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.link);
    onTabChange(tab.id); // Notify the parent component about the tab change
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
          onClick={() => handleTabClick(tab)}
        >
          {tab.label}
        </button>
      ))}

      <div
        className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300"
        style={{ width: underlineStyle.width, left: underlineStyle.left }}
      />
    </div>
  );
};

export default Tabs;