import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";

const ConfirmationPopup = ({
  isOpen,
  onConfirm,
  onCancel,
  type = "warning", // Default type
  title,            // Customizable title
  message,          // Customizable message
  confirmText = "Confirm", // Custom confirm button text
  cancelText = "Cancel",   // Custom cancel button text
  confirmColor = "bg-red-600", // Custom confirm button color
  icon: customIcon, // Custom icon override
  showIcon = true   // Option to hide icon
}) => {
  if (!isOpen) return null;

  const defaultMessages = {
    logout: {
      title: "Logout",
      message: "Are you sure you want to logout?",
      icon: <LogOut className="text-red-500" size={24} />,
    },
    delete: {
      title: "Delete",
      message: "Are you sure you want to delete this item?",
      icon: <Trash2 className="text-red-500" size={24} />,
    },
    warning: {
      title: "Warning",
      message: "Are you sure you want to proceed?",
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
    },
  };

  // Use custom props if provided, otherwise fall back to type defaults
  const {
    title: defaultTitle,
    message: defaultMessage,
    icon: defaultIcon
  } = defaultMessages[type] || defaultMessages.warning;

  const displayTitle = title || defaultTitle;
  const displayMessage = message || defaultMessage;
  const displayIcon = customIcon || (showIcon && defaultIcon);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-[90%] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {displayIcon && (
          <div className="flex items-center gap-2">
            {displayIcon}
            <h2 className="text-lg font-semibold">{displayTitle}</h2>
          </div>
        )}

        <p className="text-gray-600 mt-2">{displayMessage}</p>

        <div className="flex gap-3 mt-4 justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 ${confirmColor} text-white rounded-md hover:opacity-90 transition-opacity`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;