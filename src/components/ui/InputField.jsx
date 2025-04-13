import React from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

const InputField = ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    isPasswordShown,
    togglePasswordVisibility,
    error,
    icon: Icon,
    iconPosition = "left",
    className = "",
    ...props
}) => {
    // Convert value to string if it's a number
    const stringValue = typeof value === "number" ? value.toString() : value;

    return (
        <div className="mb-4">
            {/* Label */}
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative">
                {/* Left icon if provided */}
                {Icon && iconPosition === "left" && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                {/* Input field */}
                <input
                    id={id}
                    type={isPasswordShown && type === "password" ? "text" : type}
                    placeholder={placeholder}
                    value={stringValue || ""}
                    onChange={onChange}
                    className={`w-full h-11 rounded-lg border-2 bg-white ${error
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-amber-500"
                        } focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200 text-gray-800 ${Icon && iconPosition === "left" ? "pl-10" : "pl-4"
                        } ${(type === "password" && togglePasswordVisibility) ||
                            (Icon && iconPosition === "right")
                            ? "pr-10"
                            : "pr-4"
                        } ${className}`}
                    {...props}
                />

                {/* Right icon if provided */}
                {Icon && iconPosition === "right" && !togglePasswordVisibility && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                {/* Password toggle icon */}
                {type === "password" && togglePasswordVisibility && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-amber-600 transition-colors duration-200"
                        aria-label={isPasswordShown ? "Hide password" : "Show password"}
                    >
                        {isPasswordShown ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center mt-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            )}
        </div>
    );
};

InputField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    isPasswordShown: PropTypes.bool,
    togglePasswordVisibility: PropTypes.func,
    error: PropTypes.string,
    icon: PropTypes.elementType, // For Lucide or other React icons
    iconPosition: PropTypes.oneOf(["left", "right"]),
    className: PropTypes.string,
};

export default InputField;