import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionLink,
    actionOnClick,
    actionType = "link", // "link" or "button"
    iconClassName = "h-12 w-12 text-yellow-500",
    actionClassName = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700",
}) => {
    return (
        <div className="text-center py-12">
            {Icon && <Icon className={`mx-auto ${iconClassName}`} />}

            {title && (
                <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
            )}

            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}

            {(actionText && (actionLink || actionOnClick)) && (
                <div className="mt-6">
                    {actionType === "link" && actionLink ? (
                        <Link
                            to={actionLink}
                            className={actionClassName}
                        >
                            {actionText}
                        </Link>
                    ) : (
                        <button
                            onClick={actionOnClick}
                            className={actionClassName}
                        >
                            {actionText}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;