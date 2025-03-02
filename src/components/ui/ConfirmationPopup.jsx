import { useState } from "react";
import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";
// import { Button } from "lucide-react";

const ConfirmationPopup = ({ type, isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const messages = {
    logout: {
      title: "Logout",
      message: "Are you sure you want to logout?",
      icon: <LogOut className="text-red-500" size={24} />,
    },
    delete: {
      title: "Delete User",
      message: "Are you sure you want to delete the user?",
      icon: <Trash2 className="text-red-500" size={24} />,
    },
    warning: {
      title: "Warning",
      message: "Are you sure you want to proceed?",
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
    },
  };

  const { title, message, icon } = messages[type] || messages.warning;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 border rounded-md" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;